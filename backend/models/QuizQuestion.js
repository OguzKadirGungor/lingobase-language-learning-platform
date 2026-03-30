module.exports = (sequelize, DataTypes) => {
  const QuizQuestion = sequelize.define("QuizQuestion", {
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false, // örnek: ["A", "B", "C"]
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return QuizQuestion;
};