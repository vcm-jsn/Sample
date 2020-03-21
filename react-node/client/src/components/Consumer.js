import React, { Component } from 'react';
import { secureFetch } from './api.service'
import { securePost } from './api.service'
import { AgGridReact } from 'ag-gird-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import Modal from "react-modal";

const customStyles = {

    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        height: "400px",
        width: "800px",
        overflowY: "auto"
    }
}

class cGroupRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    afterOpenModal() {}

    fetchCommitAndOffsets = (groupId, topicName, data) => {

        let partitionsList = [];
        let members = data.members;
        members.forEach(member => {
            let memberPartitions = [];
            let partitions = memeber.memberAssignment.partitions;
            let topicNames = Object.keys(partitions);
            topicNames.forEach(topic => {
                if (topicName == topic) {
                    memberPartitions = memberPartitions.concat(partitions[topicName]);
                }
            });
            partitionsList = partitionsList.concat(memberPartitions)
        })
        let uniquePartitions = new Set(partitionsList);

        securePost("/getTopicNamesAndOffsets/", {
            topicName: topicName,
            groupId: groupId,
            partitions: Array.from(uniquePartitions)
        }).then(commitsAndOffsets => {
            let data = commitsAndOffsets.data;
            let tableData = [];
            let offsets = data.latestOffsets[topicName];
            for (let commit of data.commits) {
                let row = {};
                for (var i in commit[topicName]) {
                    row["topicName"] = topicName;
                    row["groupId"] = groupId;
                    row["partition"] = i;
                    row["currentOffset"] = commit[topicName][i];
                    row["endOffset"] = offsets[i];
                    row["lag"] = row["endOffset"] - row["currentOffset"];
                    tableData.push(row);
                }
            }
            tableData.sort(
                (a, b) => parseInt(a["partition"]) - parseInt(b["partition"])
            );
            this.setState({
                tableData: tableData,
                modalIsOpen: true
            });
        }).catch(error => {
            console.log(error);
            //toast.error("Error:" + error);
        });
    };

    render() {
        let memberDetails = this.props.value;
        if (!memberDetails) {
            return "";
        }
        let members = memberDetails.members;
        if (members.length == 0) {
            return "Consumer State is Empty";
        }
        return (
            <React.Fragment>
                <div>
                    {members.map(member => {

                        let partitions = member.memberAssignment.partitions;
                        let topicNames = Object.keys(partitions);
                        if(!partitions){
                            return "";
                        }
                        if(!topicNames.length){
                            return "";
                        }
                        topicNames = topicNames.filter(n =>n);
                        return (
                            <table border = "1">
                                <tbody>
                                <tr>
                                    <th>MemberId</th>
                                    <th>Topic</th>
                                    <th>Partitions</th>
                                </tr>
                                {topicNames.map(topicName => {
                                    return (
                                        <tr>
                                            <td>{member.memberId}</td>
                                            <td  onClick={this.fetchCommitAndOffsets.bind(this,
                                            this.props.data.key,
                                            topicName,memberDetails)}>
                                            <a>{topicName}</a>
                                            </td>             
                                            <td>{partitions[topicName].join()}</td>
                                            </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )
                    })}
                </div>
                <Modal style={customStyles} isOpen={this.state.modalIsOpen}
                   onAfterOpen={this.afterOpenModal} onRequestClose={this.closeModal}
                   contentLabel="Topic Commits and Offsets">

                    <table border ="1">
                        <thead>
                            <tr>
                                <th>Consumer GroupId</th>
                                <th>Topic Name</th>
                                <th>Partition</th>
                                <th>Current Offset</th>
                                <th>End Offset</th>
                                <th>Lag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tableData.map(row =>{
                                return (
                                    <tr>
                                        <th>{row.groupid}</th>
                                        <th>{row.topicName}</th>
                                        <th>{row.partition}</th>
                                        <th>{row.currentOffset}</th>
                                        <th>{row.endOffset}</th>
                                        <th>{row.lag}</th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                   </Modal>
            </React.Fragment>
        )
    }

};


class consumers extends React.PureComponent {
    constructor(props) {
        super(props);
        this.paginatorContainerRef = React.createRef();
        this.state = {
            items: [],
            expanded: null,
            topicDetails: {},
            isLoaded: false,
            columnDefs: [{
                    headerName: "Consumer Group Id",
                    field: "key",
                    filter: true,
                    sortable: true,
                    width: 250,
                    sort: "asc",
                    tooltip: function(params) {
                        return (params.value);
                    }
                },
                { headerName: "Value", field: "value", filter: true },
                {
                    headerName: "MemberDetails",
                    field: "memberdetails",
                    sort: "asc",
                    cellRenderer: "consumerGroupRenderer",
                    width: 1000
                }
            ],
            getRowHeight: function(params) {
                if (!params.data.memberdetails) {
                    return 40;
                }
                return Math.floor(params.data.memberdetails.members.length) * 110 + 50;
            },
            frameworkComponents: {
                consumerGroupRenderer: cGroupRenderer
            },
            rowData: []
        };
        this.getConsumerDetails = this.getConsumerDetails.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    }

    handleSearchInputChange(event) {
        this.api.setQuickFilter(event.currentTarget.value);
    }


    getConsumerGroups() {

        secureFetch("/listConsumerGroups").then((consumerGroups) => {
            let rowData = [];
            let cgIds = [];
            for (var i in consumerGroups.data) {
                if (!i.startsWith("_")) {
                    cgIds.push(i);
                }
            }
            let currentCgIds = cgIds.slice(0, 10)
            this.setState({
                currentCgIds:currentCgIds,
                allCGIds: cgIds,
                isLoaded: true
            })
            this.getConsumerDetails(currentCgIds);
        }).catch(error => {
            console.log(error);
            //toast.error("Error:" + error);
        });
    }

    getConsumerDetails(cgIds) {

        securePost("/getConsumerConfigs/", {
            cgIds: cgIds
        }).then((consumerDetails) => {
            let allData = []
            cgIds.forEach((cgId)=>{
                let cgData = consumerDetails.data[cgId];
                allData.push({
                    key: cgId,
                    memberdetails: cgData
                })
            })
            this.setState((state) => {
                this.api.setRowData(allData)
            });
        }).catch(error => {
            console.log(error);
            //toast.error("Error:" + error);
        })
    }

    componentDidMount() {
        this.getConsumerGroups();
    }

    onGridReady(params) {

        this.api = params.api;
    }

    handlePaginationChanged = (page)=>{
        let currentCgIds = this.state.allCGIds.splice(page*10, 10)
        this.getConsumerDetails(currentCgIds);
    }

    render() {

        return (

            <div className="ag-theme-balham" style= {{height: '600px', width: '800px'}}>
        <div className="searchText" >
            <input type="text" onChange={this.handleSearchInputChange} placeholder="Search Consumer Groups"></input>
        </div>
    
    <AgGridReact pagination={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          frameworkComponents={this.state.frameworkComponents}
          getRowHeight={this.state.getRowHeight}
          pagination={true}
          paginationPageSize={10}
          paginationChanged={this.handlePaginationChanged}
          onGridReady={this.onGridReady}></AgGridReact>
          </div>
        );
    }

}

export default consumers;