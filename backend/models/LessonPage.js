module.exports = (sequelize, DataTypes) => {
    const LessonPage = sequelize.define("LessonPage", {
      lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pageNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // örn: "text", "fill", "mcq", "listen"
        allowNull: false,
      },
      content: {
        type: DataTypes.JSON, // etkinliğin içeriği JSON olarak saklanır
        allowNull: false,
      }
    });
  
    return LessonPage;
  };