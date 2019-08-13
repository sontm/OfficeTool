import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const UserSchema = new Schema({
  ldapID: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // password: {
  //   type: String,
  //   required: true
  // },
  // passwordBcrypt: {
  //   type: String,
  //   required: true
  // },
  mail: {
    type: String,
    required: false
  },
  fullname: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false
  }
});

export default mongoose.model("User", UserSchema);
