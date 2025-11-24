const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')
const Organisation = require('./organisation')


const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organisationId:{
        type: DataTypes.INTEGER,
        references:{model:'organisations', key: 'id'},
        allowNull: false
    },
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    passwordHash: {type: DataTypes.STRING, allowNull:false},
    name: {type: DataTypes.STRING, allowNull: false},
    isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false}
},
{
    tableName: 'users',
    timestamps: true,
    underscored: true
})

User.belongsTo(Organisation, {foreignKey:'organisationId'})

module.exports = User