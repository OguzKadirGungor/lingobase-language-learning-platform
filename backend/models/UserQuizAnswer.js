module.exports = (sequelize, DataTypes) => {
  const UserQuizAnswer = sequelize.define("UserQuizAnswer", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quizQuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });

  return UserQuizAnswer;
};