import { mergeResolvers } from "merge-graphql-schemas";

import Poll from "./Poll/";
import User from "./User/";
import Group from "./Group/";
import Team from "./Team/";
import Absence from "./Absence/";

const resolvers = [Poll, User, Group, Team, Absence];

export default mergeResolvers(resolvers);
