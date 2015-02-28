'use strict';

var _ = require('lodash');
var pred = require('predicate');

class Bucket {
  constructor(name='', keys=[]) {
    this.name = name;
    this.keys = keys; // keys are the descriptions of each entry
    this.entries = []; // this should contain actual data entries
  }

  push(v) {
    this.entries.push(v);
  }

  toJSON() {
    return this.keys;
  }
}

class Buckets {
  constructor(storage) {
    this.buckets = {};

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

  //find(v) {
  //  return _.find(this.buckets, (bucket) => _.includes(bucket, v));
  //}

  add(name) {
    if (this.exists(name)) throw new Error(`Bucket ${name} already exists`);
    var bucket = new Bucket(name);
    this.buckets[name] = bucket;
    this.save();
  }

  remove(name) {
    delete this.buckets[name];
    this.save();
  }

  getNames() {
    return Object.keys(this.buckets);
  }
}

exports.Buckets = Buckets;
exports.Bucket = Bucket;
