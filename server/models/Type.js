const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')
const File = require("../models/File")

const Type = sequelize.define('Type', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false
})

Type.hasMany(File, {foreignKey : 'id'});
File.belongsTo(Type, {foreignKey : 'type_id'})

module.exports = Type