import Absence from "../../../server/models/Absence";
import { AuthenticationError } from "apollo-server-express";

export default {
  Query: {
    absence: async (parent, { username, status }, context, info) => {
        if (status) {
            console.log("Absence with status:" + status + " of username:" + username);
            return await Absence.find(
                { "username": username,
                    "status": status
                }).populate().exec();
        } else {
            // Query all
            console.log("Absence of username:" + username);
            //return await Absence.find({ "username": username }).populate().exec();
            const result = await Absence.find({ "username": username }).populate().exec();
            console.log(result)
            return result
        }
    },
    absenceApprove: async (parent, { approver, status }, context, info) => {
        if (status) {
            console.log("Absence Approving with status:" + status + " of approver:" + approver);
            return await Absence.find(
                { "approver": approver,
                    "status": status
                }).populate().exec();
        } else {
            // Query all CONFIRMING
            console.log("Absence Approving of approver:" + approver);
            //return await Absence.find({ "username": username }).populate().exec();
            const result = await Absence.find({ "approver": approver, "status": "CONFIRMING" }).populate().exec();
            console.log(result)
            return result
        }
    },
    absences: async (parent, args, context, info) => {
        // TODO, query only Absences from current Month
      const res = await Absence.find({})
        .populate()
        .exec();

      console.log("All Absences---");
      return res;
    }
  },
  Mutation: {
    createAbsence: async (parent, { request }, {user}, info) => {
    //   if (!user) {
    //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
    //   }

        console.log(" Create Absence Request")
        console.log(request)
      const newObj = await new Absence({
        // field in DB; "poll" is input
        fromDate: new Date(request.fromDate),
        fromPeriod: request.fromPeriod,
        toDate: new Date(request.toDate),
        toPeriod: request.toPeriod,
        description: request.description,
        username: request.username,
        status: "CONFIRMING",
        approver: request.approver
      });
      console.log(newObj)
      try {
        const result = await new Promise((resolve, reject) => {
         newObj.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        console.log ("-->>Absence created")
        console.log (result)

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    updateAbsenceStatus: async (parent, { request }, {user}, info) => {
    //   if (!user) {
    //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
    //   }

        console.log(" Update Absence Status")
        console.log(request)
        const newObj = await Absence.findOne(
            { 
                "_id": request.id
            }).populate().exec();
        
        console.log(newObj)

        newObj.status = request.status;
        newObj.feedBack = request.feedBack;
        try {
        const result = await new Promise((resolve, reject) => {
            newObj.save((err, res) => {
            err ? reject(err) : resolve(res);
            });
        });

        console.log ("-->>Absence Updated")
        console.log (result)

        return result;
        } catch (error) {
        console.log(error);
        throw error;
        }
    },
    deleteAbsence: async (parent, { id }, {user}, info) => {
      //   if (!user) {
      //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
      //   }
  
        console.log(" deleteAbsence*" + id)
        const newObj = await Absence.findOne(
            { 
                "_id": id
            }).populate().exec();
        
        console.log(newObj)
        try {
          const result = await new Promise((resolve, reject) => {
              newObj.remove((err, res) => {
                err ? reject(err) : resolve(res);
              });
          });

          console.log ("-->>Absence Updated")
          console.log (result)

          return result;
        } catch (error) {
        console.log(error);
        throw error;
        }
      }
  }
};

