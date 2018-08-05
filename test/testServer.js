var server = require('../server');
var assert = require('chai').assert;
var mapsKey = process.env.MAPS_KEY
var request = require('supertest');

describe('API', function () {
    afterEach(function () {
  //      server.close();
    });
    it('sends Maps Key', function(done){
        request(server).get('/api/mapsKey')
            .end(function(err, res) {
                assert.equal(res.body, mapsKey, 'key match')
                done()
    });
});
});