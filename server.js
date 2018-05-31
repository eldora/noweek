const express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan");

const Blockchain = require('./blockchain');
const {
    blockchain_init,
    blockchain_add,
    blockchain_get,
    blockchain_run
} = Blockchain;

const PORT = process.env.HTTP_PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

// template
app.route("/blocks")
.get((req, res) => {})
.post((req, rest) => {});


app.post("/initBlockchain", (req, res) => {
    res_body = "initBlockchain complete...";
    publicKey = req.body.publicKey;

    blockchain_init(publicKey);

    res.send(res_body);
});

app.post("/addBlock", (req, res) => {
    res_body = "addBlock complete...";
    publicKey = req.body.publicKey;

    blockchain_add(publicKey);

    res.send(res_body);
});

app.post("/getBlockchain", (req, res) => {
    res_body = "getBlockchain complete...";
    blockchain = blockchain_get(publicKey);

    res.send(blockchain);
});

const server = app.listen(PORT, () =>
  console.log(`IOTC HTTP Server running on port ${PORT} ✅`)
);

blockchain_run();