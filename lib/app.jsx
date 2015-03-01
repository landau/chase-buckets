'use strict';

var React = require('react');
var {createClass, PropTypes} = React;
var {FluxMixin, StoreWatchMixin} = require('fluxxor');
FluxMixin = FluxMixin(React);
var CsvForm = require('./jsx/csv.jsx');
var BucketList = require('./jsx/bucket-list.jsx');
var Table = require('./jsx/table.jsx');
var _ = require('lodash');
var pred = require('predicate');

exports.App = createClass({
  mixins: [FluxMixin, StoreWatchMixin('Store')],
  
  getStateFromFlux(){
    return this.getFlux().store('Store').getState();
  },

  onTextAreaChange(csv) {
    this.getFlux().actions.addCsv(csv);
  },

  onAddBucket(name) {
    this.getFlux().actions.addBucket(name);
  },

  onDeleteBucket(name) {
    this.getFlux().actions.delBucket(name);
  },

  onChangeBucket(bucketName, entry) {
    this.getFlux().actions.addEntryToBucket(bucketName, entry);
  },

  render() {
    var buckets = this.state.buckets.filter((b, name)=> name !== 'unknown');
    
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <label>Insert CSV</label>
            <CsvForm onChange={this.onTextAreaChange} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3">
            <BucketList buckets={buckets} onAddBucket={this.onAddBucket} onDeleteBucket={this.onDeleteBucket} />
          </div>
          <div className="col-md-9">
            {_.map(this.state.buckets.buckets, this.renderTable, this)}
          </div>
        </div>
      </div>
    );
  },

  renderTable(bucket) {
    var bucketNames = this.state.buckets.getNames();

    if (!bucket.entries.length) return null;
    
    return (
      <div key={bucket.name}>
        <h3>{bucket.name}</h3>
        <Table bucket={bucket} buckets={bucketNames} onChangeBucket={this.onChangeBucket} />
      </div>
    );
  }
});
