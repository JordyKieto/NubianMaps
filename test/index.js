const app = require('../server/server').app;
const assert = require('chai').assert;
const mapsKey = process.env.MAPS_KEY
const request = require('supertest');
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGOLAB_URI;
const admin = require('../server/config/defaultAdmin').admin;
const Enzyme = require("enzyme");
const shallow = require("enzyme").shallow;
const mount = require("enzyme").mount;
const Adapter = require('enzyme-adapter-react-16');
const React = require('react');
const Header = require('../client/components/header');
const Newsfeed = require('../client/components/newsfeed');
const Controller = require('../client/components/controller');
const MainMap = require('../client/components/maps/mainMap');
const getGoogleApi = require('../test/config/mapsDom')
const { JSDOM } = require('jsdom');
const {copyProps} = require('../test/config/setup');

var google;

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
            google = await getGoogleApi();
            global.window = window;
            global.document = window.document;
            document.domain = "localhost";
            require('../test/config/canvasPatch')(window);
            copyProps(window, global);
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
    it('newsfeed renders correct img', ()=> {
        const newsfeed = shallow(<Newsfeed imgArray={[{src: "https://i.imgur.com/WBp5bHD.jpg", id: "123"}]} />);
        assert.equal(newsfeed.find('img').first().prop("src"), 'https://i.imgur.com/WBp5bHD.jpg');
    });
    it('Can recieve Maps Key', (done)=> {
        app.listen(8080, async function () {
        const recievedKey = await Controller.getMapsKey();
        assert.equal(recievedKey, mapsKey);
        done();
    });
    });
    it('controller create map', (done)=> {
        Controller.setupAPI(google)
        .then(()=>{Controller.initMap()
            .then((map)=>
                {assert.equal(map.mapTypeId, 'roadmap' );
                    done()
            });
        });
    });
    it('controller populates map from databse', (done)=> {
        var mockSelf = {setState: ()=>{return;}}
        Controller.setupAPI(google)
        .then(()=>{Controller.initMap()
            .then(async (map)=>{
                var allBusinesses = await Controller.getBusinesses('all');
                var allPlaces = await Controller.getPlaces(allBusinesses, map);
                var {markers, infoWindows} =  await Controller.createMarkers(allPlaces, map);
                assert.equal(allBusinesses.length, markers.length);
                assert.equal(allBusinesses.length, infoWindows.length);
                return;
                })
                    .then(()=>{done();
                });
        });
    });
})

