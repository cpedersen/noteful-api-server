const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config.js");

try {
  const db = knex({
    client: "pg",
    connection: DATABASE_URL,
  }).on("connection-error", (error) => {
    console.error(error);
    console.log("DB CONNECTION ERROR");
  });

  app.set("db", db);

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(error);
}
