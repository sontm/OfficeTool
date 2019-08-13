import Team from "../../../server/models/Team";
import { AuthenticationError } from "apollo-server-express";

export default {
  Query: {
    team: async (parent, { id }, context, info) => {
      return await Team.findOne({ id }).exec();
    },
    team: async (parent, { name }, context, info) => {
        return await Team.findOne({ "name": name }).exec();
      },
    teams: async (parent, args, context, info) => {
      const res = await Team.find({})
        .populate()
        .exec();

      console.log("All Teams---");
      return res;
    }
  },
  Mutation: {
    createTeam: async (parent, { request }, {user}, info) => {
    //   if (!user) {
    //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
    //   }

      const newObj = await new Team({
        // field in DB; "poll" is input
        name: request.name,
        groupName: request.groupName,
        description: request.description
      });

      try {
        // const result = await newPoll.save();
        const result = await new Promise((resolve, reject) => {
        newObj.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        console.log ("-->>Team created")
        console.log (result)

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    addMemberToTeam: async (parent, { request }, {user}, info) => {
    //   if (!user) {
    //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
    //   }

        const team = await Team.findOne({ "_id": request.teamID }).exec();
        try {
            if (team && team.members) {
                // Check if Member Exist, we will change percent and role
                let isExist = false;

                team.members.forEach(element => {
                    if (element.username == request.username) {
                        // Exist, change percent and role
                        element.percent = request.percent;
                        element.role = request.role;
                        isExist = true;
                    }
                });
                // If member not exist, add new 
                if (isExist == false) {
                    team.members.push({
                        username: request.username,
                        percent: request.percent,
                        role: request.role
                    });
                }
            }
            console.log ("-->>Add Member To Team Params:")
            console.log(team)
            const result = await new Promise((resolve, reject) => {
                team.save((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });

            console.log ("-->>Add Member To Team done")
            console.log (result)

            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    deleteMemberFromTeam: async (parent, { request }, {user}, info) => {
        //   if (!user) {
        //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
        //   }
    
        const team = await Team.findOne({ "_id": request.teamID }).exec();
        try {
            if (team && team.members) {
                // Delete member
                for (var i=team.members.length-1; i>=0; i--) {
                    if (team.members[i].username == request.username) {
                        team.members.splice(i, 1);
                    }
                }
            }
            console.log ("-->>Deleted Member To Team Params:")
            console.log(team)
            const result = await new Promise((resolve, reject) => {
                team.save((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });

            console.log ("-->>Delete Member From Team done")
            console.log (result)

            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
  }
};

