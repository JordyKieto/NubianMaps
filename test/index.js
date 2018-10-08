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
const Navbar = require('../client/components/navbar');
const MainMap = require('../client/components/maps/mainMap');
const AdminMap = require('../client/components/maps/adminMap');

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
        it('always send index.html for random URLs', function(done){
            var randomUrl = '/random' + Math.floor(Math.random() * 99999).toString();
            request(app).get(randomUrl)
                .end(function(err, res) {
                    assert.notEqual(res.statusCode, 500);
                    assert.notEqual(res.serverError, true);
                    done();
                });
        });
    }
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
                    done();
            });
        });
    });
    it('creates marker for each place in array', (done)=> {
        var allPlaces = [{geometry: {location: {lat: 44, lng: 44}},}]
        Controller.setupAPI(google)
        .then(()=>{Controller.initMap()
            .then((map)=>{
                return Controller.createMarkers(allPlaces, map);
                })
                    .then((markers)=>{
                      //  console.log(markers[0]);
                        assert.equal(allPlaces.length, markers.length);
                        done();
                    });
            });
    });
    it('navbar correctly selects elements', (done)=> {
        var navbar = shallow(<Navbar />);
        var mockDocument = {getElementById: function(id){return {id: id, style: { visibility: 'hidden', backgroundColor: 'white', color: 'black' }};}};
        document = mockDocument;
        var {thisNav, subNavs} = navbar.instance().select(123, [456]);
        assert.equal(thisNav.style.backgroundColor, 'black');
        assert.equal(thisNav.style.visibility, 'visible');
        assert.equal(thisNav.style.color, 'white');
        assert.equal(subNavs[0].id, 456);
        assert.equal(subNavs[0].style.visibility, 'visible');
        done();
    });
    it('navbar correctly deselects elements', (done)=> {
        var navbar = shallow(<Navbar />);
        var mockDocument = {getElementById: function(id){return {id: id, style: { visibility: 'visible', backgroundColor: 'black', color: 'white' }};}};
        document = mockDocument;
        var {thisNav, subNavs} = navbar.instance().deSelect(123, [456]);
        assert.equal(thisNav.style.backgroundColor, '#e6e6e6');
        assert.equal(thisNav.style.color, 'black');
        assert.equal(subNavs[0].id, 456);
        assert.equal(subNavs[0].style.visibility, 'hidden');
        done();
    });
    it('End-to-end: Binds Admin Map to autocomplete ', (done)=> {
        var adminMap = shallow(<AdminMap google={google} />);
        var input = global.document.createElement('input');
        var mockDocument = {getElementById: function(id){return input;}};
        document = mockDocument;
        adminMap.instance().componentDidMount()
        .then((autocomplete)=>{
            var actual = Object.keys(autocomplete).sort().toString();
            var expected = [ 'gm_accessors_', 'gm_bindings_', '__e3_' ];
            expected = expected.sort().toString();
            assert.equal(actual, expected);
            done();
        })
    });
    it('End-to-end: Main Map is initiliazed ', (done)=> {
        this.timeout(999999);
        var mainMap = shallow(<MainMap google={google}  />);
        var mockData = [{ _id: '5b79c53de070f42d54017d10',
        name: 'Obsidian Theatre',
        category: 'entertainment',
        placeID: 'ChIJH7nFX2nL1IkRU_vxSxnq7i8' }];
        // must determine why Business Api is failing
        var mockController = {getBusinesses: function(){return mockData }};
        Controller.getBusinesses = mockController.getBusinesses;
        Controller.visibleNewsfeed = function(){return null};
        Controller.calcDistances = function(){return null};
        Controller.markMyLocation = function(){return null};
        mainMap.instance().componentDidMount()
        .then((initiliazed)=>{
            var actual = Object.keys(initiliazed).sort().toString();
            var expected = ['allBusinesses', 'infowindows', 'map', 'markers'];
            //console.log(initiliazed);
            expected = expected.sort().toString();
                assert.equal(actual, expected);
            assert.equal(initiliazed['allBusinesses'].length, mockData.length);
            assert.equal(initiliazed['markers'].length, mockData.length);
            assert.equal(initiliazed['infowindows'].length, mockData.length);

            assert.equal(initiliazed['map'].mapTypeId, 'roadmap' );

            assert.equal(initiliazed['infowindows'].length, mockData.length);

            assert.equal(initiliazed['markers'][0].getPosition().lat(), 43.6637987);
            assert.equal(initiliazed['markers'][0].getPosition().lng(), -79.34360800000002);

            var infoContent = '<span class="infoTitle">Obsidian Theatre Company</span><br/><div style="height:43px"><form action="/api/favourites" method="post"><div style="width:100%;background-color:black" class="star"><button style="width:80px"><img src="../images/favourite.png" style="width:30px;height:30px"/></button><span style="color:white;font-size:150%">  Nubian  </span></div><input name="id" type="hidden" value=5b79c53de070f42d54017d10 /></form>';
            assert.equal(initiliazed['infowindows'][0]['content'], infoContent);
            done();
        })
    });
})

