# Nubian Maps

## Goal

https://nubian-maps.herokuapp.com/

Share and save your favorite Black Businesses in Toronto

Have  an interactive Google Map with different business categories, the ability to add new stores, and the ability to filter based on these categories. Users should be able to save their favourite locations, and check in using HTML5 Geolocation API. 

## Technologies Used

* React 
* Express
* MongoDB

# Challenges

Finding a way to conviniently access Google API instance, without overtly comprimising secret key. Previously utilized a wrapper npm module "google-maps", before coming to a solution that involved creating an inline javascript file and appending it to the document. I was able to reduce my dependenies and functions call, making my app more efficient.

```javascript
    setupAPI: async(loader)=> {
        if(!loader) {
        var promise = new Promise(async(resolve, reject)=>{
                let key = await Controller.getMapsKey();
                let script = document.createElement("script");
                let src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&callback=googleReady`
                script.src =  src;
                script.type = "text/javascript";
                document.body.appendChild(script);
                window.googleReady = () => {
                    google = window.google; 
                    resolve();
                };
        });
        return promise;
        } else {google = loader;return}
```

Testing client side code using node. Managed by mocking browser environment with JSDOM. Wrapping my head around the different configurations availables took a few late but nights. But I now consider it an invaluable tool for unit testing. 

```javascript
const jsdom = new JSDOM(`<!doctype html><head>
</head><body><div id="map" style="width:100%;height:800px"></div></body></html>`, {
  url: 'http://localhost:8080/',
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  origin: 'http://localhost:8080/',
  baseURI: 'http://localhost:8080/',
  referrer: 'http://localhost:8080/',
  pretendToBeVisual: true
});
```

~~Next task is figuring out how to test my asychronous components. Examples seem to point towards mocking fetch requests.~~

## How to Run
> npm install
setup environment variables for MONGOLAB_URI & MAPS_KEY, optionally NUBIAN_KEY can be set for base user
for local deployment, initialize an instance of 
>mongod

## Future Updates
>Implement a method to mark a locations as visited, & a view for favourite locations that users use to track locations they've been. 

>Also must style login/register pages

>Add caching layer to reduce number of API calls to DB; store all businesnes after first page pageload, also must work with update

  - ~~Create Tests for Navbar select & deselect~~
  - ~~Implement babel-plugin-react-require~~
  - ~~Create test for checking that index is always served~~
  - ~~Create test for checking Admin Maps component.didMount is succesful~~
  - Seperate Client & Unit Tests into seperate files
  - Change ports to allow simultaneous testing and running of server
  - ~~Test for Controller createPlaceImgs()~~
