import { getAllUser, getAllTeam, addMemberToTeam, deleteMemberFromTeam } from '../../util/APIUtils';

import { Layout, notification, Menu } from 'antd';
import { ACCESS_TOKEN } from '../../constants';

export const TEAM_GET_OK = 'TEAM_GET_OK';
export const TEAM_GET_MEMBERS_OK = 'TEAM_GET_MEMBERS_OK';
export const TEAM_ADD_MEMBER_OK = 'TEAM_ADD_MEMBER_OK';
export const TEAM_DEL_MEMBER_OK = 'TEAM_DEL_MEMBER_OK';
export const TEAM_EDIT_MEMBER_OK = 'TEAM_EDIT_MEMBER_OK';

export const TEAM_SELECT_TEAM = 'TEAM_SELECT_TEAM';

export const TEAM_GET_ERR = 'TEAM_GET_ERR';

export const actTeamGet = () => (dispatch) => {
    getAllTeam()
    .then( response => {
        console.log("Get All Teams")
        console.log(response)
        dispatch({
            type: TEAM_GET_OK,
            payload:  response.data.teams
        });
    })
    .catch(error => {
        console.log("Get All Teams error")
    }); 
}

export const actTeamGetMembers = () => (dispatch) => {
    getAllUser()
    .then( response => {
        console.log("Get All Members")
        console.log(response.data)
        dispatch({
            type: TEAM_GET_MEMBERS_OK,
            payload: response.data.users
        });
    })
    .catch(error => {
        console.log("Get All Teams error")
    }); 
}

export const actTeamAddMemberToTeam = (info) => (dispatch) => {
    addMemberToTeam(info.fSelectedTeam, info.fSelectedMember,
        info.fPercent, info.fMemberRole)
    .then( response => {
        console.log("Edit member DONE")
        console.log(response.data.addMemberToTeam)
        dispatch({
            type: TEAM_ADD_MEMBER_OK,
            payload: response.data.addMemberToTeam
        });
    }).catch(err => {
        console.log("Add member Error")
        console.log(err)
    });
}

export const actTeamDeleteMember = (info) => (dispatch) => {
    deleteMemberFromTeam(info.fSelectedTeam, info.username)
    .then( response => {
        console.log("Delete member DONE")
        console.log(response.data.deleteMemberFromTeam)

        dispatch({
            type: TEAM_DEL_MEMBER_OK,
            payload: response.data.deleteMemberFromTeam
        });
    }).catch(err => {
        console.log("Add member Error")
        console.log(err)
    });
}

export const actTeamHandleSelectTeam = (teamID, username) => (dispatch) => {
    dispatch({
        type: TEAM_SELECT_TEAM,
        payload: {teamID: teamID, username:username}
    });
}
