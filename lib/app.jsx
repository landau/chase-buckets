'use strict';

var React = require('react');
var {createClass, PropTypes} = React;
var {FluxMixin, StoreWatchMixin} = require('fluxxor');
FluxMixin = FluxMixin(React);
var CsvForm = require('./jsx/csv.jsx');
var BucketList = require('./jsx/bucket-list.jsx');
var Table = require('./jsx/table.jsx');

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

  render() {
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
            <BucketList buckets={Object.keys(this.state.buckets)}
               onAddBucket={this.onAddBucket} onDeleteBucket={this.onDeleteBucket} />
          </div>
          <div className="col-md-9"><Table data={this.state.data} /></div>
        </div>
      </div>
    );
  },
});
