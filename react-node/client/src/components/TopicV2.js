import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { secureFetch } from './api.service'
import { AgGridReact } from 'ag-gird-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { Link } from "react-router-dom";

class PartitionRenderer extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        let partitions = this.props.value
        let partitionsView = partitions.map((partition)=>{
            return (<div className="grid-partition-info">
                <div>Partition : {partition.partition}</div>
                <div>Leader : {partition.leader}</div>
                <div>Replicas : {partition.replicas.join()}</div>
                <div>ISR : {partition.isr.join()}</div>
            </div>)
        })
        return partitionsView
    }
}

class TopicsV2 extends React.PureComponent {
    construtor(props) {
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
                    tooltip: function(params) {
                        return (params.value);
                    }
                },
                { 
                    headerName: "Partitions",
                    field: "partitions",
                    filter: true,
                    cellRenderer: PartitionRenderer
                },
            ]
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
        kafkaNode.listTopics((err, res)=>{
            if (err) {
                // Do something for error,
                return
            }
            topicsMetadata = res[1]['metadata']
            topicsData = []
            for (var topicName in topicsMetadata) {
                let partitions = []
                partitionsKeys = Object.keys(topicsMetadata[topicName])
                partitions = partitionsKeys.map((partitionsKey)=>{
                    topicsMetadata[topicName][partitionsKey]
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
                    paginationPageSize={this.state.pageSize}
                    onPaginationChanged={this.handlePageChange}
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}>
                 </AgGridReact>
          </div>
        );
    }
}

export default Topics;