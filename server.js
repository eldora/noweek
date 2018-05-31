const express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan");

const PORT = process.env.HTTP_PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.route("/blocks")
.get((req, res) => {})
.post((req, rest) => {});


app.post("/initBlockchain", (req, res) => {
    console.log("Hello, world!!");
    console.log(req.body);
    console.log(req.body.data);
    res.send("Hello, world!!");
});

app.post("/addBlock", (req, res) => {

});

app.post("/getBlockchain", (req, res) => {

});

const server = app.listen(PORT, () =>
  console.log(`IOTC HTTP Server running on port ${PORT} ✅`)
);