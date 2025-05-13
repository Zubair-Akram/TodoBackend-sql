import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load env variables from .env

// Create Sequelize instance using DATABASE_URL from .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Needed for Neon
    },
  },
});

// Connect function
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");

    // Sync all models to the database
    await sequelize.sync();
    console.log("✅ Database synced successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

export { connection, sequelize };
