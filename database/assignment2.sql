-- Query 1: INSERT created and successfully tested in pgAdmin
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: UPDATE tested successfully in pgAdmin (I could have used the email, but I think the ID is the most precise and correct option)
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Query 3: DELETE tested successfully in pgAdmin
DELETE FROM account
WHERE account_id = 1;

-- Query 4: I replaced only "small interiors" with "a huge interior" as required. 
-- I did not adjust the surrounding "the" because it is outside the exact phrase the assignment asked me to modify.
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: INNER JOIN for Sport vehicles, successfully tested in pgAdmin.
-- I joined inventory with classification and filtered by 'Sport' to return the two Sport records required by the assignment.
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';