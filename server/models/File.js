const date = require('date-and-time')
const {Sequelize} = require('sequelize')
const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')

const File = sequelize.define('File', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    type_id: [{ type: DataTypes.INTEGER, allowNull: false }],
    status: [{ type: DataTypes.INTEGER, allowNull: false }],
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        get: function() {
            return this.getDataValue('date')
                ? date.format(this.getDataValue('date'), 'DD-MM-YYYY HH:mm')
                : null
        },
        set () {
            this.setDataValue('date', new Date())
        }
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: false
})

module.exports = File