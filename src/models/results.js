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
      models.Results.belongsTo(models.Students, {
        foreignKey: "student_id",
      });
      models.Results.belongsTo(models.Lessons, {
        foreignKey: "lesson_id",
      });
    }
  }
  Results.init(
    {
      result_id: DataTypes.UUID,
      student_id: DataTypes.UUID,
      lesson_id: DataTypes.UUID,
      assessment_url: DataTypes.STRING,
      is_assessment_reviewed: DataTypes.BOOLEAN,
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
