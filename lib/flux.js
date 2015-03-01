'use strict';

var pred = require('predicate');
var parseCsv = require('./csv');
var {createStore} = require('fluxxor');
var {Buckets} = require('./buckets');

/* Modeling */
class Entry {
  constructor(type, desc, amount) {
    this.type = type;
    this.desc = desc;
    this.amount = amount;
  }
}

/* Consts */
var BUCKET = {
  ADD: 'bucket:add',
  DEL: 'bucket:del'
};

var ENTRY = {
  ADD: 'entry:add'
};

var CSV = {
  ADD: 'csv:add'
};

/* Store */
var Store = createStore({
  initialize() {
    this.bindActions(
      BUCKET.ADD, this.onAddBucket,
      BUCKET.DEL, this.onDeleteBucket,
      ENTRY.ADD, this.onAddEntryToBucket,
      CSV.ADD, this.onAddCsv
    );

    this.buckets = new Buckets(localStorage);
    this.data = [];
  },

  getState() {
    return {
      buckets: this.buckets,
      data: this.data
    };
  },

  onAddBucket(bucketName) {
    this.buckets.add(bucketName);
    this.emit('change');
  },

  onDeleteBucket(bucketName) {
    this.buckets.remove(bucketName);
    this.emit('change');
  },

  onAddCsv(csv) {
    this.data = parseCsv(csv);
    this.data
      .filter(entry => ['Payment', 'Pending'].every(pred.not.equal(entry.type)))
      .forEach(entry => this.buckets.addEntry(entry), this);
    this.emit('change');
  },

  onAddEntryToBucket(payload) {
    var {entry, bucketName} = payload;
    this.buckets.addEntryToBucket(bucketName, entry);
    this.emit('change');
  }
});

/* actions */
var actions = {
  addBucket(bucketName) {
    this.dispatch(BUCKET.ADD, bucketName);
  },
  delBucket(bucketName) {
    this.dispatch(BUCKET.DEL, bucketName);
  },
  addCsv(bucketName) {
    this.dispatch(CSV.ADD, bucketName);
  },
  addEntryToBucket(bucketName, entry) {
    this.dispatch(ENTRY.ADD, { entry, bucketName });
  }
};

var {Flux} = require('fluxxor');

var stores = {
  Store: new Store()
};

exports.flux = new Flux(stores, actions);
