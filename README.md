# News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Env files

In order to successfully connect to the two databases locally, you will need to create _two_ `.env` files for your project: `.env.test` and `.env.development` in the root directory. Add `PGDATABASE=<database_name_here>`, to both env files with the correct database name for that environment (`/db/setup.sql` contains the names of the databases).
