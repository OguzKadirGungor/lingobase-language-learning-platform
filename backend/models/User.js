module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        //unique: true, geçici olarak kaldırıldı, ileride tekrar eklenebilir
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      goal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
}
    });
  
    return User;
  };