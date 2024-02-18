import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _categories from  "./categories.js";
import _forum_threads from  "./forum_threads.js";
import _posts from  "./posts.js";
import _refresh_sessions from  "./refresh_sessions.js";
import _topics from  "./topics.js";
import _users from  "./users.js";

export default function initModels(sequelize) {
  const categories = _categories.init(sequelize, DataTypes);
  const forum_threads = _forum_threads.init(sequelize, DataTypes);
  const posts = _posts.init(sequelize, DataTypes);
  const refresh_sessions = _refresh_sessions.init(sequelize, DataTypes);
  const topics = _topics.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);

  topics.belongsTo(forum_threads, { as: "thread", foreignKey: "threadId"});
  forum_threads.hasMany(topics, { as: "topics", foreignKey: "threadId"});
  posts.belongsTo(topics, { as: "topic", foreignKey: "topicId"});
  topics.hasMany(posts, { as: "posts", foreignKey: "topicId"});
  posts.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(posts, { as: "posts", foreignKey: "userId"});
  refresh_sessions.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(refresh_sessions, { as: "refresh_sessions", foreignKey: "userId"});
  topics.belongsTo(users, { as: "lastUserPost", foreignKey: "lastUserPostId"});
  users.hasMany(topics, { as: "topics", foreignKey: "lastUserPostId"});
  topics.belongsTo(users, { as: "topicStarter", foreignKey: "topicStarterId"});
  users.hasMany(topics, { as: "topicStarter_topics", foreignKey: "topicStarterId"});

  return {
    categories,
    forum_threads,
    posts,
    refresh_sessions,
    topics,
    users,
  };
}
