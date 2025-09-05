CREATE DATABASE IF NOT EXISTS energex_test
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'energex_user'@'localhost' IDENTIFIED BY 'EnergeX!Local123';
CREATE USER IF NOT EXISTS 'energex_user'@'127.0.0.1' IDENTIFIED BY 'EnergeX!Local123';

ALTER USER 'energex_user'@'localhost' IDENTIFIED BY 'EnergeX!Local123';
ALTER USER 'energex_user'@'127.0.0.1' IDENTIFIED BY 'EnergeX!Local123';

-- Grant privileges
GRANT ALL PRIVILEGES ON energex_test.* TO 'energex_user'@'localhost';
GRANT ALL PRIVILEGES ON energex_test.* TO 'energex_user'@'127.0.0.1';
FLUSH PRIVILEGES;

-- SANITY CHECKS
SELECT user, host, plugin FROM mysql.user WHERE user='energex_user';

ALTER USER 'energex_user'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'EnergeX!Local123';
  
ALTER USER 'energex_user'@'127.0.0.1'
  IDENTIFIED WITH caching_sha2_password BY 'EnergeX!Local123';

GRANT ALL PRIVILEGES ON energex_test.* TO 'energex_user'@'localhost';
GRANT ALL PRIVILEGES ON energex_test.* TO 'energex_user'@'127.0.0.1';
FLUSH PRIVILEGES;

SELECT user,host,plugin FROM mysql.user WHERE user='energex_user';
SHOW GRANTS FOR 'energex_user'@'127.0.0.1';

