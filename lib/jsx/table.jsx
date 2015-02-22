'use strict';
var {createClass} = require('react');

module.exports = createClass({
  displayName: 'table',

  render() {
    return (
      <table className="table">
        {this.renderTableHeader()}
        <tbody>
        {this.props.data.map(this.renderTableRow)}
        </tbody>
      </table>
    );
  },

  renderTableHeader() {
    return (
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
    );
  },

  renderTableRow(entry) {
    return (
      <tr key={entry.post_date + entry.description + entry.amount}>
        <td>{entry.post_date}</td>
        <td>{entry.type}</td>
        <td>{entry.amount}</td>
        <td>{entry.description}</td>
      </tr>
    );
  }
});
