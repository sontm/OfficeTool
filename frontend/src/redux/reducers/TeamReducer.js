import {
    TEAM_GET_OK,TEAM_GET_ERR,TEAM_ADD_MEMBER_OK,TEAM_GET_MEMBERS_OK,
    TEAM_DEL_MEMBER_OK, TEAM_EDIT_MEMBER_OK, TEAM_SELECT_TEAM
  } from '../actions/TeamActions'
import {getMatchTeamIDOfUser} from '../../util/Helpers'

const initialState = {
    teams: [],
    members: [],
    selectedTeamID: "",
};

// Note, in this Reducer, cannot Access state.user
export default function(state = initialState, action) {
    switch (action.type) {
        case TEAM_GET_OK:
            return {
                ...state,
                teams: action.payload
            };
        case TEAM_GET_ERR:
            return {
                ...state,
                teams: []
            };
        case TEAM_GET_MEMBERS_OK:
            //action.payload is members
            return {
                ...state,
                members: action.payload
            };
        case TEAM_ADD_MEMBER_OK:
            // Update Array of Team with new information
            let newTeamInfo = action.payload;
            let newTeams = [];
            state.teams.forEach(element => {
                if (element.id == newTeamInfo.id) {
                    newTeams.push(newTeamInfo);
                } else {
                    newTeams.push(element);
                }
            })
            //let newState = Object.assign({}, ...state);
            let newState = {
                ...state,
                teams: newTeams
            };
            return newState;
        case TEAM_DEL_MEMBER_OK:
            // Update Array of Team with new information
            let newTeamInfo1 = action.payload;
            let newTeams1 = [];
            state.teams.forEach(element => {
                if (element.id == newTeamInfo1.id) {
                    newTeams1.push(newTeamInfo1);
                } else {
                    newTeams1.push(element);
                }
            })
            //let newState = Object.assign({}, ...state);
            return {
                ...state,
                teams: newTeams1
            };
        case TEAM_SELECT_TEAM:
            // If curent selected team ID is null, Recomment Best Match team
            if (action.payload.teamID) {
                return {
                    ...state,
                    selectedTeamID: action.payload.teamID
                };
            } else {
                var bestMatchTeam = getMatchTeamIDOfUser(state.teams,
                    action.payload.username)
                if (bestMatchTeam) {
                    return {
                        ...state,
                        selectedTeamID: bestMatchTeam
                    };
                } else  {
                    return {
                        ...state
                    };
                }

            }
            
        default:
            return state;
    }
  }

  
