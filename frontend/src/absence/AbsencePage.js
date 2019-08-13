import React, { Component } from 'react';
import { getAllUser, getAllAbsence, registerNewAbsence, getAllAbsencesOfUser,
    getAllTeam, getAllMyApprovingAbsences, updateStatusAbsence } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Alert, DatePicker, Modal, Button, Icon, Collapse, notification, Card, 
    Select, Form, Radio, Input} from 'antd';
import { withRouter } from 'react-router-dom';
import './AbsencePage.css';

import {getMatchTeamIDOfUser, getMatchLeaderOfUser} from '../util/Helpers'

import { Table, Divider, Tag } from 'antd';
var moment = require('moment');

const { Column, ColumnGroup } = Table;

const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// Value of Table data as Rule below:
// 0: Normal Working day
// -1: National Holiday
// 1: FUll Day
// 2: AM absence
// 3: PM absence
function getClassNameFromValue(v) {
    if (v == -1) {
        return "absence-national-holiday-cell";
    } else if (v == 1) {
        return "absence-full-cell";
    } else if (v == 2) {
        return "absence-am-cell";
    } else if (v == 3) {
        return "absence-pm-cell";
    } else {
        return "absence-normal-cell";
    }
}
function getTextFromValue(v) {
    if (v == -1) {
        return "";
    } else if (v == 1) {
        return "F";
    } else if (v == 2) {
        return "AM";
    } else if (v == 3) {
        return "PM";
    } else {
        return "";
    }
}

