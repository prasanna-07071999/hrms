"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      // Organisation ID
      organisationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "organisation_id",
      },

      // User ID
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "user_id",
      },

      // Action like "POST /api/auth/login"
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Event like "REQUEST HANDLED", "EMPLOYEE_CREATED"
      event: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },

      // HTTP status code
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 200,
      },

      // IP Address
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "0.0.0.0",
      },

      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("logs");
  },
};
