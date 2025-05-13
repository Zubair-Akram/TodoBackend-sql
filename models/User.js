import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // import the sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users", // Explicitly define the table name
    timestamps: true, // Automatically handles createdAt and updatedAt columns
  }
);

export default User;
