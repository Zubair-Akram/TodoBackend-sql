import { Sequelize } from "sequelize";

// Create Sequelize instance
const sequelize = new Sequelize("todo", "postgres", "malik123", {
  host: "localhost",
  dialect: "postgres",
});

// Connect function
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync all models to the database
    await sequelize.sync(); // Ensure tables are created (if they don't exist)
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connection, sequelize };
