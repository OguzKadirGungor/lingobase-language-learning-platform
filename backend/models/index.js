const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelleri buraya ekle
db.User = require("./User")(sequelize, DataTypes);
db.ChatHistory = require("./ChatHistory")(sequelize, DataTypes);
db.Lesson = require("./Lesson")(sequelize, DataTypes);
db.UserLesson = require("./UserLesson")(sequelize, DataTypes);
db.LessonPage = require("./LessonPage")(sequelize, DataTypes);
db.Quiz = require("./Quiz")(sequelize, DataTypes);
db.QuizQuestion = require("./QuizQuestion")(sequelize, DataTypes);
db.UserQuizResult = require("./UserQuizResult")(sequelize, DataTypes);
db.UserQuizAnswer = require("./UserQuizAnswer")(sequelize, DataTypes);
db.UserPoint = require("./UserPoint")(sequelize, DataTypes);
db.Badge = require("./Badge")(sequelize, DataTypes);
db.UserBadge = require("./UserBadge")(sequelize, DataTypes);

// İlişkilendirme
db.User.hasMany(db.ChatHistory, { foreignKey: "userId" });
db.ChatHistory.belongsTo(db.User, { foreignKey: "userId" });

// User <-> UserLesson
db.User.hasMany(db.UserLesson, { foreignKey: "userId" });
db.UserLesson.belongsTo(db.User, { foreignKey: "userId" });

// Lesson <-> UserLesson
db.Lesson.hasMany(db.UserLesson, { foreignKey: "lessonId" });
db.UserLesson.belongsTo(db.Lesson, { foreignKey: "lessonId" });

db.Lesson.hasMany(db.LessonPage, { foreignKey: "lessonId" });
db.LessonPage.belongsTo(db.Lesson, { foreignKey: "lessonId" });

db.Lesson.hasOne(db.Quiz, { foreignKey: "lessonId" });
db.Quiz.belongsTo(db.Lesson, { foreignKey: "lessonId" });

db.Quiz.hasMany(db.QuizQuestion, { foreignKey: "quizId" });
db.QuizQuestion.belongsTo(db.Quiz, { foreignKey: "quizId" });

db.User.hasMany(db.UserQuizResult, { foreignKey: "userId" });
db.Quiz.hasMany(db.UserQuizResult, { foreignKey: "quizId" });

db.User.hasMany(db.UserQuizAnswer, { foreignKey: "userId" });
db.Quiz.hasMany(db.UserQuizAnswer, { foreignKey: "quizId" });
db.QuizQuestion.hasMany(db.UserQuizAnswer, { foreignKey: "quizQuestionId" });

db.User.hasMany(db.UserPoint, { foreignKey: "userId" });
db.UserPoint.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.UserBadge, { foreignKey: "userId" });
db.UserBadge.belongsTo(db.User, { foreignKey: "userId" });

db.Badge.hasMany(db.UserBadge, { foreignKey: "badgeId" });
db.UserBadge.belongsTo(db.Badge, { foreignKey: "badgeId" });

db.UserQuizAnswer.belongsTo(db.QuizQuestion, { foreignKey: "quizQuestionId" });
db.QuizQuestion.hasMany(db.UserQuizAnswer, { foreignKey: "quizQuestionId" });

// Quiz <-> UserQuizResult
db.UserQuizResult.belongsTo(db.Quiz, { foreignKey: "quizId" });
db.Quiz.hasMany(db.UserQuizResult, { foreignKey: "quizId" });



console.log('isModel:', db.Lesson instanceof db.Sequelize.Model);
module.exports = db;