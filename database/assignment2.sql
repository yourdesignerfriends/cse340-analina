-- Query 1: INSERT created and successfully tested in pgAdmin
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Query 2: UPDATE tested successfully in pgAdmin (I could have used the email, but I think the ID is the most precise and correct option)
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;