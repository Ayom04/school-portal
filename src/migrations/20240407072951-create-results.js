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
      class_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Students",
          key: "student_id",
        },
      },
      subject_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Students",
          key: "student_id",
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
