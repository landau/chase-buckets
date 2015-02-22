'use strict';

var parseCsv = require('./csv');
var {createStore} = require('fluxxor');

/* Modeling */
class Entry {
  constructor(type, desc, amount) {
    this.type = type;
    this.desc = desc;
    this.amount = amount;
  }
}

/*  Bucket operations via localstorage */
if (!localStorage.buckets) localStorage.buckets = JSON.stringify({});
function getBuckets() {
  return JSON.parse(localStorage.buckets);
}

function setBuckets(buckets) {
  localStorage.buckets = JSON.stringify(buckets);
}

function addBucket(bucketName) {
  var buckets = getBuckets();
  buckets[bucketName] = [];
  setBuckets(buckets);
}

function delBucket(bucketName) {
  var buckets = getBuckets();
  delete buckets[bucketName];
  setBuckets(buckets);
}

function addToBucket(bucketName, description) {
  var buckets = getBuckets();
  buckets[bucketName].push(description);
  setBuckets(buckets);
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

    this.buckets = getBuckets();
    this.data = [];
  },

  getState() {
    return {
      buckets: this.buckets,
      data: this.data
    };
  },

  onAddBucket(bucketName) {
    addBucket(bucketName);
    this.buckets = getBuckets();
    this.emit('change');
  },

  onDeleteBucket(bucketName) {
    delBucket(bucketName);
    this.buckets = getBuckets();
    this.emit('change');
  },

  onAddCsv(csv) {
    this.data = parseCsv(csv);
    this.emit('change');
  },

  onAddEntryToBucket(bucketName, entry) {
    var {description} = entry;
    addToBucket(bucketName, description);
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
  addEntryToBucket(bucketName) {
    this.dispatch(ENTRY.ADD, bucketName);
  }
};

var {Flux} = require('fluxxor');

var stores = {
  Store: new Store()
};

exports.flux = new Flux(stores, actions);
