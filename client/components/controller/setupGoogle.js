const host = process.env.CURRENT_DOMAIN || "" ;

const setupGoogle = {
    getMapsKey : ()=>{
    var promise = new Promise((resolve, reject)=>{
    fetch(`${host}/api/mapsKey`).then((response)=>{response.json().then((data) =>{resolve(data)})});
            });
    return promise;
    },
    setupAPI: async(loader)=> {
    if(!loader) {
    var promise = new Promise(async(resolve, reject)=>{
        let key = await setupGoogle.getMapsKey();
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
    } else {window.google = loader;return}
    }
}

module.exports = setupGoogle;