'use strict';

var {createClass} = require('react');

module.exports = createClass({
  displayName: 'user',

  getInitialState() {
    return {
      user: '',
      pass: ''
    };
  },

  onChange(e) {
    let {value, name} = e.target;
    let s = {};
    s[name] = value;
    this.setState(s);
  },

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.user, this.state.pass);
  },

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="user" value={this.state.user} onChange={this.onChange} placeholder='user' />
          <input type="password" name="pass" value={this.state.pass} onChange={this.onChange} placeholder='pass' />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
});
