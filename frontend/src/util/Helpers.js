
export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + year;
}
  
export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug", 
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}  

// teams {
//   name,
//   id,
//   members [{
//     usename,
//     percent,
//     role // leader|member
//   }]
// }
export function getMatchTeamIDOfUser(teams, username) {
  var ret;

  // If found any Leader role, return Most Percent
  // Other wise, return team which is Member with Most Percent
  if (teams && username) {
      let curPercent = 0;
      teams.forEach(element => {
          if (element.members) {
              element.members.forEach(mem => {
                  if (mem.username == username) {
                      if (mem.role == "leader") {
                          // Return if is Leader
                          if (mem.percent + 1000 > curPercent) {
                              curPercent = mem.percent + 1000;
                              ret = element.id;
                          }
                      }
                      if (mem.percent > curPercent) {
                          curPercent = mem.percent;
                          ret = element.id;
                      }
                  }
              })
          }
      })
  }

  return ret;
}

// teams {
//   name,
//   id,
//   members [{
//     usename,
//     percent,
//     role // leader|member
//   }]
// }
export function getMatchLeaderOfUser(teams, username) {
    var ret;
    let userIsLeader = false;
    // If found any Leader role, return Most Percent
    // Other wise, return team which is Member with Most Percent
    var tempTeamAndLeader = {}; // {"natv": "hungdv"}
    if (teams && username) {
        let curPercent = 0;
        teams.forEach(element => {
            if (element.members) {
                element.members.forEach(mem => {
                    if (mem.role == "leader") {
                        tempTeamAndLeader[element.id] = mem.username;
                    }
                    if (mem.username == username) {
                        if (mem.role == "leader") {
                            // If ROle of requester is Leader, Assigned is GL
                            ret = "sontm";
                            userIsLeader = true;
                        } else 
                        if (mem.percent > curPercent) {
                            curPercent = mem.percent;
                            ret = element.id;
                        }
                    }
                })
            }
        })
    }

    if (userIsLeader) {
        // TODO, return Group Leader Here
        return "sontm";
    } else {
        // If is member, the Max Percent is the Assigned Leader
        return tempTeamAndLeader[""+ret];
    }
  }
