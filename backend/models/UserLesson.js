module.exports = (sequelize, DataTypes) => {
    const UserLesson = sequelize.define("UserLesson", {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      progress: {
        type: DataTypes.FLOAT, // Örnek: %40 için 0.4
        defaultValue: 0,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      startedAt: {
        type: DataTypes.DATE,
      },
      completedAt: {
        type: DataTypes.DATE,
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
      },
    });
  
    return UserLesson;
  };