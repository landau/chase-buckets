'use strict';

var {createClass, PropTypes} = require('react');

module.exports = createClass({
  displayName: 'bucket-list',

  propTypes: {
    buckets: PropTypes.arrayOf(PropTypes.string).isRequired,
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
             {this.props.buckets.map(this.renderOption)}
           </select>
         </div>
      </form>
    );
  },

  renderOption(bucketName) {
    var isActive = this.state.active === bucketName;
    return <option key={bucketName} defaultValue={isActive} onClick={this.onSelect}>{bucketName}</option>
  }
});
