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
      models.Lessons.belongsTo(models.Subjects, { foreignKey: "subject_id" });
    }
  }
  Lessons.init(
    {
      lesson_id: DataTypes.UUID,
      title: DataTypes.STRING,
      subject_id: DataTypes.UUID,
      description: DataTypes.STRING,
      content: DataTypes.TEXT(15000),
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
