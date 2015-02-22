'use strict';

module.exports = require('react').createClass({
  displayName: 'csv',
  
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
