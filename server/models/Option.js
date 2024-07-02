const date = require('date-and-time')
const {Sequelize} = require('sequelize')
const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')

const Option = sequelize.define('Option', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    title: [{ type: DataTypes.STRING, allowNull: false }],
    value: [{ type: DataTypes.STRING, allowNull: false }]
}, {
    timestamps: false
})

module.exports = Option