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
    this.setState({
      text: value
    });
    this.props.onChange(value);
  },

  render() {
    return <textarea className="form-control" onChange={this.onChange} />;
  }
});
