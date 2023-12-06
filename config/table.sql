CREATE TABLE IF NOT EXISTS days (
    ID SERIAL PRIMARY KEY,
    day VARCHAR(10) NOT NULL
);
CREATE TABLE waiters(
    ID SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL
);
CREATE TABLE days_available(
    ID SERIAL PRIMARY KEY,
    day_available INT,
    waiter_id INT,
    FOREIGN KEY (waiter_id) REFERENCES waiters(ID) ON DELETE CASCADE,
    FOREIGN KEY (day_available) REFERENCES days(ID) ON DELETE CASCADE
);


INSERT INTO days (day) VALUES 
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');