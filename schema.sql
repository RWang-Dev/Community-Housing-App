CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50),
    password VARCHAR(50),
);

CREATE TABLE houses (
    house_id SERIAL PRIMARY KEY,
    house_name VARCHAR(50) NOT NULL,
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(ID),
    house_id INTEGER REFERENCES houses(house_id),
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);