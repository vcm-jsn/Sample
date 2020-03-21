import React, { Component, useState } from 'react';

class PartitionRenderer extends React.Component {
	constructor(props){
		super(props)
		if(!localStorage.env) {
			localStorage.env = 'dev'
		}
		this.state = {
			env: localStorage.env || 'dev',
			options: [
				{
					name: 'Development',
					value: 'dev'
				},
				{
					name: 'Production',
					value: 'prod'
				},
				{
					name: 'QA',
					value: 'qa'
				}
			]
		}
	}

	handleEnvChange = (e)=>{
		env = e.currentTarget.value
		localStorage.env = env
		this.setState({
			env: env
		})
	}

	render(){
		return (
			<select value={this.state.env} onChange={this.handleEnvChange}>
				this.state.options.map((data)=>{
					<option value={data.value}>{data.name}</option>
				})
			</select>
		)
	}
}