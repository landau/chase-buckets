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
    this.setState({
      text: ''
    });
    this.props.onAddBucket(this.state.text);
  },

  onDel(e) {
    e.preventDefault();
    this.props.onDeleteBucket(this.state.active);
    this.setState({
      active: null
    });
  },

  onSelect(name) {
    this.setState({
      active: name
    });
  },

  render() {
    return (
      <form>
         <div className="form-group">
          <input type="text" className="form-control" placeholder="Type Bucket Name"
            value={this.state.text} onChange={this.onChange} />
         </div>
         <div className="form-group">
           <button type="submit" className="btn btn-sm btn-primary" onClick={this.onAdd}>Add</button>
           <button type="button" className="btn btn-sm btn-secondary" onClick={this.onDel}>Delete</button>
         </div>
         <div className="form-group">
           <select multiple className="form-control" size={Object.keys(this.props.buckets).length}>
             {_.map(this.props.buckets, this.renderOption)}
           </select>
         </div>
      </form>
    );
  },

  renderOption(bucket) {
    var isActive = this.state.active === bucket.name;
    var str = `${bucket.name} - ${'$' + bucket.getTotal()}`;
    return <option key={bucket.name} defaultValue={isActive} onClick={this.onSelect.bind(this, bucket.name)}>{str}</option>
  }
});
