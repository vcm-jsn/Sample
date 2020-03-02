const path = require('path')

var nodeEnv = process.env['NODE_ENV'] || 'dev'

const defaultConfig = {
	kafka: {
		host: 'http://kafkahost',
		ssl: {
			key: 'key'
		}
	}
}

let envConfig = require(path.join(__dirname, `${nodeEnv}.js`))

exports = Object.assign(defaultConfig, envConfig)