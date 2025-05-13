// models/Note.js
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js"; // adjust path to your Sequelize instance
import User from "./User.js";

const Note = sequelize.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

export default Note;
