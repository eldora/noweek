var request = require('request');

var headers = {
    'User-Agent': 'Super Agent/0.1.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var data = 'hello, world!!';

var options = {
    url: 'http://127.0.0.1/initBlockchain',
    method: 'POST',
    headers: headers,
    form: data
}

