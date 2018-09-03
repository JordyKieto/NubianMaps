const Controller = {
    getMapsKey : ()=>{
            var promise = new Promise((resolve, reject)=>{
            fetch("/api/mapsKey").then((response)=>{response.json().then((data) =>{resolve(data)})});
                    });
            return promise;
    }
}
module.exports = Controller;