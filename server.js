const express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan");

const PORT = process.env.HTTP_PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

const server = app.listen(PORT, () =>
  console.log(`IOTC HTTP Server running on port ${PORT} ✅`)
);