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
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
      is_deleted: DataTypes.BOOLEAN,
      admission_number: DataTypes.STRING,
      admission_status: DataTypes.ENUM("pending", "approved", "rejected"),
      admission_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
