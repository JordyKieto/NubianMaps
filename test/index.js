const app = require('../server').app;
const assert = require('chai').assert;
const mapsKey = process.env.MAPS_KEY
const request = require('supertest');
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGOLAB_URI;
const admin = require('../config/defaultAdmin').admin;
const Enzyme = require("enzyme");
const shallow = require("enzyme").shallow;
const Adapter = require('enzyme-adapter-react-16');
const React = require('react');
const http = require('http');
const Header = require('../static/components/header');
const Newsfeed = require('../static/components/newsfeed');
const Controller = require('../static/components/controller');
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
                assert.isArray(res.body, 'Database response is  an Array')
                done()
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
});
describe('Client Tests', function () {
    beforeEach( async function() {
        await MongoClient.connect('mongodb://localhost').then( async (client) =>{
        db = await client.db('blackBusinesses');
        });
    });
    afterEach(function () {
        app.server.close();
    });
    it('header has correct site title', ()=> {
        const header = shallow(<Header />);
        assert.equal(header.text(), ("NUBIAN MAPS"));
    });
    it('header imgs have correct src', ()=> {
        const header = shallow(<Header />);
        assert.equal(header.find('img').first().prop("src"), './images/favourite.png');
        assert.equal(header.find('img').at(1).prop("src"), './images/africaLogo.png');

    });
    it('Newsfeed renders correct img', ()=> {
        const newsfeed = shallow(<Newsfeed imgArray={[{src: "https://i.imgur.com/WBp5bHD.jpg", id: "123"}]} />);
        assert.equal(newsfeed.find('img').first().prop("src"), 'https://i.imgur.com/WBp5bHD.jpg');
    });
    it('Can recieve Maps Key', (done)=> {
        app.listen(8080, async function () {
        const recievedKey = await Controller.getMapsKey();
        assert.equal(recievedKey, mapsKey);
        done();
    });
})
})

