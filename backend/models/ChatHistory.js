// models/ChatHistory.js
module.exports = (sequelize, DataTypes) => {
  const ChatHistory = sequelize.define("ChatHistory", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.ENUM("user", "bot"),
      allowNull: false,
    },
  });

  return ChatHistory;
};