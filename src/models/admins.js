"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admins.init(
    {
      admin_id: DataTypes.UUID,
      password_hash: DataTypes.STRING,
      email: DataTypes.STRING,
      recipient_email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Admins",
    }
  );
  return Admins;
};
