-- Task 1: Insert new record
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Task 2: Modify Tony Stark's account_type
UPDATE account SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Task 3: Delete Tony Stark's record
DELETE FROM account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Task 4: Modify "GM Hummer" record
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Task 5: Inner join to select specific records
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';


-- Task 6: Update all records in the inventory table
UPDATE inventory
SET inv_image = CONCAT('/images/vehicles', SUBSTRING(inv_image FROM 9)),
    inv_thumbnail = CONCAT('/images/vehicles', SUBSTRING(inv_thumbnail FROM 9));