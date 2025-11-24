const {DataTypes} =  require('sequelize')
const {sequelize} = require('../db')
const Organisation = require('./organisation')

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organisationId: {
        type: DataTypes.INTEGER,
        references: {model: 'organisations', key: 'id'},
        allowNull: false
    },
    firstName: {type: DataTypes.STRING(50), allowNull: false },
    lastName: {type: DataTypes.STRING(50), allowNull: false },
    email: {type: DataTypes.STRING(50), unique: true, allowNull: false },
    phone:{type: DataTypes.STRING(50)}
},
{
    tableName: 'employees',
    timestamps: true, 
    underscored: true
})

Employee.belongsTo(Organisation, {foreignKey: 'organisationId'})

module.exports = Employee