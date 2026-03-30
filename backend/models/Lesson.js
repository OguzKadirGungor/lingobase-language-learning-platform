module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
      allowNull: false
    },
    goal: {
      type: DataTypes.ENUM('Genel', 'Seyahat', 'İş', 'Akademik'),
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    prerequisiteLessonId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: "Lessons",
    key: "id"
  }
},
 mainTopic: { 
      type: DataTypes.STRING,
      allowNull: true 
  }
  });

  return Lesson;
};