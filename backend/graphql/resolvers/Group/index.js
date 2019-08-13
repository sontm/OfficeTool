import Group from "../../../server/models/Group";
import { AuthenticationError } from "apollo-server-express";
import { transformPoll } from "../merge";

export default {
  Query: {
    group: async (parent, { name }, context, info) => {
      return await Group.findOne({ "name": name }).exec();
    },
    groups: async (parent, args, context, info) => {
      const res = await Group.find({})
        .populate()
        .exec();

      console.log("All Groups---");
      return res;
    }
  },
  Mutation: {
    createGroup: async (parent, { request }, {user}, info) => {
    //   if (!user) {
    //     throw new AuthenticationError('[GROUP3] You are not authenticated!')
    //   }

      const newObj = await new Group({
        // field in DB; "poll" is input
        name: request.name,
        description: request.description
      });
      try {
        // const result = await newPoll.save();
        const result = await new Promise((resolve, reject) => {
         newObj.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        console.log ("-->>Group created")
        console.log (result)

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
};
