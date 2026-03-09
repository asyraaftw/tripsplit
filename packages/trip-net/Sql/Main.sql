-- TBC
CREATE TABLE
    IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        base_currency TEXT NOT NULL,
        created_by INT REFERENCES users (id),
        start_date DATE,
        end_date DATE
    );

CREATE TABLE
    IF NOT EXISTS trip_members (
        trip_id INT REFERENCES trips (id),
        user_id INT REFERENCES users (id),
        PRIMARY KEY (trip_id, user_id)
    );

CREATE TABLE
    IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        trip_id INT REFERENCES trips (id),
        payer_id INT REFERENCES users (id),
        amount DECIMAL(18, 2),
        currency TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS expense_participants (
        expense_id INT REFERENCES expenses (id),
        user_id INT REFERENCES users (id),
        PRIMARY KEY (expense_id, user_id)
    );

-- END OF TBC
-- 
-- Flow as per 9/3/2026
CREATE TABLE
    IF NOT EXISTS group_trips (
        id SERIAL PRIMARY KEY,
        group_name TEXT NOT NULL,
        pax INT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        auth_key_hash TEXT NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS group_trip_members (
        id SERIAL PRIMARY KEY,
        group_trip_id INT REFERENCES group_trips (id) ON DELETE CASCADE,
        name TEXT NOT NULL
    );