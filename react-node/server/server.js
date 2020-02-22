const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended:false}));
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
const api_helper = require('./API_helper')

//const kafka = require("kafka-node");

//const client = new kafka.KafkaClient({kafkaHost: 'hosts'})

app.use(function(req,res,next){

    res.header("Access-Control=Allow-Origin", "*");
    res.header("Access-Control=Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/listEmployees', (req, res) =>{

  api_helper.make_API_call('http://dummy.restapiexample.com/api/v1/employees')
  .then(response => {
    res.json(response)
  })
  .catch(error => {
    res.send(error)
})
});

app.get('/listEmployees/:employeeName', (req, res) => {

let employeeName = 23;
api_helper.make_employeeDetailsAPI_call('http://dummy.restapiexample.com/api/v1/employee/', employeeName)
.then(response => {

    res.json(response)
})
.catch(error => {

    res.send(error)
})
});