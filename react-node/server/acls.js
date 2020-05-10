var Buffermaker = require('buffermaker');
const kafka = require('./kafka-node-2/kafka.js')
const protocol = require('./kafka-node-2/lib/protocol/protocol.js')
const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});

function encodeRequestHeader (clientId, correlationId, apiKey, apiVersion) {
  return new Buffermaker()
    .Int16BE(apiKey)
    .Int16BE(1)
    .Int32BE(correlationId)
    .Int16BE(clientId.length)
    .string(clientId);
}

function encodeRequestWithLength (request) {
  return new Buffermaker().Int32BE(request.length).string(request).make();
}

client.getController((error, controller, controllerId)=>{
	console.log(controllerId)
	if (error) {
      return console.log(err)
    }
    filter = {
        resourceType: '',
        resourceName: '',
        principal: '',
        host: '',
        permissionType: '',
    }
    let brokerMetadata = client.brokerMetadata[controllerId];
    const broker = client.getBroker(brokerMetadata.host, brokerMetadata.port);
    const correlationId = client.nextId();
    decoder = function(resp){
    	console.log(resp)
    	return resp
    }
    encoder = function(clientId, correlationId, filter){
    	const request = encodeRequestHeader(clientId, correlationId, 29);
    	request.Int8(filter.resourceType)
    	request.string(filter.resourceName);
    	request.string(filter.principal);
    	request.string(filter.host);
    	request.Int8(filter.permissionType)
        return encodeRequestWithLength(request.make())
    }
    args = [client.clientId, correlationId, filter]
    let clientId = client.clientId 
    let request = encodeRequestHeader(clientId, correlationId, 29);
    request.Int32BE(filter.resourceType)
           .Int16BE(filter.resourceName.length).string(filter.resourceName)
           .Int16BE(filter.resourcePattern.length).string(filter.resourcePattern)
           .Int16BE(filter.principal.length).string(filter.principal)
           .Int16BE(filter.host.length).string(filter.host)
           .Int16BE(filter.operation)
           .Int32BE(filter.permission_type)
    request = encodeRequestWithLength(request.make());
    decoder = (resp)=>{
        console.log(resp)
        return resp
    }
    client.sendWhenReady(broker, correlationId, request, decoder, (err, data)=>{
        console.log(err, data)
    });
})