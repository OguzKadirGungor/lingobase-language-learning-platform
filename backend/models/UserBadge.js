module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define("UserBadge", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    badgeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    awardedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  });

  return UserBadge;
};