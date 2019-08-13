import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  groupName: {
    type: String,
    required: true
  },
  members: [
    {
      username: {
        type: String,
        required: true
      },
      percent: {
        type: Number,
        required: true
      },
      role: {
        type: String, // "leader|member"
        required: true
      }
    }
  ]
});

export default mongoose.model("Team", TeamSchema);
