const request = require('request')

module.exports = {

    make_API_call : function(url){
        return new Promise((resolve,reject) => {
            request(url,{ json:true}, (err, res, body) => {
            if(err) reject(err)
            resolve(body)
            });
        })
    },

    make_EmployeeDetailsAPI_call : function (url, employeeName){

        return new  Promise((resolve, reject) => {
        request(url + employeeName, {json: true}, (err,res, body) =>{
            if(err) reject(err)
            resolve(body)
            });
         })
    }

}