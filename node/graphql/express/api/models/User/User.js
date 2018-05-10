const Sequelize = require('sequelize');
const bcryptSevice = require('../../services/bcrypt.service');

const sequelize = require('../../../config/database');
const Note = require('../Note/Note');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptSevice().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

User.hasMany(Note, { as: 'notes', foreignKey: 'userId' });

module.exports = User;
