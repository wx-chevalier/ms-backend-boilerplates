INSERT INTO authority(name) VALUES("ROLE_ADMIN");
INSERT INTO user(id, name) VALUES(UUID(), "admin");
INSERT INTO user_authority(user_id, authority_name)
  SELECT id AS user_id, "ROLE_ADMIN" FROM user WHERE name="admin";
  
INSERT INTO authority(name) VALUES("ROLE_CLIENT");
INSERT INTO user(id, name) VALUES(UUID(), "client");
INSERT INTO user_authority(user_id, authority_name)
  SELECT id AS user_id, "ROLE_CLIENT" FROM user WHERE name="client";
