import { getAllUser, getAllAbsence, registerNewAbsence, getAllAbsencesOfUser,
    getAllTeam, getAllMyApprovingAbsences, updateStatusAbsence, deleteAbsence} from '../../util/APIUtils';

export const ABSENCE_GET_ALLUSERS_OK = 'ABSENCE_GET_ALLUSERS_OK';
export const ABSENCE_GET_MINE_OK = 'ABSENCE_GET_MINE_OK';
export const ABSENCE_ADD_OK = 'ABSENCE_ADD_OK';
export const ABSENCE_DELETE_OK = 'ABSENCE_DELETE_OK';
export const ABSENCE_UPDATE_OK = 'ABSENCE_UPDATE_OK';
export const ABSENCE_GET_MYAPROVING_OK = 'ABSENCE_GET_MYAPROVING_OK';
export const ABSENCE_GET_ERR = 'ABSENCE_GET_ERR';
export const ABSENCE_SELECT_TEAM = 'ABSENCE_SELECT_TEAM'

export const actAbsenceGetOfMembers = (info) => (dispatch) => {

    var newAbsences = {};
    // Fetch all Absences of Member in Team
    // Only get Approved
    info.members.forEach((element, index) => {
        // Fetch all Absences of Member in Team
        // Only get Approved
        getAllAbsencesOfUser(element.username, "APPROVED")
        .then( response => {
            newAbsences["" + element.username] = [...response.data.absence];
            if (index == info.members.length-1) {
                dispatch({
                    type: ABSENCE_GET_ALLUSERS_OK,
                    payload:  newAbsences
                });
            }
        }).catch(err => {
            //console.log("All Absence Error")
            // console.log(err)
        });
    })
    
}

export const actAbsenceGetMine = (username) => (dispatch) => {
    getAllAbsencesOfUser(username)
    .then( response => {
        console.log("All My Absences:")
        console.log(response.data)

        dispatch({
            type: ABSENCE_GET_MINE_OK,
            payload:  response.data.absence
        });
    }).catch(err => {
        console.log("All Absence Error")
        console.log(err)
    });
}

export const actAbsenceGetMyApproving = (username) => (dispatch) => {
    getAllMyApprovingAbsences(username)
    .then( response => {
        console.log("All My Approving Absences:")
        console.log(response.data)

        dispatch({
            type: ABSENCE_GET_MYAPROVING_OK,
            payload:  response.data.absenceApprove
        });
    }).catch(err => {
        console.log("All My Approving Error")
        console.log(err)
    });
}

export const actRegisterNewAbsence = (info) => (dispatch) => {
    registerNewAbsence(info)
    .then( response => {
        console.log("Add Absence DONE")
        console.log(response.data)

        dispatch({
            type: ABSENCE_ADD_OK,
            payload:  response.data.createAbsence
        });
    }).catch(err => {
        console.log("All My Approving Error")
        console.log(err)
    });
}


export const actAbsenceUpdateStatus = (info, callBack) => (dispatch) => {
    updateStatusAbsence(info)
    .then( response => {
        console.log("Approve DONE")
        console.log(response.data.updateAbsenceStatus)
        dispatch({
            type: ABSENCE_UPDATE_OK,
            payload:  response.data.updateAbsenceStatus
        });

        if (callBack) {
            callBack();
        }
    }).catch(err => {
        console.log("Approve Error")
        console.log(err)
    });
    
}

export const actAbsenceDelete = (id) => (dispatch) => {
    deleteAbsence(id)
    .then( response => {
        console.log("DELETE DONE")
        console.log(response.data.deleteAbsence)
        dispatch({
            type: ABSENCE_DELETE_OK,
            payload:  response.data.deleteAbsence
        });
    }).catch(err => {
        console.log("Approve Error")
        console.log(err)
    });
    
}

export const actAbsenceHandleSelectTeam = (teamID, username) => (dispatch) => {
    dispatch({
        type: ABSENCE_SELECT_TEAM,
        payload: {teamID: teamID, username:username}
    });
}