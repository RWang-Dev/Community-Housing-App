CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    -- password_hash VARCHAR(255)
);

CREATE TABLE houses (
    house_id SERIAL PRIMARY KEY,
    house_name VARCHAR(50) NOT NULL,
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    house_id INTEGER REFERENCES houses(house_id),
    added_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_houses (
    user_id INT,
    house_id INT,
    PRIMARY KEY (user_id, house_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES houses(house_id) ON DELETE CASCADE
);

SELECT * FROM users;
SELECT * FROM houses;
SELECT * FROM tasks;
SELECT * FROM user_houses;

-- Example query for adding an entry to user_houses
INSERT INTO user_houses (user_id, house_id) VALUES (1, 33);
