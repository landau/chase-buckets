'use strict';

module.exports = (str) => {
  var rows = str.trim().split('\n').map(row => row.split(','));

  var header = rows.shift().map(h => {
    return h.toLowerCase().replace(' ', '_').replace('\r', '');
  });

  return rows.map(row => {
    return row.reduce((acc, col, i) => {
      var head = header[i];
      acc[head] = col.replace(/"/g, '').replace('\r', '');
      return acc;
    }, {});
  }, {});
};
