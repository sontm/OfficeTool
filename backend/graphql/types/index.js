import { mergeTypes } from "merge-graphql-schemas";

import Poll from "./Poll/";
import User from "./User/";
import Group from "./Group/";
import Team from "./Team/";
import Absence from "./Absence/";

const typeDefs = [Poll, User, Group, Team, Absence];

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
export default mergeTypes(typeDefs, { all: true });
