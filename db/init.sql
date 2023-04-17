CREATE DATABASE dboids_db;

USE dboids_db;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON dboids_db.messages TO 'dboids'@'%';

#UPDATE user SET plugin='mysql_native_password' WHERE User='dboids';

ALTER USER 'dboids'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dboids';
FLUSH PRIVILEGES;

#ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dboids';
FLUSH PRIVILEGES;