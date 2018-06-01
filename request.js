const request = require('request'),
    fs = require('fs');

const __LOCAL_ADDRESS_BASE__ = '192.168.0.';

const publicKeyPath = "/home/rudder/noweek/pubkey.pem";
const readFile = (pubkeyPath) => fs.readFileSync(pubkeyPath).toString();
const PEM = readFile(publicKeyPath);

// response 대기시간은 비동기이기 때문에 이슈없을 것이라 생각됨

/**
 * @name broadcast_addBlock
 * @param publicKey
 */
function broadcast_addBlock(publicKey){
    var options = {
        url: 'http://localhost:3000/makeBlock',
        method: 'POST',
        json: {'publicKey': publicKey}
    };

    console.log(publicKey);

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            BASE_URL = 'http://[IP_ADDRESS]:3000/addBlock';
            options = {
                method: 'POST',
                json: {'block': body}
            };

            for (var i = 1; i < 255; i++){
                ip_addr = __LOCAL_ADDRESS_BASE__ + i;

                options.url = BASE_URL.replace('[IP_ADDRESS]', ip_addr);
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                });
            }
        }
    });
}

function broadcast_getBlockchain(){
    var options = {
        url: 'http://[IP_ADDRESS]:3000/getBlockchain',
        method: 'POST'
    };
    BASE_URL = options.url;

    for (var i = 1; i < 255; i++){
        ip_addr = __LOCAL_ADDRESS_BASE__ + i;

        options.url = BASE_URL.replace('[IP_ADDRESS]', ip_addr);
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // get blockchain
                var options = {
                    url: 'http://localhost:3000/replaceBlockchain',
                    method: 'POST',
                    json: {'blockchain': body}
                };

                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        console.log(body);
                    }
                });
            }
        });
    }
}

/*
name: request_initBlockchain
arg1: publicKey
arg2: callback({result:true, data: null})
*/
function request_initBlockchain(publicKey, callback){
    var options = {
        url: 'http://localhost:3000/initBlockchain',
        method: 'POST',
        json: {'publicKey': publicKey}
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            callback({result:true, data: null});
        }
        else
            callback({result:false, data: null});
    });
}

/* NOT USE
name: request_addBlock
arg1: publicKey
arg2: callback({result:true, data: null})
*/
function request_addBlock(publicKey, callback){
    var options = {
        url: 'http://localhost:3000/addBlock',
        method: 'POST',
        json: {'block': createBlock(publicKey)}
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
            callback({result:true, data: null});
        }
        else
            callback({result:false, data: null});
    });
}

/*
name: request_getBlockchain
arg1: callback({result:true, data: blockchain})
*/
function request_getBlockchain(callback){
    var options = {
        url: 'http://localhost:3000/getBlockchain',
        method: 'POST'
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
            callback({result:true, data: body});
        }
        else
            callback({result:false, data: null});
    });
}

function callback_func(result){
    console.log(result);
}

// request_initBlockchain(PEM, callback_func);
broadcast_addBlock(PEM);

module.exports = {
    broadcast_addBlock,
    broadcast_getBlockchain,
    request_initBlockchain,
    request_addBlock,
    request_getBlockchain,
};

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

//http post: https://samwize.com/2013/08/31/simple-http-get-slash-post-request-in-node-dot-js/
//http post: https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
//https post:http://www.codexpedia.com/node-js/node-js-making-https-post-request-with-x-www-form-urlencoded-data/