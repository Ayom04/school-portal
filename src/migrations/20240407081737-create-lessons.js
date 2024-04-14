"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      lesson_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      subject_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Subjects",
          key: "subject_id",
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING(10000),
        allowNull: false,
      },
      text_content: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audio_url: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Lessons");
  },
};
