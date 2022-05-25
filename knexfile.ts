import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: 'localhost',
      user: 'logixboard_be',
      password: 'password',
      database: 'logixboard_be'
    }
  },
};

module.exports = config;
