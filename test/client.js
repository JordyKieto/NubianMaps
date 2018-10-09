const app = require('../server/server').app;
const assert = require('chai').assert;
const mapsKey = process.env.MAPS_KEY
const MongoClient = require("mongodb").MongoClient;
const Enzyme = require("enzyme");
const shallow = require("enzyme").shallow;
const Adapter = require('enzyme-adapter-react-16');
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
    it('can recieve Maps Key', (done)=> {
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
    it('can create placeImgs ', (done)=> {
        var places =[{name: 'NAACP'}];
        var map = {setZoom: function(){return null;}, panTo: function(){return null;}}
        var markers =[{}];
        var infowindows =[{open: function(){return null;}, close: function(){return null;} }];
        var self = {setState: function(){return null;}};
        var imgs = Controller.createPlaceImgs(places, map, infowindows, markers, self);
        assert.equal(imgs.length, places.length);
        var defaultSrc = '../images/altLogo.png';
        assert.equal(imgs[0].src, defaultSrc);
        assert.equal(imgs[0].id, 'NAACP');
        done();
    });
    it('end-to-end: binds Admin Map to autocomplete ', (done)=> {
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
    it('end-to-end: Main Map is initiliazed ', (done)=> {
        this.timeout(999999);
        var mainMap = shallow(<MainMap google={google}  />);
        var mockData = [{ _id: '5b79c53de070f42d54017d10',
        name: 'Obsidian Theatre',
        category: 'entertainment',
        placeID: 'ChIJH7nFX2nL1IkRU_vxSxnq7i8' }];
        Controller.getBusinesses = function(){return mockData}
        Controller.visibleNewsfeed = function(){return null};
        Controller.calcDistances = function(){return null};
        Controller.markMyLocation = function(){return null};
        mainMap.instance().componentDidMount()
        .then((initiliazed)=>{
            var actualKeys = Object.keys(initiliazed).sort().toString();
            var expectedKeys = ['allBusinesses', 'infowindows', 'map', 'markers'];
            expectedKeys = expectedKeys.sort().toString();
            assert.equal(actualKeys, expectedKeys);
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

