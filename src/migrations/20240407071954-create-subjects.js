"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      subject_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Classes",
          key: "class_name",
        },
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
    await queryInterface.dropTable("Subjects");
  },
};
