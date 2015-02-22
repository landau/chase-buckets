'use strict';

var React = require('react');
var {createClass} = React;
var {FluxMixin, StoreWatchMixin} = require('fluxxor');
FluxMixin = FluxMixin(React);

var CsvForm = createClass({
  getInitialState() {
    return {
      text: ''  
    };
  },
  
  onChange(e) {
    var {value} = e.target;
    this.props.onChange(value);
    this.setState({
      text: value
    });
  },

  render() {
    return <textarea className="form-control" onChange={this.onChange} />;
  }
});

exports.App = createClass({
  mixins: [FluxMixin, StoreWatchMixin('Store')],
  
  getStateFromFlux(){
    return this.getFlux().store('Store').getState();
  },

  onTextAreaChange(csv) {
    this.getFlux().actions.addCsv(csv);
  },
  
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <label>Insert CSV</label>
          <CsvForm onChange={this.onTextAreaChange} />
        </div>
      </div>
    );
  }
});
