"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Results extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Results.init(
    {
      result_id: DataTypes.UUID,
      student_id: DataTypes.UUID,
      class_id: DataTypes.UUID,
      subject_id: DataTypes.UUID,
      examination_score: DataTypes.DOUBLE(10, 2),
      test_score: DataTypes.DOUBLE(10, 2),
      assessment_score: DataTypes.DOUBLE(10, 2),
      term: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Results",
    }
  );
  return Results;
};
