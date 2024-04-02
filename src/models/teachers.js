"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teachers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teachers.init(
    {
      teacher_id: DataTypes.UUID,
      is_password_changed: DataTypes.BOOLEAN,
      password_hash: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.ENUM("male", "female", "others"),
      course_of_study: DataTypes.STRING,
      is_deleted: DataTypes.BOOLEAN,
      staff_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Teachers",
    }
  );
  return Teachers;
};
