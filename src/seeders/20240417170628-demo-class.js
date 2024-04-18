"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Classes",
      [
        {
          class_id: uuidv4(),
          class_name: "JSS1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          class_id: uuidv4(),
          class_name: "JSS2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          class_id: uuidv4(),
          class_name: "JSS3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          class_id: uuidv4(),
          class_name: "SSS1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          class_id: uuidv4(),
          class_name: "SSS2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          class_id: uuidv4(),
          class_name: "SSS3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
