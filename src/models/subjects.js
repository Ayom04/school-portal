"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subjects.init(
    {
      subject_id: DataTypes.UUID,
      subject_name: DataTypes.STRING,
      class: DataTypes.ENUM("JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"),
      term: DataTypes.ENUM("1st", "2nd", "3rd"),
    },
    {
      sequelize,
      modelName: "Subjects",
    }
  );
  return Subjects;
};
