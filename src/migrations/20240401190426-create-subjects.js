"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Subjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subject_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      class: {
        type: Sequelize.ENUM,
        values: ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"],
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
