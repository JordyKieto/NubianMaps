const app = require('../server/server').app;
const assert = require('chai').assert;
const mapsKey = process.env.MAPS_KEY
const request = require('supertest');
const MongoClient = require("mongodb").MongoClient;
const admin = require('../server/config/defaultAdmin').admin;
const Enzyme = require("enzyme");
const Adapter = require('enzyme-adapter-react-16');
const Controller = require('../client/components/controller');

const HTMLParser = require('node-html-parser');

let db;
let cookie;

Enzyme.configure({adapter: new Adapter()});

describe('Server Tests', function () {
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
                assert.isArray(res.body, 'Database response is  an Array');
                done();
            });
    });
    it('authenticates base admin', function(done){
        request(app)
        .get('/api/authenticate')
        .send({username: admin.username, password: admin.password})
        .then(function(res) {
                // cookie patch to persist sessions https://github.com/visionmedia/supertest/issues/336
            cookie = res.headers['set-cookie'];
            request(app)
            .get('/api/checkAuthentication')
            .set('Cookie', cookie)
            .end(function(err, res) {assert.equal(res.body, true, 'succesful authentication');
            done();
            });
        });
    });
    it('can logout', function(done){
        request(app)
        .get('/api/authenticate')
        .send({username: admin.username, password: admin.password})
        .then( function(res) {
                // cookie patch to persist sessions https://github.com/visionmedia/supertest/issues/336
            cookie = res.headers['set-cookie'];
            request(app)
            .get('/api/checkAuthentication')
            .set('Cookie', cookie)
            .then(function(res) {assert.equal(res.body, true, 'successful authentication')})
            .then(()=>{
                request(app)
                .get('/api/logout')  
                .set('Cookie', cookie)
                .then(function(res) {assert.equal(res.body, true, 'logout API was triggered');
                    request(app)
                    .get('/api/checkAuthentication')
                    .set('Cookie', cookie)
                    .end(function(err, res) {assert.equal(res.body, false, 'successfully logged out');
                        done();
                    });
                });
            })
        });
    });
    for(let i =0; i < 4; i++) {
        it('always sends index.html for random URLs', function(done){
            const expectedTitle = '<title>Nubian Maps</title>';
            let number = Math.floor(Math.random() * 99999).toString();
            let string = Math.random().toString(36).substring(7);
            let randomUrl = '/randomUrl/' + number + '/' + string;
            request(app).get(randomUrl)
                .end(function(err, res) {
                    assert.notEqual(res.statusCode, 500);
                    assert.notEqual(res.serverError, true);
                    var resText = HTMLParser.parse(res.text);
                    var currentTitle = resText.querySelector('title');
                    assert.equal(currentTitle, expectedTitle);
                    done();
                });
        });
    };
    it('controller can get from server', function(done){
        request(app)
        .get('/')
        .end(async function() {
            var businesses = await Controller.getBusinesses('all');
            console.log(businesses);
            assert.isArray(businesses);
            done();
        });
    });
});


