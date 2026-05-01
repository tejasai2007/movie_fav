-- PostgreSQL schema for Movie Favorites App
-- Run once to set up the table after creating the database in Azure.

CREATE TABLE IF NOT EXISTS users (
    id       SERIAL PRIMARY KEY,        -- SERIAL = PostgreSQL's auto-increment
    username VARCHAR(100) NOT NULL,
    movie    VARCHAR(200) NOT NULL
);
