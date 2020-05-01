var EventEmitter = require('eventemitter3');

export class Store {
	constructor(){
		this.data = {}
		this.emitter = new EventEmitter()
	}
	setData(newData){
		this.data = {...this.data, ...newData}
		this.emitter.emit('changed', this.data)
	}
}