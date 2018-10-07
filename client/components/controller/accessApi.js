const host = process.env.CURRENT_DOMAIN || "" ;

const accessApi = {
    getBusinesses:(category)=>{
    var promise = new Promise((resolve, reject)=>{
    fetch(`${host}/api/businesses?category=${category}`).then((response)=>{
        response.json().then((allBusinesses)=>{
            resolve(allBusinesses)});
        });
    }); return promise;
    }
}

module.exports = accessApi;