const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended:false}));
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
const api_helper = require('./API_helper')

const kafka = require("kafka-node");
const kafkaConfig = require('./config/kafka.config')

function getKafkaClient(env){
  const config = kafkaConfig[env]
  return kafka.KafkaClient(config)
 }


 app.get('/listTopics', (req,resp) =>{

  client = getKafkaClient(req.params.env);
  const admin = new kafka.Admin(client);
 })


// app.use(function(req,res,next){

//     res.header("Access-Control=Allow-Origin", "*");
//     res.header("Access-Control=Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// })

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

app.get('/listConsumerGroups', (req, resp) => {

  const client = getKafkaClient(req.query.env)
  const admin = new kafka.Admin(client);
  admin.listGroups((err, res) => {
    if(err){
      return resp.status(500).send({error:'Server error in listConsumerGroups' + err})
    }
    const result = res
    resp.send(result)

  });
})

app.post('/getConsumerConfigs', (req, resp) =>{
  let consumerGroupIds = req.body.cgIds
  const client = getKafkaClient(req.query.env)
  const admin = new kafka.Admin(client);
  admin.describeGroups(consumerGroupIds, (err, res) => {
    if(err){
      return resp.status(500).send({error:'Server error in getConsumerConfigs' + err})
    }
    resp.send(res)
  })
})

app.post('/getTopicNameAndOffsets', (req, resp) =>{
  let topicName = req.body.topicName
  let groupId = req.body.groupId
  let partitions = req.body.partitions
  const client = getKafkaClient(req.query.env)
  const offset = new kafka.Offset(client)
  result = {}
  fetchCommmits = (mainCB) => {
    async.map(partitions, (partition , cb) => {
      console.log(partition)
      offset.fetchCommits(groupId, [{
        topicName : topicName,
        partition: partition
      }], cb)
    }, mainCB)
  }

  fetchOffsets = (mainCB) =>{
    console.log(topicName)
    offset.fetchLatestOffsets([topicName], mainCB)
  }
  async.parallel([fetchCommits, fetchOffsets], (err, data) =>{
    if(err){
      return res.status(500).send({error: err + 'Server error in getTopicNamesAndOffsets'})
    }
    result['commits'] = data[0]
    result['latestOffsets'] = data[1]
    res.send(result)
  })

})