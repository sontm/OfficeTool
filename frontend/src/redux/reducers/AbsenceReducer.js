import {
    ABSENCE_GET_ALLUSERS_OK,ABSENCE_GET_MINE_OK,ABSENCE_GET_MYAPROVING_OK,ABSENCE_GET_ERR,
    ABSENCE_ADD_OK, ABSENCE_DELETE_OK, ABSENCE_UPDATE_OK
  } from '../actions/AbsenceActions'

const initialState = {
    absences: [],
    myAbsences: [],
    myApprovingAbsences: [],
    selectedTeamID: "",
};

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
        case ABSENCE_GET_MINE_OK:
            return {
                ...state,
                myAbsences: [...action.payload]
            };
        case ABSENCE_GET_ALLUSERS_OK:
            var newState = Object.assign({}, state);
            return {
                ...state,
                absences: action.payload
            };
        case ABSENCE_UPDATE_OK:
            // Update Array with new information
            let newInfoUpdated = action.payload;
            let newAbsencesUpdaed = [];
            state.myApprovingAbsences.forEach(element => {
                if (element.id == newInfoUpdated.id) {
                    // Not Push to List this Absence
                    //newAbsencesUpdaed.push(newInfoUpdated);
                } else {
                    newAbsencesUpdaed.push(element);
                }
            })
            console.log("newAbsencesUpdaed:")
            console.log(newAbsencesUpdaed)
            return {
                ...state,
                myApprovingAbsences: newAbsencesUpdaed
            };
        case ABSENCE_ADD_OK:
            // Add new ABsence into my Absence
            return {
                ...state,
                myAbsences: [action.payload, ...state.myAbsences]
            };
        case ABSENCE_DELETE_OK:
            // Add new ABsence into my Absence
            let newInfo1 = action.payload;
            let newAbsences1 = [];
            state.myAbsences.forEach(element => {
                if (element.id == newInfo1.id) {
                    // Not Push to List this Absence
                    //newAbsences.push(newInfo);
                } else {
                    newAbsences1.push(element);
                }
            })
            return {
                ...state,
                myAbsences: newAbsences1
            };
        case ABSENCE_GET_MYAPROVING_OK:
            return {
                ...state,
                myApprovingAbsences: [...action.payload]
            };
        default:
            return state;
    }
  }

  
