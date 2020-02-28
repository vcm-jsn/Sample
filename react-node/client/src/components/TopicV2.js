import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { secureFetch } from './api.service'
import { AgGridReact } from 'ag-gird-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { Link } from "react-router-dom";

import Modal from 'react-modal';


class PartitionRenderer extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        let partitions = this.props.value
        let partitionsView = partitions.map((partition)=>{
            return (<tr className="grid-partition-info">
                <td>{partition.partition}</td>
                <td>{partition.leader}</td>
                <td>{partition.replicas.join()}</td>
                <td>{partition.isr.join()}</td>
            </tr>)
        })
        return (
            <table className="partition-table">
                <tbody>
                    <tr>
                        <td>partition</td>
                        <td>leader</td>
                        <td>replicas.join()</td>
                        <td>isr</td>
                    </tr>
                    {partitionsView}
                </tbody>
            </table>
        )
    }
}

class TopicNameRenderer extends React.createComponent {
    constructor(props) {
        super(props)
        this.state = {
            topicDetails: {},
            modalIsOpen: false
        }
    }

    openDetailsInfo = ()=>{
        kafkaNode.describeConfigs(this.props.value, (err, topicDetails)=>{
            this.setState({
                topicDetails: topicDetails,
                modalIsOpen: true
            })
        })
    }
    closeModal(){
        this.setState({
            modalIsOpen: false
        })
    }
    afterOpenModal(){

    }
    render(){
        return (
            <div onClick={this.openDetailsInfo}>{this.props.value}</div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Topic Details">
                {this.state.topicDetails.map((details)=>{
                    return (
                        <table>
                            <thead>
                                <tr>
                                    <td>Config Name</td>
                                    <td>Config Value</td>
                                    <td>Config Source</td>
                                    <td>Readonly</td>
                                </tr>
                            </thead>
                            <tbody>
                                {details.configEntries.map((entry)=>{
                                    return (
                                        <tr>
                                            <td>{entry.configName}</td>
                                            <td>{entry.configValue}</td>
                                            <td>{entry.configSource}</td>
                                            <td>{entry.readOnly}</td>
                                        </tr>
                                    )
                                })
                            </tbody>
                        </table>
                    )
                })
            </Modal>
        )
    }
}

class TopicsV2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.paginatorContainerRef = React.createRef();
        this.state = {
            items: [],
            topicDetails: {},
            isLoaded: false,
            columnDefs: [{
                    headerName: "Topic Name",
                    field: "topic",
                    filter: true,
                    cellRenderer: 'topicNameRenderer',
                    tooltip: function(params) {
                        return (params.value);
                    }
                },
                { 
                    headerName: "Partitions",
                    field: "partitions",
                    filter: true,
                    cellRenderer: 'partitionRenderer'
                },
            ],
            frameworkComponents: {
                partitionRenderer: PartitionRenderer,
                topicNameRenderer: TopicNameRenderer
            }
        }
        this.getTopicsDetails = this.getTopicsDetails.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    }

    handleSearchInputChange(event) {
        this.paginatorContainerRef.setQuickFilter(event.currentTarget.value);
    }

    getTopics() {
        secureFetch("/listTopics").then((topics) => {
            let topicsData = topics.data.map((topic) => {
                return {
                    topic: topic
                }
            })
            this.setState({
                rowData: topicsData,
                isLoaded: true
            })
            topics.data.forEach(this.getTopicsDetails);
        })
    }

    getTopicsDetails(topicName, index) {
        kafkaNode.listTopics((res)=>{            
            topicsMetadata = res.data[1].metadata
            topicsData = []
            for (var topicName in topicsMetadata) {
                let partitions = []
                let partitionsKeys = Object.keys(topicsMetadata[topicName])
                partitions = partitionsKeys.map((partitionsKey)=>{
                    return{
                        partitions: topicsMetadata[topicName][partitionsKey]
                    }
                })
                topicsData.push({
                    topic: topicName,
                    partitions: partitions
                })
            }
            this.setState({
                rowData: topicsData
            })
        })
    }

    componentDidMount() {
        this.getTopicsDetails();
    }

    onGridReady(params) {
        this.api = params.api;
    }

    render() {
        return (
            <div className="ag-theme-balham" style= {{height: '600px', width: '800px'}}>
                <div className="searchText" ><input type="text" onChange={this.handleSearchInputChange} placeholder="Search Topics"></input></div>
                <AgGridReact pagination={true}
                    
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}>
                 </AgGridReact>
          </div>
        );
    }
}

export default TopicsV2;