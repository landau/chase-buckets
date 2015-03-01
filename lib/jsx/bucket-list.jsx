'use strict';

var {createClass, PropTypes} = require('react');
var _ = require('lodash');

module.exports = createClass({
  displayName: 'bucket-list',

  propTypes: {
    onAddBucket: PropTypes.func.isRequired,
    onDeleteBucket: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      text: '',
      active: null
    };
  },

  onChange(e) {
    var {value} = e.target;
    this.setState({
      text: e.target.value
    });
  },

  onAdd(e) {
    e.preventDefault();
    this.props.onAddBucket(this.state.text);
  },

  onDel(e) {
    e.preventDefault();
    this.props.onDeleteBucket(this.state.active);
    this.setState({
      active: null
    });
  },

  onSelect(e) {
    this.setState({
      active: e.target.value
    });
  },

  render() {
    return (
      <form>
         <div className="form-group">
          <input type="text" className="form-control" placeholder="Type Bucket Name" onChange={this.onChange} />
         </div>
         <div className="form-group">
           <button type="submit" className="btn btn-sm btn-primary" onClick={this.onAdd}>Add</button>
           <button type="button" className="btn btn-sm btn-secondary" onClick={this.onDel}>Delete</button>
         </div>
         <div className="form-group">
           <select multiple className="form-control">
             {_.map(this.props.buckets, this.renderOption)}
           </select>
         </div>
      </form>
    );
  },

  renderOption(bucket) {
    var isActive = this.state.active === bucket.name;
    return <option key={bucket.name} defaultValue={isActive} onClick={this.onSelect}>{bucket.name}</option>
  }
});
