import React, { Component } from 'react';

import LoadingIndicator  from '../common/LoadingIndicator';
import { Modal, Button, Icon, Collapse, notification, Card, 
    Select, Form, Radio, InputNumber} from 'antd';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actTeamGet,actTeamGetMembers, actTeamAddMemberToTeam, actTeamHandleSelectTeam,
    actTeamDeleteMember } from '../redux/actions/TeamActions';

import './TeamPage.css';

import { Table, Divider, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;

function mGetSelectedTeam(teams, currentTeamID) {
    if (teams && teams.length > 0) {
        for (var i = 0; i < teams.length; i++) {
            let element = teams[i];
            if (element.id == currentTeamID) {
                return element;
            }
        }
    }
    return null;
}

function mHasRightToEditTeam(team, currentUser) {
    if (team && team.members && currentUser) {
        for (var i = 0; i < team.members.length; i++) {
            let element = team.members[i];
            if (element.username == currentUser.username) {
                if (element.role == "leader") {
                    return true;
                }
            }
        }
    }

    // Check if currentn user is admin
    if (currentUser.username == "admin") {
        // TODO, need to query in User table
        return true;
    }

    return false;
}
class TeamPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fMemberRole: "member",
            fSelectedMember:"",
            fPercent: 100,
            collapseActiveKey: 0,

            isOpenModalEdit: false,
            isOpenModalAdd:false
        };

        this.handleMemberRoleChange = this.handleMemberRoleChange.bind(this);
        this.handleSelectTeamChange = this.handleSelectTeamChange.bind(this);
        this.handleSelectMemberChange = this.handleSelectMemberChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handlePercentChange = this.handlePercentChange.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.handleEditMember = this.handleEditMember.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this)
        this.handleOKEdit = this.handleOKEdit.bind(this)

        this.handleAddMemberOpen = this.handleAddMemberOpen.bind(this)
        this.handleCancelAddMember = this.handleCancelAddMember.bind(this)

        this.hasRightToEditTeam = false;
    }

    componentDidMount() {
        console.log("****** DID MOUNT TEAMPAGE.js")
        if (this.props.team.teams.length <= 0 ) {
            console.log("  ****** Will actTeamGet")
            this.props.actTeamGet();
        }
        if (this.props.team.members.length <= 0) {
            this.props.actTeamGetMembers();  
        }
    }
    componentDidUpdate() {
        if (this.props.user.currentUser && this.props.user.currentUser.username && 
                (!this.props.team.selectedTeamID || this.props.team.selectedTeamID == "")) {
            this.props.actTeamHandleSelectTeam(null, this.props.user.currentUser.username)
        }
    }

    handleMemberRoleChange(e) {
        this.setState({
            fMemberRole: e.target.value,
        });
    }
    handleSelectTeamChange(v) {
        console.log("Select team:" + v)
        this.props.actTeamHandleSelectTeam(v, null)
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

    handleOKEdit(e) {
        this.props.actTeamAddMemberToTeam({
            fSelectedTeam: this.props.team.selectedTeamID,
            fSelectedMember: this.state.fSelectedMember,
            fPercent: this.state.fPercent,
            fMemberRole: this.state.fMemberRole
        })
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
        console.log("Remove member:" + record.username + " from:" + this.props.team.selectedTeamID)
        this.props.actTeamDeleteMember({
            fSelectedTeam: this.props.team.selectedTeamID,
            username: record.username
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.actTeamAddMemberToTeam({
            fSelectedTeam: this.props.team.selectedTeamID,
            fSelectedMember: this.state.fSelectedMember,
            fPercent: this.state.fPercent,
            fMemberRole: this.state.fMemberRole
        })
        this.setState({
            isOpenModalAdd: false
        })
    }
    
    renderAddMember() {
        const members = this.renderMemberList();
        const roles = this.renderMemberRole();

        let currentSelectedTeam = mGetSelectedTeam(this.props.team.teams, this.props.team.selectedTeamID);
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
                        { (currentSelectedTeam && currentSelectedTeam.name) ? 
                        currentSelectedTeam.name : "NA"}
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
        if (this.props.team && this.props.team.teams) {
            const views = [];
            this.props.team.teams.forEach((item, idx) => {
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
                value={this.props.team.selectedTeamID}
                >
                {views}
            </Select>
            );
        }
    }

    renderMemberList() {
        if (this.props.team && this.props.team.members) {
            const views = [];
            this.props.team.members.forEach((item, idx) => {
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
    }

    renderMemberRole() {
        return (
        <Radio.Group onChange={this.handleMemberRoleChange} value={this.state.fMemberRole}>
            <Radio value={"member"}>Member</Radio>
            <Radio value={"leader"}>Leader</Radio>
        </Radio.Group>
        );
    }

    render() {
        console.log("Team Page Rendering")

        const teams = this.renderTeamsList();

        let tblData = [];
        let columns = [];
        let currentSelectTeam = mGetSelectedTeam(this.props.team.teams, this.props.team.selectedTeamID);
        if (currentSelectTeam && this.props.user) {
            this.hasRightToEditTeam = mHasRightToEditTeam(currentSelectTeam, this.props.user.currentUser);
            console.log(":::: Right*" + this.hasRightToEditTeam + "," + currentSelectTeam.name)
        }
        if (currentSelectTeam) {

            console.log(currentSelectTeam.members)
            if (currentSelectTeam.members && currentSelectTeam.members.length > 0) {
                tblData = currentSelectTeam.members;

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
                        width: 200,
                    },
                    {
                        title: 'Role',
                        dataIndex: 'role',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.role.localeCompare(b.role),
                        sortDirections: ['descend', 'ascend'],
                    }];
                var optional =[
                    {
                        title: 'Delete',
                        key: 'x',
                        render: (text, record) => (
                            <Button type="danger" size="small"
                                    onClick={(e) => { this.handleRemoveMember(record, e); }}>Delete</Button>
                        ),
                        width: 100,
                    },
                    {
                        title: 'Edit',
                        key: 'e',
                        render: (text, record) => (
                            <Button type="primary" size="small"
                                        onClick={(e) => { this.handleEditMember(record, e); }}>Edit</Button>
                        ),
                        width: 100 ,
                    },
                ];
                if (this.hasRightToEditTeam) {
                    columns.push(...optional)
                }
            }
        }

        var btnAddMember;
        if (currentSelectTeam && this.hasRightToEditTeam) {
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
}

const mapStateToProps = (state) => ({
    user: state.user,
    team: state.team, // {teams, members}
});
const mapActionsToProps = {
    actTeamGet,
    actTeamGetMembers,
    actTeamAddMemberToTeam,
    actTeamHandleSelectTeam,
    actTeamDeleteMember
};

export default withRouter(connect(mapStateToProps,mapActionsToProps)(TeamPage));

