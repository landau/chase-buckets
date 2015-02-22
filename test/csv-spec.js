'use strict';

require('must');
var csv = require('../lib/csv');
var file = require('fs').readFileSync(require('path').join(__dirname, 'test-data.csv'), 'utf8');

describe('csv', ()=> {
  it('should parse csv into an object', ()=> {
    var output = [
      {
        type: 'Sale',
        trans_date: '02/19/2015',
        post_date: '02/20/2015',
        description: 'ABC*The Fitness Edge',
        amount: '-26.58'
      },
      {
        type: 'Sale',
        trans_date: '02/19/2015',
        post_date: '02/20/2015',
        description: 'PILOT',
        amount: '-32.12'
      }
    ];

    csv(file).must.eql(output);
  });
});