// Return 1 if Inside, 2 if equal to From, 3 if Equal to "to", 0 if Outside
function checkDateInsideRange(d, from, to) {
    // Normalize
    d = new Date(d.toLocaleDateString())
    from = new Date(from.toLocaleDateString())
    to = new Date(to.toLocaleDateString())

    if (d.getTime() >= from.getTime() && d.getTime() <= to.getTime()) {
        if (d.getTime() == from.getTime()) {
            return 2;
        }
        if (d.getTime() == to.getTime()) {
            return 3;
        }
        return 1;
    } else {
        return 0;
    }

    // if ( 
    //     (d.getFullYear() >= from.getFullYear() && d.getFullYear() <= to.getFullYear()) &&
    //     (d.getMonth() >= from.getMonth() && d.getMonth() <= to.getMonth()) &&
    //     (d.getDate() >= from.getDate() && d.getDate() <= to.getDate())
    // ) {
    //     return true;
    // }
    // return false;
}
class AbsencePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams:[],
            absences: {}, // absencses in selected Team
            myAbsences:[],
            myApprovingAbsences: [], // ABsences which I have to approve
            matchedApprover:"", // People which responsibility for Approve Absence

            fFromDate: null,
            fFromPeriod: "AM",
            fToDate: null,
            fToPeriod: "PM",
            fDescription: "",

            isOpenModalAdd:false,
            isOpenModalReject: false,
            fRejectReason: "",
            fRejectID: "",

            fSelectedTeam: "",
            fSelectedMonth: moment(new Date()),
            currentTeam: null
        };
        this.fetchAbsences = this.fetchAbsences.bind(this);
        this.fetchApprovingAbsences = this.fetchApprovingAbsences.bind(this);
        this.fetchTeams = this.fetchTeams.bind(this);

        this.handleSelectTeamChange = this.handleSelectTeamChange.bind(this);
        this.handleSelectMonth = this.handleSelectMonth.bind(this);

        this.handleSubmitNewAbsence = this.handleSubmitNewAbsence.bind(this);

        this.handleCancelAdd = this.handleCancelAdd.bind(this)
        this.handleOpenAdd = this.handleOpenAdd.bind(this)

        this.handleChangeFromPeriod = this.handleChangeFromPeriod.bind(this);
        this.handleChangeToPeriod = this.handleChangeToPeriod.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
        this.handleChangeToDate = this.handleChangeToDate.bind(this);

        this.renderTeamAbsences = this.renderTeamAbsences.bind(this)

        this.clickApproveAbsence = this.clickApproveAbsence.bind(this)
        this.clickRejectAbsence = this.clickRejectAbsence.bind(this)
        this.handleRejectReasonChange = this.handleRejectReasonChange.bind(this)
        this.clickOkRejectModel = this.clickOkRejectModel.bind(this)
        this.clickCancelRejectModel = this.clickCancelRejectModel.bind(this)
    }
    fetchTeams() {
        getAllTeam()
        .then( response => {
            console.log("Get All Teams")
            console.log(response)
            var bestMatchTeam = getMatchTeamIDOfUser(response.data.teams,
                this.props.currentUser.username)
            
            var bestMatchLeader = getMatchLeaderOfUser(response.data.teams,
                this.props.currentUser.username);

            if (bestMatchTeam) {
                this.setState({
                    teams: response.data.teams,
                    fSelectedTeam: bestMatchTeam,
                    matchedApprover: bestMatchLeader
                });
                this.handleSelectTeamChange(bestMatchTeam);
            } else {
                this.setState({
                    teams: response.data.teams,
                    matchedApprover: bestMatchLeader
                });
            }

        })
        .catch(error => {
            console.log("Get All Teams error")
        }); 
    }
    fetchAbsences() {
        if (this.props.currentUser) {
            getAllAbsencesOfUser(this.props.currentUser.username)
            .then( response => {
                console.log("All Absences:")
                console.log(response.data)

                this.setState({
                    myAbsences: [...response.data.absence]
                })
            }).catch(err => {
                console.log("All Absence Error")
                console.log(err)
            });
        }
    }
    fetchApprovingAbsences() {
        if (this.props.currentUser) {
            getAllMyApprovingAbsences(this.props.currentUser.username)
            .then( response => {
                console.log("All Approving Absences:")
                console.log(response.data)

                this.setState({
                    myApprovingAbsences: [...response.data.absenceApprove]
                })
            }).catch(err => {
                console.log("All Approving Absence Error")
                console.log(err)
            });
        }
    }
    
    componentDidMount() {
        this.fetchApprovingAbsences()
        this.fetchAbsences()
        this.fetchTeams()
    }

    // --------------------Form-----------------
    handleChangeFromPeriod(e) {
        this.setState({
            fFromPeriod: e.target.value,
        });
    }
    handleChangeToPeriod(e) {
        this.setState({
            fToPeriod: e.target.value,
        });
    }
    handleChangeDescription(e) {
        this.setState({
            fDescription: e.target.value,
        });
    }
    handleChangeFromDate(date, dateString) {
        this.setState({
            fFromDate: dateString
        });
    }
    handleChangeToDate(date, dateString) {
        this.setState({
            fToDate: dateString
        });
    }

    // -----------------End Form-----------------
    handleSelectMonth(date, dateString) {
        if (date._d) {
            this.setState({
                fSelectedMonth: date
            })
        }
    }
    handleSelectTeamChange(v) {
        let curSelectedTeam;
        this.state.teams.forEach(element => {
            if (element.id == v) {
                curSelectedTeam = element;
            }
        })
        this.setState({
            fSelectedTeam: v,
            currentTeam: curSelectedTeam
        });

        var newAbsences = {};
        curSelectedTeam.members.forEach(element => {
            // Fetch all Absences of Member in Team
            getAllAbsencesOfUser(element.username)
            .then( response => {
                newAbsences["" + element.username] = [...response.data.absence];

                this.setState({
                    absences: newAbsences
                })

            }).catch(err => {
                //console.log("All Absence Error")
               // console.log(err)
            });
        })
        
        
    }

    handleCancelAdd(e) {
        this.setState({
            isOpenModalAdd: false,
        })
    }

    handleOpenAdd(e) {
        e.preventDefault()
        this.setState({
            isOpenModalAdd: true,
        })
    }
    
    handleSubmitNewAbsence(event) {
        event.preventDefault();
        let request = {
            fromDate: this.state.fFromDate,
            fromPeriod: this.state.fFromPeriod,
            toDate: this.state.fToDate,
            toPeriod: this.state.fToPeriod,
            description: this.state.fDescription,
            username: this.props.currentUser.username,
            approver: this.state.matchedApprover
        };

        registerNewAbsence(request)
        .then( response => {
            console.log("Add Absence DONE")
            console.log(response.data)
        }).catch(err => {
            console.log("Add Absence Error")
            console.log(err)
        });

        this.setState({
            isOpenModalAdd: false,
        })
        
    }
    
    // -----------------------------Approving
    clickApproveAbsence(record, e) {
        e.preventDefault();
        console.log("APprove:" + record.id)
        updateStatusAbsence({id: record.id, status: "APPROVED", feedBack: ""})
        .then( response => {
            console.log("Approve DONE")
            console.log(response.data.updateAbsenceStatus)

            // Update Array with new information
            let newInfo = response.data.updateAbsenceStatus;
            let newAbsences = [];
            this.state.myApprovingAbsences.forEach(element => {
                if (element.id == newInfo.id) {
                    // Not Push to List this Absence
                    //newAbsences.push(newInfo);
                } else {
                    newAbsences.push(element);
                }
            })
            this.setState({
                myApprovingAbsences: newAbsences
            })

        }).catch(err => {
            console.log("Approve Error")
            console.log(err)
        });
    }

    clickRejectAbsence (record, e) {
        e.preventDefault();
        console.log("Reject:" + record.id)
        this.setState({
            isOpenModalReject: true,
            fRejectID: record.id
        })
    }
    clickOkRejectModel(e) {
        console.log("Reject with Reason:" + this.state.fRejectReason 
            + ",id:" + this.state.fRejectID)
        
        updateStatusAbsence({id: this.state.fRejectID, status: "REJECT", feedBack: this.state.fRejectReason})
        .then( response => {
            console.log("REJECT DONE")
            console.log(response.data.updateAbsenceStatus)

            // Update Array with new information
            let newInfo = response.data.updateAbsenceStatus;
            let newAbsences = [];
            this.state.myApprovingAbsences.forEach(element => {
                if (element.id == newInfo.id) {
                    // Not Push to List this Absence
                    //newAbsences.push(newInfo);
                } else {
                    newAbsences.push(element);
                }
            })
            this.setState({
                myApprovingAbsences: newAbsences,
                isOpenModalReject: false,
                fRejectID: ""
            })

        }).catch(err => {
            console.log("REJECT Error")
            this.setState({
                isOpenModalReject: false,
                fRejectID: ""
            })
        });
    }
    clickCancelRejectModel(e) {
        this.setState({
            isOpenModalReject: false,
            fRejectID: ""
        })
    }
    handleRejectReasonChange(e) {
        this.setState({
            fRejectReason: e.target.value
        })
    }


    //--------------------------------------------------

    renderAddAbsence () {
        const formItemLayout = null;
        // const formItemLayout =
        //     {
        //         labelCol: { span: 6 },
        //         wrapperCol: { span: 12 },
        //     };

        const fromPeriod = 
            <Radio.Group onChange={this.handleChangeFromPeriod} 
                    value={this.state.fFromPeriod}>
                <Radio value={"AM"}>AM</Radio>
                <Radio value={"PM"}>PM</Radio>
            </Radio.Group>;
        const toPeriod = 
            <Radio.Group onChange={this.handleChangeToPeriod} 
                    value={this.state.fToPeriod}>
                <Radio value={"AM"}>AM</Radio>
                <Radio value={"PM"}>PM</Radio>
            </Radio.Group>;
        return(
            <Form layout={"horizontal"}  className="addmember-container">
                <FormItem {...formItemLayout}>
                    From: &nbsp;
                    <DatePicker onChange={this.handleChangeFromDate} format="YYYY/MM/DD"/>
                    &nbsp;&nbsp;{fromPeriod}
                </FormItem>

                <FormItem {...formItemLayout}>
                    To: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <DatePicker onChange={this.handleChangeToDate} format="YYYY/MM/DD"/>
                    &nbsp;&nbsp;{toPeriod}
                </FormItem>

                <Input 
                    name="description"
                    autoComplete="off"
                    placeholder="Absence reason"
                    value={this.state.fDescription} 
                    onChange={(event) => this.handleChangeDescription(event)} />  
                <br/><br/>
                <FormItem {...formItemLayout}>
                    <span style={{fontWeight:"bold", color:"blue"}}>Approver: {this.state.matchedApprover} </span>
                </FormItem>  
            </Form>
        )
    }

    renderTeamsList() {
        const views = [];
        this.state.teams.forEach((item, idx) => {
            views.push(
            <Option key={item.id} value={item.id}>
                {item.name}
            </Option>)            
        });
        return (
        <Select style={{width: "200px"}}
            optionFilterProp="children"
            showSearch
            onChange={this.handleSelectTeamChange}
            placeholder="To Team"
            value={this.state.fSelectedTeam}
            >
            {views}
        </Select>
        );
    }

    renderMyApprovingAbsences() {
        let tblData = [];
        let columns = [];
        if (this.state.myApprovingAbsences) {
            if (this.state.myApprovingAbsences.length > 0) {
                // Filter the Date he if needed
                this.state.myApprovingAbsences.forEach(element => {
                    tblData.push ({
                        fromDate: (new Date(element.fromDate)).toLocaleDateString("ja-JP") 
                            + "," + element.fromPeriod,
                        toDate: (new Date(element.toDate)).toLocaleDateString("ja-JP")
                        + "," + element.toPeriod,
                        status: element.status,
                        description: element.description,
                        feedBack: element.feedBack,
                        id: element.id,
                        pureFromDate: new Date(element.fromDate),
                        pureToDate: new Date(element.toDate),
                        username: element.username
                    })
                })
                
                columns = [
                    {
                        title: 'Member',
                        dataIndex: 'username',
                        width: 150,
                    },
                    {
                        title: 'From',
                        dataIndex: 'fromDate',
                        width: 150,
                    },
                    {
                        title: 'To',
                        dataIndex: 'toDate',
                        width: 150, 
                    },
                    {
                        title: 'Reason',
                        dataIndex: 'description',
                        width: 200,
                    },
                    {
                        title: 'Approve',
                        key: 'x',
                        render: (text, record) => (
                            <span
                                className="action-approve"
                                onClick={(e) => { this.clickApproveAbsence(record, e); }}>
                              OK
                            </span>
                        ),
                        width: 100,
                    },
                    {
                        title: 'Reject',
                        key: 'e',
                        render: (text, record) => (
                            <span
                                className="action-reject"
                                onClick={(e) => { this.clickRejectAbsence(record, e); }}>
                              REJECT
                            </span>
                        ),
                        width: 100,
                    },
                ];
            }
        }

        return (
            <Table dataSource={tblData} pagination={false} size={"small"}
                    columns={columns} rowKey="id" scroll={{y: 300 }}/>
        );
    }
    
    renderMyAbsences() {
        let tblData = [];
        let columns = [];
        if (this.state.myAbsences) {
            if (this.state.myAbsences.length > 0) {
                // Filter the Date he if needed
                this.state.myAbsences.forEach(element => {
                    tblData.push ({
                        fromDate: (new Date(element.fromDate)).toLocaleDateString("ja-JP") 
                            + "," + element.fromPeriod,
                        toDate: (new Date(element.toDate)).toLocaleDateString("ja-JP")
                        + "," + element.toPeriod,
                        status: element.status,
                        description: element.description,
                        feedBack: element.feedBack,
                        id: element.id,
                        pureFromDate: new Date(element.fromDate),
                        pureToDate: new Date(element.toDate),
                    })
                })
                
                columns = [
                    {
                        title: 'From',
                        dataIndex: 'fromDate',
                        defaultSortOrder: 'ascend',
                        sorter: (a, b) => (new Date(a.pureFromDate) - new Date(b.pureFromDate)),
                        sortDirections: ['descend', 'ascend'],
                        width: 150,
                    },
                    {
                        title: 'To',
                        dataIndex: 'toDate',
                        width: 150, 
                    },
                    {
                        title: 'Reason',
                        dataIndex: 'description',
                        width: 200,
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.status.localeCompare(b.status),
                        sortDirections: ['descend', 'ascend'],
                        width: 150,
                    },
                    {
                        title: 'FeedBack',
                        dataIndex: 'feedBack',
                    },
                ];
            }
        }

        return (
            <Table dataSource={tblData} pagination={false} size={"small"}
                    columns={columns} rowKey="id" scroll={{y: 300 }}/>
        );
    }
    
    renderTeamAbsences() {
        let tblData = [];
        let columns = [];
        if (this.state.currentTeam) {
            if (this.state.currentTeam.members && this.state.currentTeam.members.length > 0) {
                var fromDate = new Date(this.state.fSelectedMonth._d.getFullYear(),
                    this.state.fSelectedMonth._d.getMonth(), 1);
                var toDate = new Date(this.state.fSelectedMonth._d.getFullYear(), 
                    this.state.fSelectedMonth._d.getMonth() + 1, 0);

                columns.push({
                    title: "Mem",
                    dataIndex: "username",
                    width: 100,
                    fixed: 'left',
                })

                for (var d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
                    columns.push({
                        title: "" + d.getDate() + " " +
                            d.toLocaleString('en-us', {  weekday: 'short' })[0],
                        dataIndex: "" + d.getDate(),
                        width: 30,
                        render: (text) => {
                            return {
                              props: {
                                className: getClassNameFromValue(text),
                              },
                              children: <span style={{fontSize: "0.6em"}}>{getTextFromValue(text)}</span>,
                            }
                        }
                    })
                }

                // Value of Table data as Rule below:
                // 0: Normal Working day
                // -1: National Holiday
                // 1: FUll Day
                // 2: AM absence
                // 3: PM absence
                var allAbsences = this.state.absences;
                for (var i = 0; i < this.state.currentTeam.members.length; i++) {
                    var element = this.state.currentTeam.members[i];
                    var rowData = {};
                    var absenceOfMember = allAbsences[element.username];

                    for (var d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
                        rowData["" + d.getDate()] = 0;
                        rowData["username"] = element.username;

                        // check if current today date inside the Absence range
                        if (absenceOfMember) {
                        for (var j = 0; j < absenceOfMember.length; j++) {
                            // check if Current d inside the Absence range
                            rowData["" + d.getDate()] = 0;
                            let item = absenceOfMember[j];
                            let checkRange = checkDateInsideRange(d, 
                                new Date(item.fromDate),new Date(item.toDate));
                            if (checkRange) {
                                rowData["" + d.getDate()] = 1;
                                if (checkRange != 1) {
                                    // if From and To is same, Period same -> HalfDay
                                    if (item.fromDate == item.toDate && 
                                        item.fromPeriod == item.toPeriod) {
                                        // HalfDay ABsence
                                        if (item.fromPeriod == "AM") {
                                            rowData["" + d.getDate()] = 2;
                                        } else {
                                            rowData["" + d.getDate()] = 3;
                                        }
                                    } else {
                                        if (checkRange == 2) {
                                            if (item.fromPeriod == "PM") {
                                                // PM Absence
                                                rowData["" + d.getDate()] = 3;
                                            }
                                        } else {
                                            // TO Date
                                            if (item.toPeriod == "AM") {
                                                // AM Absence
                                                rowData["" + d.getDate()] = 2;
                                            }
                                        }
                                    }
                                }

                                break;
                            }
                        }
                        }
                        if (d.getDay() == 6 || d.getDay() == 0) {
                            rowData["" + d.getDate()] = -1;
                        }
                    }
                    tblData.push(rowData);
                }
            }
        }

        return (
            <Table bordered dataSource={tblData} pagination={false} size={"small"}
                    columns={columns} rowKey="id" scroll={{x: 1150, y: false }}/>
        );
    }

    render() {
        console.log("Rendering Absence Page")
        var renderApproving = "";
        if (this.state.myApprovingAbsences && this.state.myApprovingAbsences.length > 0) {
            renderApproving = 
                <React.Fragment>
                <Card title={"Absence Approving"}>
                    <Alert
                    message="Please Approving Absences Request below"
                    type="error"
                    /><br/>
                    {this.renderMyApprovingAbsences()}
                </Card> <br/>
                </React.Fragment>
        }
        return (
            <React.Fragment>
                {renderApproving}

                { (this.state.myAbsences && this.state.myAbsences.length > 0) ?
                <React.Fragment>
                <Collapse defaultActiveKey={['1']}>
                <Panel header="My Absences" key="1">
                    <Button type="primary" 
                        size="medium" onClick={this.handleOpenAdd}>
                    Register Absence
                    </Button>
                    <br/><br/>
                    {this.renderMyAbsences()}
                </Panel>
                </Collapse> 
                <br/>
                </React.Fragment> : ""
                }
                
                <Collapse defaultActiveKey={['2']}>
                <Panel header="Team Absences" key="2">
                    Select Team:
                    {this.renderTeamsList()}
                    <MonthPicker onChange={this.handleSelectMonth} 
                        placeholder="Select month" value={this.state.fSelectedMonth}/>

                    {this.renderTeamAbsences()}
                </Panel>
                </Collapse> 

                <br/><br/><br/>
                <Modal
                        title="Register New Absence"
                        visible={this.state.isOpenModalAdd}
                        onOk={this.handleSubmitNewAbsence}
                        onCancel={this.handleCancelAdd}
                        >
                    {this.renderAddAbsence()}
                </Modal>

                <Modal
                        title="Reject's Reason"
                        visible={this.state.isOpenModalReject}
                        onOk={this.clickOkRejectModel}
                        onCancel={this.clickCancelRejectModel}
                        >
                    <Input 
                        size="medium"
                        name="rejectreason"
                        autoComplete="off"
                        placeholder="Reject Reason"
                        value={this.state.fRejectReason} 
                        onChange={(event) => this.handleRejectReasonChange(event)} />  
                </Modal>

            </React.Fragment>
        )
    }
}

export default withRouter(AbsencePage);
