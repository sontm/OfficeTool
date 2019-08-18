import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Alert, DatePicker, Modal, Button, Icon, Collapse, notification, Card, 
    Select, Form, Radio, Input} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {  actAbsenceGetOfMembers, actAbsenceGetMine,actAbsenceGetMyApproving,
    actRegisterNewAbsence, actAbsenceUpdateStatus, actAbsenceDelete, actAbsenceHandleSelectTeam} from '../redux/actions/AbsenceActions';
import { actTeamGet,actTeamGetMembers, actTeamAddMemberToTeam, actTeamHandleSelectTeam,
    actTeamDeleteMember } from '../redux/actions/TeamActions';


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

            fSelectedMonth: moment(new Date()),
        };
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

        this.handleDeleteAbsence = this.handleDeleteAbsence.bind(this)

        this.renderTeamAbsences = this.renderTeamAbsences.bind(this)

        this.clickApproveAbsence = this.clickApproveAbsence.bind(this)
        this.clickRejectAbsence = this.clickRejectAbsence.bind(this)
        this.handleRejectReasonChange = this.handleRejectReasonChange.bind(this)
        this.clickOkRejectModel = this.clickOkRejectModel.bind(this)
        this.clickCancelRejectModel = this.clickCancelRejectModel.bind(this)

        this.initialLoaded = false;
        this.currentTeam = null
    }

    componentDidMount() {
        if (this.props.team.teams.length <= 0 ) {
            this.props.actTeamGet();
        }
    }
    componentDidUpdate() {
        if (this.props.user.currentUser && this.props.user.currentUser.username && 
            this.initialLoaded == false) {

            this.props.actAbsenceGetMyApproving(this.props.user.currentUser.username)
            this.props.actAbsenceGetMine(this.props.user.currentUser.username)
            this.initialLoaded = true
        }

        if (this.props.user.currentUser && this.props.user.currentUser.username && 
                this.props.team.teams.length > 0 &&
                (!this.props.absence.selectedTeamID || this.props.absence.selectedTeamID == "")) {
            console.log("******     Fucking TRY DID UPDATE  ABSENCE PAGE.js:")
            var bestMatchTeam = getMatchTeamIDOfUser(this.props.team.teams,
                this.props.user.currentUser.username)
            if (bestMatchTeam) {
                this.props.actAbsenceHandleSelectTeam(bestMatchTeam)

                let curSelectedTeam;
                this.props.team.teams.forEach(element => {
                    if (element.id == bestMatchTeam) {
                        curSelectedTeam = element;
                    }
                })
                if (curSelectedTeam) {
                    this.props.actAbsenceGetOfMembers({members:curSelectedTeam.members, status:"APPROVED"})
                }
            }
            
        }
        
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
        this.props.team.teams.forEach(element => {
            if (element.id == v) {
                curSelectedTeam = element;
            }
        })

        this.props.actAbsenceHandleSelectTeam(v, null)

        this.props.actAbsenceGetOfMembers({members:curSelectedTeam.members, status:"APPROVED"})
        
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
        let myApprover = getMatchLeaderOfUser(this.props.team.teams, 
            (this.props.user && this.props.user.currentUser) ? this.props.user.currentUser.username : null);
        let request = {
            fromDate: this.state.fFromDate,
            fromPeriod: this.state.fFromPeriod,
            toDate: this.state.fToDate,
            toPeriod: this.state.fToPeriod,
            description: this.state.fDescription,
            username: this.props.currentUser.username,
            approver: myApprover
        };

        this.props.actRegisterNewAbsence(request);

        this.setState({
            isOpenModalAdd: false,
        })
        
    }
    handleDeleteAbsence(record) {
        console.log(record)
        this.props.actAbsenceDelete(record.id)
    }
    // -----------------------------Approving
    clickApproveAbsence(record, e) {
        e.preventDefault();
        console.log("APprove:" + record.id)
        this.props.actAbsenceUpdateStatus({id: record.id, status: "APPROVED", feedBack: ""},
            () => {
                console.log("CALL BACK OF APPROVe DONE")
                // We need to reload Team absences
                this.props.actAbsenceGetOfMembers({members:this.currentTeam.members, status:"APPROVED"})
            }
        )
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

        this.props.actAbsenceUpdateStatus({id: this.state.fRejectID, status: "REJECT", 
            feedBack: this.state.fRejectReason})
        
        this.setState({
            isOpenModalReject: false,
            fRejectID:""
        })
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
        let myApprover = getMatchLeaderOfUser(this.props.team.teams, 
            (this.props.user && this.props.user.currentUser) ? this.props.user.currentUser.username : null);
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
                    <span style={{fontWeight:"bold", color:"blue"}}>Approver: {myApprover} </span>
                </FormItem>  
            </Form>
        )
    }

    renderTeamsList() {
        const views = [];
        this.props.team.teams.forEach((item, idx) => {
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
            value={this.props.absence.selectedTeamID}
            >
            {views}
        </Select>
        );
    }

    renderMyApprovingAbsences() {
        let tblData = [];
        let columns = [];
        if (this.props.absence.myApprovingAbsences) {
            if (this.props.absence.myApprovingAbsences.length > 0) {
                // Filter the Date he if needed
                this.props.absence.myApprovingAbsences.forEach(element => {
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
                            <Button type="primary" size="small"
                                onClick={(e) => { this.clickApproveAbsence(record, e); }}>Accept</Button>
                        ),
                        width: 100,
                    },
                    {
                        title: 'Reject',
                        key: 'e',
                        render: (text, record) => (
                            <Button type="danger" size="small"
                            onClick={(e) => { this.clickRejectAbsence(record, e); }}>REJECT</Button>
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
        if (this.props.absence && this.props.absence.myAbsences) {
            if (this.props.absence.myAbsences.length > 0) {
                // Filter the Date he if needed
                this.props.absence.myAbsences.forEach(element => {
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
                    {
                        title: 'Action',
                        key: 'x',
                        render: (text, record) => {
                            if (record.status =="CONFIRMING") {
                                return {
                                children: 
                                    <Button type="danger" size="small"
                                        onClick={(e) => { this.handleDeleteAbsence(record, e); }}>Delete</Button>
                                }
                            } else {
                                return "";
                            }
                        },
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
    
    renderTeamAbsences() {
        let tblData = [];
        let columns = [];
        if (this.currentTeam) {
            if (this.currentTeam.members && this.currentTeam.members.length > 0) {
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
                var allAbsences = (this.props.absence && this.props.absence.absences)?this.props.absence.absences: [];
                for (var i = 0; i < this.currentTeam.members.length; i++) {
                    var element = this.currentTeam.members[i];
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
        if (this.props.team.teams.length > 0 && this.props.absence.selectedTeamID && 
                this.props.absence.selectedTeamID != "") {

            let curSelectedTeam;
            this.props.team.teams.forEach(element => {
                if (element.id == this.props.absence.selectedTeamID) {
                    curSelectedTeam = element;
                }
            })
            this.currentTeam = curSelectedTeam
        }
        

        var renderApproving = "";
        if (this.props.absence && this.props.absence.myApprovingAbsences && this.props.absence.myApprovingAbsences.length > 0) {
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

const mapStateToProps = (state) => ({
    user: state.user,
    team: state.team, // {teams, members}
    absence: state.absence
});
const mapActionsToProps = {
    actAbsenceGetOfMembers, actAbsenceGetMine,actAbsenceGetMyApproving,actRegisterNewAbsence,
    actTeamGet, actAbsenceUpdateStatus, actAbsenceDelete, actAbsenceHandleSelectTeam
};

export default withRouter(connect(mapStateToProps,mapActionsToProps)(AbsencePage));
