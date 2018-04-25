
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
// const fixtures = require('./fixtures');
const path = require("path");
const faker = require("faker");

const IP = 'localhost';
const PORT = 3001;
const PUBLIC_DIR = 'build';

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public directory for assets like css and js files.
app.use(express.static(PUBLIC_DIR));

app.listen(PORT, IP, () => {
  console.log(`${Date.now()} - Server running at http://${IP}:${PORT}`);
});

app.get('/data/:data', (req, res, next) => {
  // res.setHeader("Content-Type", "application/x-www-form-urlencoded")
  let params = req.query;
  // console.log("req.query", req.query, "req.body", req.body, "req.params", req.params);

  function getFake() {
    return new Promise(function (resolve) {

      let listOfRandomData = [];
      //  console.log("req.param.data", req.params.data);

      for (let i = 0; i < req.params.data; i++) {
        let newData = {
          "name": faker.name.findName(),
          "email": faker.internet.email(),
          "address": faker.address.streetName() + ", " + faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.zipCode()
        }
        listOfRandomData.push(newData);

      }
      //  console.log("listOfRandomData",listOfRandomData);
      resolve(listOfRandomData);
      if (listOfRandomData.length <= 0) reject({ "listOfRandomData": listOfRandomData });
    })
  }

  async function getData() {
    let x = await getFake().catch((err) => { console.log("err is: ", err); });;
    console.log("getData().length", x.length)
    return res.json({ "data": x });
    // return x;
  }

  let endResult = getData();
  // console.log("endResult",endResult);
  // return res.json({ "newData": endResult });

});