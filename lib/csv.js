'use strict';
var _ = require('lodash');
var pred = require('predicate');

function CSVToArray(strData, strDelimiter){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );
    }

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    var strMatchedValue;
    if (arrMatches[ 2 ]){
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ), "\"");
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[ 3 ];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}

var csv = module.exports = (str) => {
  var rows = CSVToArray(str.trim(), ',');

  var header = rows.shift().map(h => {
    return h.toLowerCase().replace(' ', '_').replace(/"/g, '').replace('\r', '');
  });

  return rows.map(row => {
    return row.reduce((acc, col, i) => {
      var head = header[i];
      acc[head] = col.replace(/"/g, '').replace('\r', '');
      return acc;
    }, {});
  }, {});
};

// Transforms chase's account csv values to match
// the credit card
csv.fromAccount = (str) => {
  // Look at the Details property and convert that to type
  // Return === dslip && credit
  // Sale === check debit

  var entries = csv(str);
  if (!entries.length || !entries[0].balance) return entries;

  // This is also whack
  // posting_date === post_date

  return entries.map((e)=> {
    var type = ['dslip', 'credit'].some(pred.equal(e.details.toLowerCase())) ? 'Return' : 'Sale';
    return _.defaults({ type: type, post_date: e.posting_date}, e);
  });
};
