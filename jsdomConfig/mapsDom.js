const { JSDOM } = require('jsdom');

const getGoogleApi = () => new Promise(res => {
    const {window} = new JSDOM(`
    <!doctype html>
    <html>
        <head>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANJoY1-ND72EtVf5AFXW6vkbmotvu4Y_c&libraries=places,geometry&callback=googleReady"></script>
        </head>
        <body></div></body>
    </html>`
    , {runScripts: 'dangerously', resources: 'usable',
    url: 'http://localhost:8080/',
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
    origin: 'http://localhost:8080/',
    baseURI: 'http://localhost:8080/',
    referrer: 'http://localhost:8080/',
    pretendToBeVisual: true
  })

    window.googleReady = () => {
        res(window.google)
    }
});

module.exports = getGoogleApi