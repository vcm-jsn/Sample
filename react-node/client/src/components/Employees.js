import React , {Component, useState} from 'react';
import {secureFetch} from './api.service'
import {AgGridReact} from 'ag-gird-react'
import'ag-grid-community/dist/styles/ag-grid.css'
import'ag-grid-community/dist/styles/ag-theme-balham.css'
import {Link} from "react-router-dom";

class Employees extends React.PureComponent {
    construtor(props){
    //super(props);
    this.paginatorContainerRef = React.createRef();
    this.state = {
    items:[],
    topicDetails: {},
    isLoaded : false,
    columnDefs :[
    {headerName: "Topic-Name", field: "topic", filter:true,
            tooltip:function(params){
                return (params.value);
            }
        },
    {headerName: "Topic-Type", field: "cleanup", filter:true},
    {headerName: "Count", field: "count", filter:true}    
  ]
}
 this.getTopicsDetails = this.getTopicsDetails.bind(this);
 this.onGridReady = this.onGridReady.bind(this);
 this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
}

handleSearchInputChange(event){
    this.paginatorContainerRef.setQuickFilter(event.currentTarget.value);
}


getTopics(){

    secureFetch("/listEmployees").then((topics) =>{
    let topicsData = topics.data.map((topic) =>{

        return {
            topic: topic
        }
    })
    this.setState({
        rowData:topicsData,
        isLoaded:true
    })
    topics.data.forEach(this.getTopicsDetails);
    })
}


getTopicsDetails(topicName, index){

    secureFetch("/listTopics/" + topicName).then((response) =>{
        let topicDetails = {
            cleanup: response.data.configs["cleanup"],
            topic:this.state.rowData[index].topic
        }
        this.setState((state) =>{

            state.rowData[index] = topicDetails
            this.api.setRowData(state.rowData)
            return state
        })
    });
}

componentDidMount(){
    this.getTopics();
}

onGridReady( params){

    this.api = params.api;
}

render(){

    return(

        <div className="ag-theme-balham" style= {{height: '600px', width: '800px'}}>
         <div className="searchText" ><input type="text" onChange={this.handleSearchInputChange} placeholder="Search Topics"></input></div>
    
    <AgGridReact pagination={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          onGridReady={this.onGridReady}></AgGridReact>
          </div>
    
    );


}

}

export default Employees;