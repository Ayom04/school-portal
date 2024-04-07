"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lessons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lessons.init(
    {
      lesson_id: DataTypes.UUID,
      title: DataTypes.STRING,
      class_id: DataTypes.UUID,
      subject_id: DataTypes.UUID,
      text_content: DataTypes.STRING,
      video_url: DataTypes.STRING,
      audio_url: DataTypes.STRING,
      term: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lessons",
    }
  );
  return Lessons;
};
