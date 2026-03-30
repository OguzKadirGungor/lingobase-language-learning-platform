module.exports = (sequelize, DataTypes) => {
  const Badge = sequelize.define("Badge", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING, // isteğe bağlı (emoji, dosya yolu vs.)
      defaultValue: "🏅"
    }
  });

  return Badge;
};