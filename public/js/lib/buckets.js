'use strict';

var _ = require('lodash');
var pred = require('predicate');

var isKey = key => _.compose(pred.equal(key), _.property('description'));

class Bucket {
  constructor(name='', keys=[]) {
    this.name = name;
    this.keys = keys; // keys are the descriptions of each entry
    this.entries = []; // this should contain actual data entries
  }

  push(entry) {
    // Don't push entry if it exists
    if (!this.entries.some(pred.equal(entry))) {
      this.entries.push(entry);
    }

    // Don't add key if it already exists
    var key = entry.description;
    if (!this.keys.some(pred.equal(key))) {
      this.keys.push(key);
    }
  }

  pop(entry) {
    let key = entry.description;
    this.keys = this.keys.filter(pred.not.equal(key));
    var isEntry = e => e.description === key;
    var oldEntries = this.entries.filter(isEntry);
    this.entries = this.entries.filter(pred.complement(isEntry));
    return oldEntries;
  }

  has(entry) {
    return this.entries.some(pred.equal(entry));
  }

  hasKey(entry) {
    let {description} = entry;
    return this.keys.some(pred.equal(description));
  }

  getTotal() {
    return this.entries.reduce((sum, e)=> sum + parseFloat(e.amount), 0).toFixed(2);
  }

  clean() {
    this.entries = [];
  }

  toJSON() {
    return this.keys;
  }
}

class Buckets extends require('events').EventEmitter {
  constructor(storage, buckets) {
    super();
    this.shouldEmit = true;
    this.buckets = buckets;
    buckets.unknown = new Bucket('unknown');

    if (!storage.buckets) {
      storage.buckets = JSON.stringify(this.buckets);
    }

    this.storage = storage;
    this.load();
  }

  save() {
    this.storage.buckets = JSON.stringify(this.buckets);
    if (this.shouldEmit) {
      this.emit('save', this);
    } else {
      console.log('emitting disabled');
    }
  }

  load() {
    let {storage} = this;
    let buckets = JSON.parse(storage.buckets);
    this.buckets = _.reduce(buckets, (acc, keys, bucketName)=> {
      acc[bucketName] = new Bucket(bucketName, keys);
      return acc;
    }, {});
  }

  exists(name) {
    return this.buckets[name] !== undefined;
  }

  add(name) {
    if (this.exists(name)) throw new Error(`Bucket ${name} already exists`);
    var bucket = new Bucket(name);
    this.buckets[name] = bucket;
    this.save();
    return this;
  }

  remove(name) {
    // TODO move this.buckets entries to the unknown buckets
    delete this.buckets[name];
    this.save();
    return this;
  }

  getNames() {
    return Object.keys(this.buckets);
  }

  sort() {
    // Go through buckets and put entries where they belong
  }

  addEntryToBucket(name, entry) {
    var bucket = this.buckets[name];

    var oldBucket = _.find(this.buckets, b => b.has(entry));

    var oldEntries = oldBucket ? oldBucket.pop(entry) : [entry];
    oldEntries.forEach(e => bucket.push(e));

    this.save();
    return this;
  }

  removeEntryFromBucket(name, entry) {
    var bucket = this.buckets[name];
    bucket.pop(entry);
    this.save();
    return this;
  }

  addEntry(entry) {
    var bucket = _.find(this.buckets, b => b.hasKey(entry));
    if (!bucket) bucket = this.buckets.unknown;
    return this.addEntryToBucket(bucket.name, entry);
  }

  filter(predicate, ctx=null) {
    return _.reduce(this.buckets, (acc, bucket, bucketName, i)=> {
      if (predicate(bucket, bucketName, i)) acc[bucketName] = bucket;
      return acc;
    }, {});
  }

  clean() {
    _.each(this.buckets, b => b.clean());
    return this;
  }

  toJSON() {
    return JSON.stringify(this.buckets);
  }
}

exports.Buckets = Buckets;
exports.Bucket = Bucket;
