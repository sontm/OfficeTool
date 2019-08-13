import React, { Component } from 'react';
import { getAllUser, getAllTeam, addMemberToTeam, deleteMemberFromTeam } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Modal, Button, Icon, Collapse, notification, Card, 
    Select, Form, Radio, InputNumber} from 'antd';
import { withRouter } from 'react-router-dom';
import './TeamPage.css';

import {getMatchTeamIDOfUser} from '../util/Helpers'

import { Table, Divider, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;
class TeamPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            members: [],
            currentTeam:null,
            fMemberRole: "member",
            fSelectedTeam: "",
            fSelectedMember:"",
            fPercent: 100,
            collapseActiveKey: 0,

            isOpenModalEdit: false,
            isOpenModalAdd:false
        };
        this.fetchTeams = this.fetchTeams.bind(this);
        this.fetchMembers = this.fetchMembers.bind(this);
        this.handleMemberRoleChange = this.handleMemberRoleChange.bind(this);
        this.handleSelectTeamChange = this.handleSelectTeamChange.bind(this);
        this.handleSelectMemberChange = this.handleSelectMemberChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCollapseOpen = this.handleCollapseOpen.bind(this)
        this.handlePercentChange = this.handlePercentChange.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.handleEditMember = this.handleEditMember.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this)
        this.handleOKEdit = this.handleOKEdit.bind(this)

        this.handleAddMemberOpen = this.handleAddMemberOpen.bind(this)
        this.handleCancelAddMember = this.handleCancelAddMember.bind(this)
    }
    fetchTeams() {
        getAllTeam()
        .then( response => {
            console.log("Get All Teams")
            console.log(response)

            var bestMatchTeam = getMatchTeamIDOfUser(response.data.teams,
                this.props.currentUser.username)


            if (bestMatchTeam) {
                this.setState({
                    teams: response.data.teams,
                    fSelectedTeam: bestMatchTeam
                });
                this.handleSelectTeamChange(bestMatchTeam);
            } else {
                this.setState({
                    teams: response.data.teams,
                });
            }

        })
        .catch(error => {
            console.log("Get All Teams error")
        }); 
    }
    fetchMembers() {
        getAllUser()
        .then( response => {
            console.log("Get All Users")
            console.log(response)
            this.setState({
                members: response.data.users
            });
        })
        .catch(error => {
            console.log("Get All Uses error")
        });  
    }
    
    componentDidMount() {
        this.fetchTeams()
        this.fetchMembers()
    }

    handleMemberRoleChange(e) {
        this.setState({
            fMemberRole: e.target.value,
        });
    }
    handleSelectTeamChange(v) {
        console.log("Select team:" + v)
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
    }
    handleSelectMemberChange(v) {
        console.log("Select member:" + v)
        this.setState({
            fSelectedMember: v,
        });
    }
    handlePercentChange(v) {
        this.setState({
            fPercent: v,
        });
    }
    handleCollapseOpen(key) {
        this.setState({
            collapseActiveKey: key
        })
    }
    handleOKEdit(e) {
        // Server processing
        addMemberToTeam(this.state.fSelectedTeam, this.state.fSelectedMember,
            this.state.fPercent, this.state.fMemberRole)
        .then( response => {
            console.log("Edit member DONE")
            console.log(response.data.addMemberToTeam)

            // Update Array of Team with new information
            let newTeamInfo = response.data.addMemberToTeam;
            let newTeams = [];
            this.state.teams.forEach(element => {
                if (element.id == newTeamInfo.id) {
                    newTeams.push(newTeamInfo);
                } else {
                    newTeams.push(element);
                }
            })

            this.setState({
                fMemberRole: "member",
                fSelectedMember:"",
                fPercent: 100,
                currentTeam: newTeamInfo,
                teams: newTeams
                //collapseActiveKey: 0
            })

        }).catch(err => {
            console.log("Add member Error")
            console.log(err)
        });
        
        this.setState({
            isOpenModalEdit: false
        })
    }
    handleCancelEdit(e) {
        this.setState({
            isOpenModalEdit: false,
            fSelectedMember: "",
            fPercent: 100,
            fMemberRole: "member"
        })
    }

    handleCancelAddMember(e) {
        this.setState({
            isOpenModalAdd: false,
            fSelectedMember: "",
            fPercent: 100,
            fMemberRole: "member"
        })
    }
    handleAddMemberOpen(e) {
        e.preventDefault()
        this.setState({
            isOpenModalAdd: true,
            fSelectedMember: "",
            fPercent: 100,
            fMemberRole: "member"
        })
    }
    handleEditMember(record, e) {
        e.preventDefault();
        this.setState({
            isOpenModalEdit: true,
            fSelectedMember: record.username,
            fPercent: record.percent,
            fMemberRole: record.role
        })
    }
    handleRemoveMember(record, e) {
        e.preventDefault();
        console.log("Remove member:" + record.username + " from:" + this.state.fSelectedTeam)
        deleteMemberFromTeam(this.state.fSelectedTeam, record.username)
        .then( response => {
            console.log("Delete member DONE")
            console.log(response.data.deleteMemberFromTeam)

            // Update Array of Team with new information
            let newTeamInfo = response.data.deleteMemberFromTeam;
            let newTeams = [];
            this.state.teams.forEach(element => {
                if (element.id == newTeamInfo.id) {
                    newTeams.push(newTeamInfo);
                } else {
                    newTeams.push(element);
                }
            })

            this.setState({
                fMemberRole: "member",
                fSelectedMember:"",
                fPercent: 100,
                currentTeam: newTeamInfo,
                teams: newTeams
                //collapseActiveKey: 0
            })

        }).catch(err => {
            console.log("Add member Error")
            console.log(err)
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        addMemberToTeam(this.state.fSelectedTeam, this.state.fSelectedMember,
            this.state.fPercent, this.state.fMemberRole)
        .then( response => {
            console.log("Add member DONE")
            console.log(response.data.addMemberToTeam)

            // Update Array of Team with new information
            let newTeamInfo = response.data.addMemberToTeam;
            let newTeams = [];
            this.state.teams.forEach(element => {
                if (element.id == newTeamInfo.id) {
                    newTeams.push(newTeamInfo);
                } else {
                    newTeams.push(element);
                }
            })

            this.setState({
                fMemberRole: "member",
                fSelectedMember:"",
                fPercent: 100,
                currentTeam: newTeamInfo,
                teams: newTeams,
                isOpenModalAdd: false,
                //collapseActiveKey: 0
            })

        }).catch(err => {
            console.log("Add member Error")
            console.log(err)
        });
    }
    render() {
        console.log("Rendering")

        const teams = this.renderTeamsList();

        let tblData = [];
        let columns = [];
        if (this.state.currentTeam) {
            console.log(this.state.currentTeam.members)
            if (this.state.currentTeam.members && this.state.currentTeam.members.length > 0) {
                tblData = this.state.currentTeam.members;

                columns = [
                    {
                        title: 'UserName',
                        dataIndex: 'username',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.username.localeCompare(b.username),
                        sortDirections: ['descend', 'ascend'],
                        width: 200,
                    },
                    {
                        title: 'Percent',
                        dataIndex: 'percent',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.percent - b.percent,
                        sortDirections: ['descend', 'ascend'],
                        width: 150,
                    },
                    {
                        title: 'Role',
                        dataIndex: 'role',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.role.localeCompare(b.role),
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: 'Delete',
                        key: 'x',
                        render: (text, record) => (
                            <span
                                className="action-delete"
                                onClick={(e) => { this.handleRemoveMember(record, e); }}>
                              Delete
                            </span>
                        ),
                        width: 100,
                    },
                    {
                        title: 'Edit',
                        key: 'e',
                        render: (text, record) => (
                            <span
                                className="action-delete"
                                onClick={(e) => { this.handleEditMember(record, e); }}>
                              Edit
                            </span>
                        ),
                        width: 100,
                    },
                ];
            }
        }

        var btnAddMember;
        if (this.state.currentTeam) {
            btnAddMember = 
                <Button type="primary" 
                    size="medium" onClick={this.handleAddMemberOpen}>
                Add Member
                </Button>;
        }
        return (
            <React.Fragment>
                <Card title="Team" extra={teams}>

                {btnAddMember}
                <br/>
                <Table dataSource={tblData} pagination={false} size={"medium"}
                    columns={columns} rowKey="username" scroll={{y: 400 }}/>
                </Card>

                <Modal
                        title="Edit Member"
                        visible={this.state.isOpenModalEdit}
                        onOk={this.handleOKEdit}
                        onCancel={this.handleCancelEdit}
                        >
                    {this.renderEditMember()}
                </Modal>

                <Modal
                        title="Add New Member"
                        visible={this.state.isOpenModalAdd}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancelAddMember}
                        >
                    {this.renderAddMember()}
                </Modal>
            </React.Fragment>
        )
    }
    renderAddMember() {
        const members = this.renderMemberList();
        const roles = this.renderMemberRole();
        return(
            <Form layout={"horizontal"}  className="addmember-container">
                <FormItem >
                {members}
                </FormItem>

                <FormItem label="Role:">
                    {roles}
                </FormItem>
                <FormItem label="Percent:">
                    <InputNumber min={1} max={100} value={this.state.fPercent}
                    defaultValue={100} onChange={this.handlePercentChange} />
                </FormItem>
                <FormItem>
                    To Team: 
                    <span style={{fontWeight:"bold"}}>
                        { (this.state.currentTeam && this.state.currentTeam.name) ? 
                        this.state.currentTeam.name : "NA"}
                                </span>
                </FormItem>
            </Form>
        )
    }
    renderEditMember() {
        const roles = this.renderMemberRole();
        return (
            <Form layout={"horizontal"} className="addmember-container">
                <FormItem >
                {this.state.fSelectedMember}
                </FormItem>

                <FormItem label="Role:">
                    {roles}
                </FormItem>
                <FormItem label="Percent:">
                    <InputNumber min={1} max={100} value={this.state.fPercent}
                    defaultValue={100} onChange={this.handlePercentChange} />
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
        <Select style={{width: "300px"}}
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

    renderMemberList() {
        const views = [];
        this.state.members.forEach((item, idx) => {
            views.push(
            <Option key={item.id} value={item.username}>
                {item.username}
            </Option>)            
        });
        return (
        <Select
            showSearch
            style={{width: "150px"}}
            onChange={this.handleSelectMemberChange}
            optionFilterProp="children"
            placeholder="Select Member"
            value={this.state.fSelectedMember}
            >
            {views}
        </Select>
        );
    }

    renderMemberRole() {
        return (
        <Radio.Group onChange={this.handleMemberRoleChange} value={this.state.fMemberRole}>
            <Radio value={"member"}>Member</Radio>
            <Radio value={"leader"}>Leader</Radio>
        </Radio.Group>
        );
    }
}

export default withRouter(TeamPage);
