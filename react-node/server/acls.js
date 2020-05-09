client.getController((error, controller, controllerId)=>{
	console.log(controllerId)
	if (error) {
      return console.log(err)
    }
    filter = {

    }
    let brokerMetadata = this.brokerMetadata[controllerId];
    const broker = client.getBroker(brokerMetadata.host, brokerMetadata.port);
    const correlationId = client.nextId();
    decoder = function(resp){
    	console.log(resp)
    	return resp
    }
    encoder = function(clientId, correlationId, filter){
    	const request = protocol.encodeRequestHeader(clientId, correlationId, 29);
    	request.Int8(filter.resourceType)
    	request.string(filter.resourceName);
    	request.string(filter.principal);
    	request.string(filter.host);
    	request.Int8(filter.permissionType)
    }
    args = [client.clientId, correlationId, filter]
    client.sendWhenReady(broker, correlationId, request, decoder, (err, data)=>{
    	console.log(err, data)
    });
})