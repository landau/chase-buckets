'use strict';

var {Flux, Store, actions} = require('./lib/flux');
var {App} = require('./lib/app.jsx');
var User = require('./lib/jsx/user.jsx');
var React = window.React = require('react');

var request = require('superagent');
var {omit} = require('lodash');

var AppFactory = React.createFactory(App);
var UserFactory = React.createFactory(User);
var mnt = document.querySelector('#app');


function onSubmit(user, pass) {
  window.USER = user;
  window.PASSWORD = pass;

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
}

React.render(UserFactory({ onSubmit }), mnt);
