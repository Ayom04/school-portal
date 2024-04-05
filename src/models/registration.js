"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Registration.init(
    {
      registration_id: DataTypes.UUID,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
      admission_status: DataTypes.ENUM("admitted", "pending", "rejected"),
      dob: DataTypes.DATE,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Registration",
    }
  );
  return Registration;
};
