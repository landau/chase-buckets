'use strict';
var {createClass} = require('react');

var EntryRow = createClass({
  getDefaultProps() {
    return { buckets: [] };
  },

  onChange(e) {
    this.props.onChangeBucket(e.target.value, this.props.entry);
  },

  render() {
    var entry = this.props.entry;
    return (
      <tr>
        <td>{entry.post_date}</td>
        <td>{entry.type}</td>
        <td>{entry.amount}</td>
        <td>{entry.description}</td>
        <td>{this.renderBuckets()}</td>
      </tr>
    );
  },

  renderBuckets() {

    return (
      <select defaultValue={this.props.bucketName} onChange={this.onChange}>
        {this.props.buckets.map(this.renderBucket)}
      </select>
    );
  },

  renderBucket(bucket) {
    return (
      <option key={bucket} value={bucket}>
        {bucket}
      </option>
    );
  }
  
});

module.exports = createClass({
  displayName: 'table',

  render() {
    return (
      <table className="table">
        {this.renderTableHeader()}
        <tbody>
        {this.props.bucket.entries.map(this.renderTableRow, this)}
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
          <th>Bucket</th>
        </tr>
      </thead>
    );
  },

  renderTableRow(entry) {
    var key = entry.post_date + entry.description + entry.amount;
    return (
      <EntryRow key={key} entry={entry}
        bucketName={this.props.bucket.name}
        buckets={this.props.buckets}
        onChangeBucket={this.props.onChangeBucket} />
    );
  }
});
