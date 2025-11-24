const {DataTypes} = require('sequelize')
const {sequelize} = require('../db')

const Organisation = require('./organisation')

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organisationId: {
        type: DataTypes.INTEGER,
        references: {model: 'organisations', key: 'id'},
        allowNull: false,
    },
    name: {type: DataTypes.STRING(50), allowNull: false},
    description: {type: DataTypes.TEXT},
},
{
    tableName: 'teams',
    timestamps: true,
    underscored: true
})

Team.belongsTo(Organisation, {foreignKey: 'organisationId'})

module.exports = Team