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
            modalIsOpen: false,
            page: 0
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
        let topicNameMap = {}
        members.map((member)=>{
            let partitions = member.memberAssignment.partitions;
            let topicNames = Object.keys(partitions);
            topicNames.forEach((topicName)=>{
                if (!topicName) {return}
                if (!topicNameMap[topicName]) {
                    topicNameMap[topicName] = []
                }
                topicNameMap[topicName].push({
                    partitions: partitions[topicName],
                    memberId: member.id
                })
            })
        })
        let topicNames = Object.keys(topicNameMap)
        return (
            <React.Fragment>
                <div>
                    {topicNames.map(topicName => {
                        return (
                            <div onClick={this.fetchCommitAndOffsets.bind(this,
                                    this.props.data.key,
                                    topicName,memberDetails)}>Topic Name: {topicName} </div>
                            <table border = "1">
                                <tbody>
                                <tr>
                                    <th>MemberId</th>
                                    <th>Partitions</th>
                                </tr>
                                {topicNameMap[topicName].map(data => {
                                    return (
                                        <tr>
                                            <td>{data.memberId}</td>             
                                            <td>{data.partitions.join()}</td>
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
                rowData.push({
                    key: i
                })
            }
            let currentCgIds = cgIds.slice(0, 10)
            this.setState({
                currentCgIds:currentCgIds,
                allCGIds: cgIds,
                isLoaded: true,
                rowData: rowData
            })
            this.getConsumerDetails(currentCgIds);
        }).catch(error => {
            console.log(error);
            //toast.error("Error:" + error);
        });
    }

    getConsumerDetails(cgIds) {
        let rowData = this.state.rowData
        let page = this.state.page
        securePost("/getConsumerConfigs/", {
            cgIds: cgIds
        }).then((consumerDetails) => {
            let allData = []
            cgIds.forEach((cgId, i)=>{
                let cgData = consumerDetails.data[cgId];
                rowData[page*10 + i][memberdetails] = cgData
            })
            setTimeout(()=>{
               this.api.setRowData(rowData)     
            }, 100)
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
        this.api.onPaginationChanged = this.handlePaginationChanged
    }

    handlePaginationChanged = (event)=>{
        if (!this.api) {
            this.api = event.api
        }
        let page = event.api.paginationGetCurrentPage()
        if (page == this.state.page) {
            return
        }
        let currentCgIds = this.state.allCGIds.slice(page*10, 10)
        this.setState({
            page
        })
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