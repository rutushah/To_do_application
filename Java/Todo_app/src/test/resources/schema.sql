CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100)
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(200) NOT NULL,
  status_id INT NOT NULL REFERENCES status(id),
  user_id INT NOT NULL REFERENCES users(id),
  category_id INT NOT NULL REFERENCES category(id),
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO status(status_name, display_name) VALUES
('ready_to_pick', 'Ready to Pick'),
('in_progress', 'In Progress'),
('blocked', 'Blocked'),
('completed', 'Completed'),
('deleted', 'Deleted');

INSERT INTO category (category_name, display_name) VALUES
('work', 'Work'),
('leisure', 'Leisure');
