'use strict';

// NGINX
// basic auth for /buckets and index
// static assets

var path = require('path');
var hapi = require('hapi');
var server = new hapi.Server();
var env = process.env;
var PORT = env.NODE_PORT || 1337;
var NODE_ENV = env.NODE_ENV;

var mongojs = require('mongojs');
var db = mongojs('localhost/chase');
var buckets = db.collection('buckets');
var ID = 1; // just use a single item in the db lol

server.connection({
  port: PORT
});

server.views({
  path: path.join(__dirname, 'lib', 'views'),
  engines: {
    jsx: require('hapi-react')({
      beautify: true
    })
  }
});

if (NODE_ENV !== 'production') {
  server.route({
    method: 'GET',
    path: ['', 'public', '{path*}'].join('/'),
    handler: {
      directory: {
        path: path.join(__dirname, 'public'),
        listing: true,
        index: true
      }
    }
  });
}

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply.view('index');
  }
});

server.route({
  method: 'GET',
  path: ['', 'buckets'].join('/'),
  handler: function(request, reply) {
    buckets.findOne({
      id: ID
    }, function(err, res) {
      if (err) {
        return reply(err);
      }

      if (!res) {
        return reply({});
      }

      reply(JSON.parse(res.buckets));
    });
  }
});

server.route({
  method: 'POST',
  path: ['', 'buckets'].join('/'),
  config: {
    handler: function(request, reply) {

      buckets.update({
        id: ID
      }, {
        $set: {
          buckets: request.payload
        }
      }, function(err, res) {
        if (err) {
          return reply(err);
        }

        reply(request.payload);
      });
    }
  }
});

server.start(function(err) {
  var assert = require('assert');
  assert.ifError(err);

  buckets.findOne({
    id: ID
  }, function(err, res) {
    assert.ifError(err);

    if (res) {
      return console.log('Server started on http://localhost:' + PORT);
    }

    console.log('Inserting default buckets');

    buckets.insert({
      id: ID,
      buckets: '{}'
    }, function(err) {
      assert.ifError(err);
      return console.log('Server started on http://localhost:' + PORT);
    });
  });
});
