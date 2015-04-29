'use strict';

var {Flux, Store, actions} = require('./lib/flux');
var {App} = require('./lib/app.jsx');
var React = window.React = require('react');
var AppFactory = React.createFactory(App);
var request = require('superagent');
var {omit} = require('lodash');

var mnt = document.querySelector('#app');

request
  .get('/buckets')
  .auth(window.USER, window.PASSWORD)
  .end((err, res)=> {
    if (err) {
      throw err;
    }

    var buckets = omit(JSON.parse(res.text), 'unknown');
    console.log(buckets);

    var stores = {
      Store: new Store({ buckets })
    };

    var flux = new Flux(stores, actions);

    React.render(AppFactory({ flux: flux }), mnt);
  });
