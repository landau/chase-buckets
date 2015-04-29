'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8"/>
          <title>Chase Bucketer</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="http://bootswatch.com/flatly/bootstrap.css"/>
          <link rel="stylesheet" href="http://bootswatch.com/assets/css/bootswatch.min.css"/>
        </head>
        <body>
          <div className="container" id="app"></div>
          <script src="/public/js/bundle.js"></script>
        </body>
      </html>
    );
  }
});
