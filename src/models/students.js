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
      surname: DataTypes.STRING,
      othernames: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
      is_deleted: DataTypes.BOOLEAN,
      date_of_birth: DataTypes.DATE,
      class: DataTypes.STRING,
      photo_url: DataTypes.STRING,
      admission_number: DataTypes.STRING,
      class: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
