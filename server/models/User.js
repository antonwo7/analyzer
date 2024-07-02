const {DataTypes} = require('sequelize')
const {sequelize} = require('../services/BDService')
const File = require("../models/File")

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: [{ type: DataTypes.INTEGER, ref: 'Role' }],
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false
})

User.hasMany(File, {foreignKey : 'id'});
File.belongsTo(User, {foreignKey : 'user_id'})

module.exports = User