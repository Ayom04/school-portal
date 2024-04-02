"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Students.init(
    {
      student_id: DataTypes.UUID,
      is_password_changed: DataTypes.BOOLEAN,
      password_hash: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
