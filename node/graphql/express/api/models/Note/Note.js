const Sequelize = require('sequelize');

const sequelize = require('../../../config/database');

const tableName = 'notes';

const Note = sequelize.define('Note', {
  note: {
    type: Sequelize.STRING,
  },
}, { tableName });

module.exports = Note;
