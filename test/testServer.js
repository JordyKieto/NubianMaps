var app = require('../server').app;
var db;
var assert = require('chai').assert;
var mapsKey = process.env.MAPS_KEY
var request = require('supertest');
var MongoClient = require("mongodb").MongoClient;
var admin = require('../server').admin
let cookie

describe('API', function () {
    beforeEach( async function() {
        await MongoClient.connect('mongodb://localhost').then( async (client) =>{
        db = await client.db('blackBusinesses');
    });
    });
    afterEach(function () {
    app.server.close();
    });
    it('sends Maps Key', function(done){
        request(app)
            .get('/api/mapsKey')
            .end(function(err, res) {
                assert.equal(res.body, mapsKey, 'correct maps key is sent')
                done()
    });
});
    it('database request returns Array', function(done){
        request(app).get('/api/businesses?category=all')
            .end(function(err, res) {
                assert.isArray(res.body, 'Database response is  an Array')
                done()
    });
    });
    it('authenticates base admin', function(done){
        request(app)
        .get('/api/authenticate')
        .send({username: admin.username, password: admin.password})
        .then( function(res) {
            // cookie patch to persist sessions https://github.com/visionmedia/supertest/issues/336
        cookie = res.headers['set-cookie'];
        request(app)
        .get('/checkAuthentication')
        .set('Cookie', cookie)
        .end(function(err, res) {assert.equal(res.body, true, 'succesful authentication')})
        done();
    });    
    });
});