"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Registrations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Registrations.init(
    {
      registration_id: DataTypes.UUID,
      surname: DataTypes.STRING,
      othernames: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
      admission_status: DataTypes.ENUM("admitted", "pending", "rejected"),
      date_of_birth: DataTypes.DATE,
      phone: DataTypes.STRING,
      photo_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Registrations",
    }
  );
  return Registrations;
};
