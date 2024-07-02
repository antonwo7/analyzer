const {roleNames} = require("../config");
const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')

const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, defaultValue: roleNames.user, allowNull: false, unique: true }
}, {
    timestamps: false
})

module.exports = Role