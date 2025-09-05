INSERT INTO users(name,email,password,created_at,updated_at)
VALUES ('Testy','seed@example.com','$2y$12$fakeBcryptHashHere',NOW(),NOW())
ON DUPLICATE KEY UPDATE updated_at=NOW();

INSERT INTO posts(title,content,user_id,created_at,updated_at)
VALUES ('Hello','From Docker SQL seed',1,NOW(),NOW())
ON DUPLICATE KEY UPDATE updated_at=NOW();

