import Poll from "../../../server/models/Poll";
import User from "../../../server/models/User";
import { AuthenticationError } from "apollo-server-express";
import { transformPoll } from "../merge";

export default {
  Query: {
    poll: async (parent, { id }, context, info) => {
      return await Poll.findOne({ "_id": id }).exec();
    },
    polls: async (parent, args, context, info) => {
      const res = await Poll.find({})
        .populate()
        .exec();

      // const relatedChoices = await new Choice({
      //     question: poll.question
      //   });
      console.log("All Polls---");
      //console.log(res)
      // return res.map(u => ({
      //   id: u.id.toString(),
      //   question: u.question,
      //   choices: u.choices,
      //   createdBy: u.createdBy
      // }));
      return res;
    }
  },
  Mutation: {
    createPoll: async (parent, { poll }, {user}, info) => {
      if (!user) {
        throw new AuthenticationError('[GROUP3] You are not authenticated!')
      }
      // This will call Constructor of POLL below ?
      const newPoll = await new Poll({
        // field in DB; "poll" is input
        question: poll.question
      });
      let createdPoll;
      try {
        // const result = await newPoll.save();
        const result = await new Promise((resolve, reject) => {
         newPoll.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        createdPoll = transformPoll(result);
        console.log ("-->>createPoll created")
        console.log (createdPoll)
        console.log ("<<--createPoll created")

        return createdPoll;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createFullPoll: async (parent, { pollWithChoices }, {user}, info) => {
      if (!user) {
        throw new AuthenticationError('[GROUP3] You are not authenticated to create Full Poll!')
      }
      console.log(">>creteFullPoll with Request");
      console.log(pollWithChoices)
      console.log("<<creteFullPoll with Request");
      var createdDate = new Date()
      var expireDate = new Date(createdDate)
      expireDate.setHours(expireDate.getHours()+pollWithChoices.inHour);
      expireDate.setDate(expireDate.getDate()+pollWithChoices.inDay);
      expireDate.setMinutes(expireDate.getMinutes()+pollWithChoices.inMinute);
      
      console.log(" CreatedDate:" + createdDate, "," + expireDate)
      // This will call Constructor of POLL below ?
      const newPoll = await new Poll({
        // field in DB; "poll" is input
        question: pollWithChoices.question,
        choices: pollWithChoices.choices,
        createdBy: pollWithChoices.createdBy,
        createdDate: createdDate,
        expireDate: expireDate
      });
      let createdPoll;
      try {
        // const result = await newPoll.save();
        const result = await new Promise((resolve, reject) => {
         newPoll.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        createdPoll = transformPoll(result);
        console.log ("-->>createPoll created")
        console.log (createdPoll)
        console.log ("<<--createPoll created")

        return createdPoll;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createVote: async (parent, { vote }, {user}, info) => {
      if (!user) {
        throw new AuthenticationError('[GROUP3] You are not authenticated to create vote!')
      }
      console.log ("createVote called")
      try {
        // Find Poll by ID
        const ofPoll = await Poll.findById({"_id": vote.poll});
      
        console.log (">>Found Poll of Vote:choiceID:" + vote.choice)
        // FIrst, remove all Vote by that User 
        ofPoll.choices.forEach(function (item, index) {
          // Loop In REVERSE order and remove by slice
          if (item.votes) {
            for (var i=item.votes.length-1; i>=0; i--) {
                if (item.votes[i].username == vote.username) {
                  item.votes.splice(i, 1);
                }
            }
          }
        });

        // Then Re-add vote
        ofPoll.choices.forEach(function (item, index) {
          if (item && item.id == vote.choice) {
            item.votes.push({username: vote.username});
          }
        });
        console.log(ofPoll)
        console.log ("<< Found Poll of Vote:")
        

        const result = await new Promise((resolve, reject) => {
          ofPoll.save((err, res) => {
            err ? reject(err) : resolve(res);
          });
        });

        //console.log (">>>> Result of saved Poll:")
        //console.log(result);
       // console.log(transformPoll(result));
        //console.log ("<<<< Result of saved Poll:")

        return (result);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
  // ,
  // Poll: {
  //   choices: async ({ id, question }, args, context, info) => {
  //     return await Choice.find({poll: id});
  //   }
  // }
  // ,
  // Choice: {
  //   poll: async ({ poll }, args, context, info) => {
  //     console.log("[DBG] new Choice with poll ID:" + poll)
  //     return await Poll.findById({ id: poll });
  //   }
  // }
};
