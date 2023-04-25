
CREATE TYPE user_role AS ENUM ('user', 'admin');


CREATE TYPE is_subscribed AS ENUM ('subscribed', 'Not-Subscribed');


CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        userid VARCHAR,
        firstname VARCHAR,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        roles user_role DEFAULT 'user',
        status is_subscribed DEFAULT 'Not-Subscribed',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    DROP TABLE users

