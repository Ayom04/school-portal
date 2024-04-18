"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
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
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "JSS1",
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_password_changed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      admission_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      photo_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["male", "female", "others"],
      },
      class_name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("Students");
  },
};
