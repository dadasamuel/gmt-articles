CREATE TABLE IF NOT EXISTS
comment
(
        id SERIAL PRIMARY KEY,
        post_comment VARCHAR(500) NOT NULL,
        userid INTEGER REFERENCES users(id) 
    );


    DROP TABLE comment;