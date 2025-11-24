const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')
const Employee = require('./employee')
const Organisation = require('./organisation')
const Team = require('./team')

const EmployeeTeam = sequelize.define('EmployeeTeam', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        references: {model: 'employees', key: 'id'},
        allowNull: false,
        onDelete:'CASCADE',
    },
    teamId: {
        type: DataTypes.INTEGER,
        references:{model: 'teams', key: 'id'},
        allowNull: false,
        onDelete: 'CASCADE',
    },
    assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'employee_teams',
    timestamps: false,
    underscored: true
})

EmployeeTeam.belongsTo(Employee, {foreignKey: 'employeeId'})
EmployeeTeam.belongsTo(Team, {foreignKey: 'teamId'})

module.exports = EmployeeTeam