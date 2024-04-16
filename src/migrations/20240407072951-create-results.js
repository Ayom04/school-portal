"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Results", {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      result_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Students",
          key: "student_id",
        },
      },
      lesson_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Lessons",
          key: "lesson_id",
        },
      },
      examination_score: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: true,
      },
      test_score: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: true,
      },
      assessment_score: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: true,
      },
      assessment_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_assessment_reviewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      term: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Results");
  },
};
