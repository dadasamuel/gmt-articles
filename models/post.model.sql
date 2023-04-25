CREATE TABLE
    IF NOT EXISTS post(
        id SERIAL PRIMARY KEY,
        post_title VARCHAR(255) NOT NULL,
        post_body VARCHAR NOT NULL,
        attachment VARCHAR,
        userid INTEGER REFERENCES users(id) ,
        commentid INTEGER REFERENCES comment(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    DROP TABLE post;