import { mergeResolvers } from "merge-graphql-schemas";

import Poll from "./Poll/";
import User from "./User/";
import Group from "./Group/";
import Team from "./Team/";

const resolvers = [Poll, User, Group, Team];

export default mergeResolvers(resolvers);
