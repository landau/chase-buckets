'use strict';

var expect = require('must');
var sinon = require('sinon');
var {Buckets, Bucket} = require('../lib/buckets');

describe('Bucket', ()=> {
  var bucket, keys;

  beforeEach(()=> {
    keys = [1, 2];
    bucket = new Bucket('name', keys);
  });

  describe('#constructor', ()=> {
    it('sets the name prop', ()=> {
      bucket.name.must.equal('name');
    });

    it('sets the keys prop', ()=> {
      bucket.keys.must.equal(keys);
    });

    it('creates an empty entries array', ()=> {
      bucket.entries.must.be.an.array();
    });
  });

  describe('#push', ()=> {
    it('adds an entry to the array', ()=> {
      var v = 'foo';
      bucket.push(v);
      bucket.entries[0].must.equal(v);
    });
  });

  describe('#toJSON', ()=> {
    it('returns keys', ()=> {
      bucket.toJSON().must.equal(keys);
    });
  });
});

describe.only('Buckets', ()=> {
  var buckets, storage;

  beforeEach(()=> {
    storage = {};
    buckets = new Buckets(storage);
  });

  describe('#constructor', ()=> {
    var load;
    beforeEach(()=> {
      load = sinon.stub(Buckets.prototype, 'load');
      buckets = new Buckets(storage);
    });

    afterEach(()=> {
      load.restore();
    });

    it('sets a `buckets` obj', ()=> {
      buckets.buckets.must.be.an.object();
    });

    it('sets `buckets` on `storage`', ()=> {
      buckets.storage.buckets.must.be.a.string();
    });

    it('sets storage to the instance', ()=> {
      buckets.storage.must.equal(storage);
    });

    it('calls #load', ()=> {
      load.calledOnce.must.be.true();
    });
  });

  describe('#save', ()=> {
    beforeEach(()=> {
      var bucket = new Bucket('foo', [1, 2]);
      buckets.buckets = {};
      buckets.buckets.foo = bucket;
      buckets.save();
    });

    it('storage.buckets should be a string', ()=> {
      buckets.storage.buckets.must.be.a.string();
    });
  });

  describe('#load', ()=> {
    beforeEach(()=> {
      buckets.storage.buckets = JSON.stringify({
        foo: [1, 2]
      });
      buckets.load();
    });

    it('loads buckets from storage', ()=> {
      buckets.buckets.must.be.an.object();
    });

    it('assigns buckets to bucket objects', ()=> {
      var bucket = buckets.buckets.foo;
      expect(bucket).to.not.be.undefined();
      bucket.must.be.a(Bucket);
    });
  });

  describe('#exists', ()=> {
    beforeEach(()=> {
      buckets = new Buckets({});
      buckets.buckets.foo = new Bucket();
    });

    it('returns true for an existing bucket name', ()=> {
      buckets.exists('foo').must.be.true();
    });

    it('returns false for a non-existant bucket name', ()=> {
      buckets.exists('bar').must.be.false();
    });
  });

  describe('#add', ()=> {
    var save, add;
    beforeEach(()=> {
      save = sinon.stub(buckets, 'save');
      add = sinon.spy(buckets, 'add');
      buckets.add('foo');
    });

    it('throws an error if the bucket name already exists', ()=> {
      try {
        buckets.add('foo');
      } catch(e) {}

      add.threw().must.be.true();
    });

    it('adds a new bucket to the buckets obj', ()=> {
      var bucket = buckets.buckets.foo;
      expect(bucket).to.not.be.undefined();
      bucket.must.be.a(Bucket);
    });

    it('calls save', ()=> {
      save.calledOnce.must.be.true();
    });
  });

  describe('#remove', ()=> {
    var save;
    beforeEach(()=> {
      save = sinon.stub(buckets, 'save');
      buckets.buckets.foo = 'hi';
      buckets.remove('foo');
    });

    it('removes a bucket from buckets', ()=> {
      var bucket = buckets.buckets.foo;
      expect(bucket).to.be.undefined();
    });

    it('calls save', ()=> {
      save.calledOnce.must.be.true();
    });
  });

  describe('#getNames', ()=> {
    it('removes a bucket from buckets', ()=> {
      buckets.buckets.foo = 'hi';
      buckets.buckets.bar = 'hi';
      var keys = buckets.getNames();
      keys.must.eql(['foo', 'bar']);
    });
  });
});
