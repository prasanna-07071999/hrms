const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");
const Organisation = require("./organisation");
const User = require("./user");

const Log = sequelize.define(
    "Log",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        organisationId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "organisations", key: "id" },
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
        },

        action: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        event: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },

        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "logs",
        timestamps: true,
        underscored: true,
    }
);


Log.belongsTo(Organisation, { foreignKey: "organisationId" });
Log.belongsTo(User, { foreignKey: "userId" });

module.exports = Log;