module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define("Quiz", {
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    goal: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Quiz;
};