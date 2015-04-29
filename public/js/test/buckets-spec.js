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
    var entry;
    beforeEach(()=> {
      entry = { description: 'foo' };
      bucket = new Bucket();
      bucket.push(entry);
    });

    it('adds an entry to the array', ()=> {
      bucket.entries[0].must.equal(entry);
    });

    it('adds an entry key', ()=> {
      bucket.keys[0].must.equal(entry.description);
    });
  });

  describe('#pop', ()=> {
    var entry;
    beforeEach(()=> {
      entry = { description: 'foo' };
      bucket = new Bucket();
      bucket.push(entry);
      bucket.pop(entry);
    });

    it('removes the entry from the entries array', ()=> {
      bucket.entries.every(e => {
        return e.description !== entry.description;
      }).must.be.true();
    });

    it('removes the key from the keys array', ()=> {
      bucket.keys.every(key => key !== entry.description).must.be.true();
    });
  });

  describe('#toJSON', ()=> {
    it('returns true if the entry', ()=> {
      bucket.toJSON().must.equal(keys);
    });
  });

  describe('#toJSON', ()=> {
    it('returns keys', ()=> {
      bucket.toJSON().must.equal(keys);
    });
  });
});

describe('Buckets', ()=> {
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

    it('sets a `buckets` obj and adds an unknown bucket', ()=> {
      var x  = {};
      buckets = new Buckets(storage, x);
      buckets.buckets.must.equal(x);
      x.unknown.must.exist();
    });

    it('doesn\'t set a the unknown bucket `buckets` if it already exists', ()=> {
      var x  = { unknown: 1 };
      buckets = new Buckets(storage, x);
      x.unknown.must.equal(x.unknown);
    });

    it('sets a `buckets` obj if not provided', ()=> {
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
    var save;
    beforeEach(()=> {
      var bucket = new Bucket('foo', [1, 2]);
      save = sinon.stub(buckets, 'emit');
      buckets.buckets = {};
      buckets.buckets.foo = bucket;
      buckets.save();
    });

    afterEach(()=> {
      save.restore();
    });

    it('storage.buckets should be a string', ()=> {
      buckets.storage.buckets.must.be.a.string();
    });

    it('calls #emit', ()=> {
      save.calledOnce.must.be.true();
      save.calledWithExactly('save', buckets).must.be.true();
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
    it('returns the names of all the buckets', ()=> {
      buckets.buckets.foo = 'hi';
      buckets.buckets.bar = 'hi';
      var keys = buckets.getNames();
      keys.must.eql(['unknown', 'foo', 'bar']);
    });
  });

  describe('#addEntryToBucket', ()=> {
    var has, pop, push, save;
    var entry = { description: 'PILOT' };

    beforeEach(()=> {
      buckets.add('foo').add('bar');
      buckets.buckets.foo.push(entry); // cheat this one in

      save = sinon.stub(buckets, 'save');
      pop = sinon.spy(Bucket.prototype, 'pop');
      push = sinon.spy(Bucket.prototype, 'push');
    });

    afterEach(()=> {
      pop.restore();
      push.restore();
    });

    it('removes an entry from a bucket that should no longer own it', ()=> {
      buckets.addEntryToBucket('bar', entry);
      pop.calledWithExactly(entry).must.be.true();
    });

    it('pushes an entry to a given bucket', ()=> {
      buckets.addEntryToBucket('bar', entry);
      push.calledOnce.must.be.true();
      push.calledWithExactly(entry).must.be.true();
    });

    it('calls save', ()=> {
      buckets.addEntryToBucket('bar', entry);
    });
  });

  describe('#removeEntryFromBucket', ()=> {
    var entry = { description: 'PILOT' };
    var pop, save, bucket;

    beforeEach(()=> {
      buckets.add('foo');
      bucket = buckets.buckets.foo;
      buckets.addEntryToBucket('foo', entry);

      save = sinon.stub(buckets, 'save');
      pop = sinon.spy(bucket, 'pop');
      buckets.removeEntryFromBucket('foo', entry);
    });

    it('calls pop on a given bucket bucket', ()=> {
      pop.calledOnce.must.be.true();
      pop.calledWithExactly(entry).must.be.true();
    });

    it('calls #save', ()=> {
      save.calledOnce.must.be.true();
    });
  });

  describe('#addEntry', ()=> {
    var entry = { description: 'PILOT' };
    var addEntryToBucket;

    beforeEach(()=> {
      buckets.add('foo');
      buckets.addEntryToBucket('foo', entry);
      addEntryToBucket = sinon.stub(buckets, 'addEntryToBucket');
    });

    it('calls #addEntryToBucket on a found bucket', ()=> {
      buckets.addEntry(entry);
      addEntryToBucket.calledWithExactly('foo', entry);
    });

    it('calls #addEntryToBucket on a the unknown bucket', ()=> {
      var entry = { description: 'bar' };
      buckets.addEntry(entry);
      addEntryToBucket.calledWithExactly('unknown', entry);
    });
  });
});
