module.exports = (sequelize, DataTypes) => {
  const UserPoint = sequelize.define("UserPoint", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return UserPoint;
};