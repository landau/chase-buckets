'use strict';

var {flux} = require('./lib/flux');
var {App} = require('./lib/app.jsx');
var React = window.React = require('react');
var AppFactory = React.createFactory(App);

//flux.on('dispatch', console.log);

var mnt = document.querySelector('#app');
React.render(AppFactory({ flux: flux }), mnt);
