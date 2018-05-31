var request = require('request');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    url: 'http://localhost:3000/initBlockchain',
    method: 'POST',
    headers: headers,
    form: {'key1': 'xxx', 'key2': 'yyy'}
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
    //console.log(response);
})


//http post: https://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
//http post: https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
//https post:http://www.codexpedia.com/node-js/node-js-making-https-post-request-with-x-www-form-urlencoded-data/