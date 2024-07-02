const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')
const date = require('date-and-time')

const Day = sequelize.define('Day', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        get: function(){
            return date.format(new Date(this.getDataValue('date')), 'DD-MM-YYYY')
        }
    },
    work_from: { type: DataTypes.TEXT },
    work_to: { type: DataTypes.TEXT },
    siesta_from: { type: DataTypes.TEXT },
    siesta_to: { type: DataTypes.TEXT },
    user_id: { type: DataTypes.INTEGER, allowNull: false }

}, {
    timestamps: false
})

module.exports = Day