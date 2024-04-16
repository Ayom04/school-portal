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
      models.Subjects.hasMany(models.Lessons, {
        foreignKey: "subject_id",
      });
      models.Subjects.belongsTo(models.Classes, {
        foreignKey: "class_name",
      });
    }
  }
  Subjects.init(
    {
      subject_id: DataTypes.UUID,
      subject_name: DataTypes.STRING,
      class_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Subjects",
    }
  );
  return Subjects;
};
