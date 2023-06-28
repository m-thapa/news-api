# News API

## Background

NC news is a RESTful API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

PostgresSQL relational database was used in this project.

## Env files

In order to successfully connect to the two databases locally, you will need to create _two_ `.env` files for your project: `.env.test` and `.env.development` in the root directory. Add `PGDATABASE=<database_name_here>`, to both env files with the correct database name for that environment (`/db/setup.sql` contains the names of the databases).

Before running the application, ensure that you have the following dependencies installed:

    Node.js (version 2.1.1)
    PostgreSQL (version X.X.X)

Installation

    Clone the repository to your local machine and install the required dependencies in the root using:

    ```
    npm install

    ```
