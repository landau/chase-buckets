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
    var key = entry.description;

    if (!this.entries.some(isKey(key))) {
      this.entries.push(entry);
    }

    if (!this.keys.some(pred.equal(key))) {
      this.keys.push(key);
    }
  }

  pop(entry) {
    let key = entry.description;
    this.keys = this.keys.filter(pred.not.equal(key));
    this.entries = this.entries.filter(pred.complement(isKey(key)));
  }

  has(entry) {
    let {description} = entry;
    return this.keys.some(pred.equal(description));
  }

  toJSON() {
    return this.keys;
  }
}

class Buckets {
  constructor(storage) {
    this.buckets = { unknown: new Bucket('unknown') };

    if (!storage.buckets) {
      storage.buckets = JSON.stringify(this.buckets);
    }

    this.storage = storage;
    this.load();
  }

  save() {
    this.storage.buckets = JSON.stringify(this.buckets);
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

    _.each(this.buckets, b => b.pop(entry) );

    bucket.push(entry);
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
    var bucket = _.find(this.buckets, b => b.has(entry));
    if (!bucket) bucket = this.buckets.unknown;
    return this.addEntryToBucket(bucket.name, entry);
  }
}

exports.Buckets = Buckets;
exports.Bucket = Bucket;
