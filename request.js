const request = require('request'),
    fs = require('fs');

const __LOCAL_ADDRESS_BASE__ = '192.168.0.';

const publicKeyPath = "/home/rudder/noweek/pubkey.pem";
const readFile = (pubkeyPath) => fs.readFileSync(pubkeyPath).toString();

// response 대기시간은 비동기이기 때문에 이슈없을 것이라 생각됨
function broadcast(options){
    BASE_URL = options.url;

    for (var i = 1; i < 255; i++){
        ip_addr = __LOCAL_ADDRESS_BASE__ + i;

        options.url = BASE_URL.replace('[IP_ADDRESS]', ip_addr);
        console.log(options.url);
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        });
    }
}

/***
 * JSON.parse(buffer);
 * JSON.stringify(block, null, 4);
 */

/*** HELP
# 블록체인 Trigger Address & Format
http://[IP_ADDRESS]:3000/initBlockchain     // req.body.publicKey   <--- PEM public key
http://[IP_ADDRESS]:3000/addBlock           // req.body.publicKey   <--- PEM public key
http://[IP_ADDRESS]:3000/getBlockchain      // res.body             <--- Blockchain List
 */

// Configure the request
var options = {
    url: 'http://localhost:3000/initBlockchain',
    method: 'POST',
    json: {'publicKey': readFile(publicKeyPath)}
};

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
});

options.url = 'http://localhost:3000/addBlock';
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
});

options.url = 'http://localhost:3000/getBlockchain';
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
});

options.url = 'http://[IP_ADDRESS]:3000/addBlock';
broadcast(options);

//http post: https://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
//http post: https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
//https post:http://www.codexpedia.com/node-js/node-js-making-https-post-request-with-x-www-form-urlencoded-data/