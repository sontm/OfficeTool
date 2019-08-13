import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const AbsenceSchema = new Schema({
  fromDate: {
    type: Date,
    required: true
  },
  fromPeriod: {
    type: String,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  toPeriod: {
    type: String,
    required: true
  },

  createdDate: {
    type: Date,
    required: false
  },
  confirmDate: {
    type: Date,
    required: false
  },

  description: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  status: {
    type: String, // CONFIRMING|APPROVED|REJECT
    required: true
  },
  feedBack: {
    type: String,
    required: false
  },
  approver: {
    type: String,
    required: false
  },
});

export default mongoose.model("Absence", AbsenceSchema);
