const { Sequelize } = require('sequelize');

// Initialize Sequelize for SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data.sqlite', // Path to SQLite database file
});

(async () => {
  try {
      await sequelize.sync({ force: false }); // Use `force: true` to recreate the table
      console.log("Database synced and table created!");
  } catch (error) {
      console.error("Error syncing database:", error);
  }
})();

module.exports = sequelize; // Export the Sequelize instance
