const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dil_egitim_uygulamasi', 'root', '10711453', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;