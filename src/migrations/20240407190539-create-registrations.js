"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Registrations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      registration_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      othernames: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["male", "female", "others"],
      },
      admission_status: {
        type: Sequelize.ENUM,
        values: ["admitted", "pending", "rejected"],
        defaultValue: "pending",
        allowNull: false,
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "JSS1",
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Registrations");
  },
};
