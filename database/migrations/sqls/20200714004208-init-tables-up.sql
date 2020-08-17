/* Replace with your SQL commands */
DROP TABLE IF EXISTS `users`,`listings`, `reviews`, `bookings`, `amenities`, `listing_images`, `listing_amenities`;
CREATE TABLE `users` (
    `id` VARCHAR(255),
    `email` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `password` VARCHAR(60),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `listings` (
    `id` VARCHAR(255),
    `user_id` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `name` VARCHAR(255),
    `description` TEXT,
    `property_type` VARCHAR(255),
    `room_type` VARCHAR(255),
    `address` VARCHAR(255),
    `latitude` DECIMAL(10,8),
    `longitude` DECIMAL(11,8),
    `bed_count` INT,
    `bathroom_count` INT,
    `max_guest` INT,
    `price_by_night` DECIMAL(10,2),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);
CREATE TABLE `bookings` (
    `id` VARCHAR(255),
    `start_date` DATE,
    `end_date` DATE,
    `is_approved` SMALLINT,
    `user_id` VARCHAR(255),
    `listing_id` VARCHAR(255),
    `listing_name` VARCHAR(255),
    `listing_address` VARCHAR(255),
    `price_per_day` DECIMAL(10,2),
    `price_for_stay` DECIMAL(15,2),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);
CREATE TABLE `reviews` (
    `id` VARCHAR(255),
    `user_id` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `listing_id` VARCHAR(255),
    `booking_id` VARCHAR(255),
    `rating_num` DECIMAL(2,1),
    `content` TEXT,
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `listing_images` (
    `id` VARCHAR(255),
    `listing_id` VARCHAR(255),
    `listing_file` VARCHAR(255),
    `uploaded_by` VARCHAR(255),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `rooms` (
    `id` VARCHAR(255),
    `user_id` VARCHAR(255),
    `chat_with` VARCHAR(255),
    `room_name` VARCHAR(255),
    `created_at` DATETIME,
    PRIMARY KEY(`id`, `user_id`)
);

CREATE TABLE `messages` (
    `id` VARCHAR(255),
    `room_id` VARCHAR(255),
    `type` VARCHAR(255),
    `content` TEXT,
    `sent_by` VARCHAR(255),
    `created_at` DATETIME,
    PRIMARY KEY(`id`)
);

INSERT INTO `users` (`id`,`email`, `first_name`, `last_name`, `password`,`created_at`, `updated_at`)
VALUES ("a","robwie@email.com","Robin","Wieruch","uSBPXAFrr9iIVUJ6zNjTmdG8eAFQOF8aUekpYTQgnzfPcS9uGsKFTvrHURjb",now(),now()), 
("b","dddd@email.com'","Dave Davids","Davidsssss","PBnLTSIQJuNFO2dcpdgP2NFRryno7MORUsrUb0aKQtmDc7utJnztgNTGoTuc",now(),now());

INSERT INTO `listings` (`id`,`user_id`,`first_name`,`last_name`,`name`, `description`, `property_type`, 
`room_type`, `address`,`latitude`,`longitude`,`bed_count`,`bathroom_count`,
`max_guest`, `price_by_night`,`created_at`, `updated_at`)
VALUES 
("a","a", "Robin", "Wieruch","Hello World","best place ever xoxo", "Bungalow","shared","166 FloorIT street",14.676041, 121.043701,3,1,5,1050,now(),now()),
("b","b","Dave Davids","Davidsssss","Bye World","worst place dont go here", "house","entire","32A Mahusay Street",35.86166000000001, 104.195397,0,0,1,9999.99,now(),now()),
("c","a","Dave Davids","Davidsssss","heyo world!","cool place for cool people", "hotel","shared","32B Magiting Street",35.86166000000001, 104.195397,4,5,2,10.99,now(),now()),
("d","b","Dave Davids","Davidsssss","world","xenoblade chronicles is good game", "apartment","shared","32B Magiting Street",35.86166000000001, 104.195397,2,4,3,3000.99,now(),now()),
("e","a","Robin", "Wieruch","is","melia best party member", "bnb","private","32B Magiting Street",35.86166000000001, 104.195397,1,1,4,2500.99,now(),now()),
("f","b","Dave Davids","Davidsssss","mine","pay off your loands", "bungalow","shared","32B Magiting Street",35.86166000000001, 104.195397,3,2,5,7500.99,now(),now()),
("g","a","Robin", "Wieruch","hatsune miku","blah blah", "botique_hotel","private","32B Magiting Street",35.86166000000001, 104.195397,5,3,3,9999.99,now(),now());

INSERT INTO `bookings` (`id`,`start_date`, `end_date`, `is_approved`, `user_id`, `listing_id`, `listing_name`, `listing_address`,
`price_per_day`, `price_for_stay`, `created_at`,`updated_at`)
VALUES 
    ("a","2020-02-02","2020-03-03", 0,"a","a","Hello World","166 FloorIT street", 200.00,3100.00,now(),now()),
    ("b","2020-03-03","2020-03-03", 1,"b","b","Bye World","32A Mahusay Street",250.00,3250.00,now(),now());

INSERT INTO `reviews` (
    `id`,
    `user_id`,
    `first_name`,
    `last_name`,
    `listing_id`,
    `booking_id`,
    `rating_num`,
    `content`,
    `created_at`,
    `updated_at`)
VALUES
    ("a","a","Robin", "Wieruch","a","a",4.0,"SO!!! AMAZING!!! I LOVE THIS PLACE",now(),now()),
    ("b","b","Dave Davids","Davidsssss","b","b",1,"SO HORRIBLE NEVER COMING HERE AGAIN!!1",now(),now()) ;

INSERT INTO `listing_images` (
    `id`,
	`listing_id`,
    `listing_file`,
    `uploaded_by`,
    `created_at`,
    `updated_at`)
VALUES ("a","a","https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", "1",now(),now());

CREATE PROCEDURE `get_user_rooms`(IN p_user_id VARCHAR(255))
BEGIN
    SELECT * FROM `rooms` WHERE `user_id` = p_user_id;
END ;

CREATE PROCEDURE `get_room_messages` (IN p_room_id VARCHAR(255))
BEGIN
    SELECT * FROM `messages` WHERE `room_id` = p_room_id
    ORDER BY `created_at`;

END;

CREATE PROCEDURE `create_room`(IN p_id VARCHAR(255), IN p_user_id VARCHAR(255),p_chat_with VARCHAR(255),IN p_room_name VARCHAR(255))
BEGIN
    INSERT INTO `rooms`(`id`,`user_id`, `chat_with`, `room_name`, `created_at`) VALUES (p_id,p_user_id, p_chat_with, p_room_name, now());
END;

CREATE PROCEDURE `create_message`(IN p_id VARCHAR(255), 
    IN p_room_id VARCHAR(255),
    IN p_sent_by VARCHAR(255), 
    IN p_content TEXT,
    IN p_type VARCHAR(255))
BEGIN
    INSERT INTO `messages`(`id`, `room_id`,`type`, `content`, `sent_by`, `created_at`)
    VALUES (p_id, p_room_id, p_type, p_content, p_sent_by, now());
END;

CREATE PROCEDURE `get_users`()
BEGIN
	SELECT `id`, `email`, `first_name`, `last_name` FROM `users`;
END ;

CREATE PROCEDURE `get_user`(IN p_user_id VARCHAR(255))
BEGIN
	SELECT * FROM `users` WHERE `id` = p_user_id;
END ;

CREATE PROCEDURE `get_user_bookings`(IN p_user_id VARCHAR(255))
BEGIN
    SELECT * FROM `bookings` WHERE `user_id` = p_user_id;
END ;

CREATE PROCEDURE `get_user_listing_bookings`(IN p_user_id VARCHAR(255), IN p_listing_id VARCHAR(255))
BEGIN
    SELECT * FROM `bookings` WHERE `user_id` = p_user_id
    AND `listing_id` = p_listing_id;
END ;

CREATE PROCEDURE `get_user_listings`(IN p_user_id VARCHAR(255))
BEGIN
    SELECT * FROM `listings` WHERE `user_id` = p_user_id;
END ;

CREATE PROCEDURE `get_listing_bookings`(IN p_listing_id VARCHAR(255))
BEGIN
    SELECT * FROM `bookings` WHERE `listing_id` = p_listing_id;
END ;

CREATE PROCEDURE `get_bookings`()
BEGIN
	SELECT * FROM `bookings`;
END;

CREATE PROCEDURE `get_booking`(IN p_booking_id VARCHAR(255))
BEGIN
	SELECT * FROM `bookings` WHERE `id` = p_booking_id;
END;

CREATE DEFINER=`root`@`%` PROCEDURE `get_listings`(
	IN p_latitude DECIMAL(10,8),
    IN p_longitude DECIMAL(11,8),
    IN p_min_bed INT,
	IN p_min_bathroom INT,
    IN p_room_type VARCHAR(20),
    IN p_property_type VARCHAR(20),
    IN sort_by VARCHAR (100),
    IN page_num INT)
BEGIN
	DECLARE ls_min_bathroom, ls_min_bed, ls_page_num INT;
    DECLARE ls_room_type,ls_property_type VARCHAR(255);
    DECLARE ls_latitude DECIMAL(10,8);
    DECLARE ls_longitude DECIMAL(11,8);
    SET ls_latitude = IFNULL(p_latitude,0);
    SET ls_longitude = IFNULL(p_longitude,0);
	SET ls_min_bed = IFNULL(p_min_bed,0);
	SET ls_min_bathroom = IFNULL(p_min_bathroom,0);
    SET ls_room_type = IFNULL(p_room_type,"");
    SET ls_property_type = IFNULL(p_property_type,"");
    SET ls_page_num = 10*(page_num-1);

	SELECT * FROM (SELECT *,  (SQRT(POW(69.1 * (latitude - ls_latitude), 2) +
    POW(69.1 * (ls_longitude - longitude) * COS(latitude / 57.3), 2))) AS distance
    FROM `listings` 

    ) e
    WHERE 
		e.bed_count >= ls_min_bed AND 
        e.bathroom_count >= ls_min_bathroom AND
        e.room_type LIKE CONCAT(ls_room_type,"%") AND
        e.property_type LIKE CONCAT(ls_property_type,"%") AND
        e.distance < 25
	ORDER BY 
		CASE WHEN sort_by='price_ascending' THEN e.price_by_night END,
		CASE WHEN sort_by='price_descending' THEN e.price_by_night END DESC,
        CASE WHEN sort_by='date_ascending' THEN e.created_at END,
        CASE WHEN sort_by='date_descending' THEN e.created_at END DESC
    LIMIT ls_page_num,10
    ;
END;

CREATE PROCEDURE `get_listing`(IN p_listing_id VARCHAR(255))
BEGIN
	SELECT * FROM `listings` WHERE `id` = p_listing_id;
END;

CREATE PROCEDURE `get_reviews`(IN p_listing_id VARCHAR(255))
BEGIN
	SELECT * FROM `reviews` WHERE `listing_id` = p_listing_id;
END;

CREATE PROCEDURE `get_review`(IN p_listing_id VARCHAR(255), IN p_review_id VARCHAR(255))
BEGIN
	SELECT * FROM `reviews` WHERE `id` = p_review_id AND `listing_id` = p_listing_id;
END;

CREATE PROCEDURE `get_listing_images`(IN p_listing_id VARCHAR(255))
BEGIN
	SELECT * FROM `listing_images` WHERE `listing_id` = p_listing_id;
END;

CREATE PROCEDURE `get_listing_image`(IN p_listing_id VARCHAR(255), IN p_listing_image_id VARCHAR(255))
BEGIN
	SELECT * FROM `listing_images` WHERE `id` = p_listing_image_id AND `listing_id` = p_listing_id;
END;

CREATE PROCEDURE `is_unique_email`(IN p_email VARCHAR(255))
BEGIN
	SELECT * FROM `users` WHERE `email` = p_email; 
END;

CREATE PROCEDURE `create_user`(IN p_id VARCHAR(255), IN p_email VARCHAR(255), IN p_first_name VARCHAR(255), 
								IN p_last_name VARCHAR(255), IN p_password VARCHAR(60))
BEGIN
	INSERT INTO `users` (`id`,`email`, `first_name`, `last_name`,`password`, `created_at`, `updated_at`)
    VALUES (p_id, p_email, p_first_name, p_last_name, p_password,now(),now());
END;

CREATE PROCEDURE `create_listing`(
    IN p_id VARCHAR(255),
    IN p_user_id VARCHAR(255),
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_description TEXT, 
    IN p_property_type VARCHAR(255), 
    IN p_room_type VARCHAR(255), 
    IN p_address VARCHAR(255), 
    IN p_latitude DECIMAL(10,8), 
    IN p_longitude DECIMAL(11,8), 
    IN p_bed_count INT, 
    IN p_bathroom_count INT,
    IN p_max_guest INT, 
    IN p_price_by_night DECIMAL(10,2))
BEGIN
	INSERT INTO `listings` (`id`,`user_id`,`first_name`, `last_name`, `name`, `description`, `property_type`, 
	`room_type`, `address`,`latitude`,`longitude`,`bed_count`,`bathroom_count`,
	`max_guest`, `price_by_night`,`created_at`, `updated_at`)
    VALUES (p_id,p_user_id, p_first_name, p_last_name, p_name,p_description, p_property_type, p_room_type,
    p_address, p_latitude, p_longitude, p_bed_count, p_bathroom_count, p_max_guest, 
    p_price_by_night,now(),now());
END;

CREATE PROCEDURE `create_booking`(
    IN p_id VARCHAR(255),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_is_approved SMALLINT,
    IN p_user_id VARCHAR(255),
    IN p_listing_id VARCHAR(255),
    IN p_listing_name VARCHAR(255),
    IN p_listing_address VARCHAR(255),
    IN p_price_per_day DECIMAL(10,2),
    IN p_price_for_stay DECIMAL(15,2))
BEGIN
	INSERT INTO `bookings` (`id`,`start_date`, `end_date`, `is_approved`, `user_id`,
    `listing_id`, `listing_name`, `listing_address`, `price_per_day`, `price_for_stay`, `created_at`,`updated_at`)
    VALUES (p_id, p_start_date,p_end_date,p_is_approved,p_user_id,
    p_listing_id, p_listing_name, p_listing_address, p_price_per_day,p_price_for_stay, now(), now());
END;

CREATE PROCEDURE `create_review`(
    IN p_id VARCHAR(255),
    IN p_user_id VARCHAR(255),
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_listing_id VARCHAR(255),
    IN p_booking_id VARCHAR(255),
    IN p_rating_num DECIMAL(2,1),
    IN p_content TEXT)
BEGIN
	INSERT INTO `reviews` (
    `id`,    
    `user_id`,
    `first_name`,
    `last_name`,
    `listing_id`,
    `booking_id`,
    `rating_num`,
    `content`,
    `created_at`,
    `updated_at`)
	VALUES(p_id, p_user_id, p_first_name, p_last_name, p_listing_id, p_booking_id, p_rating_num, 
    p_content, now(),now());
END;


CREATE PROCEDURE `create_listing_image`( 
    IN p_id VARCHAR(255),
    IN p_listing_id VARCHAR(255),
    IN p_listing_file VARCHAR(255),
    IN p_uploaded_by VARCHAR(255))
BEGIN
	INSERT INTO `listing_images` (
    `id`,
	`listing_id`,
    `listing_file`,
    `uploaded_by`,
    `created_at`,
    `updated_at`)
	VALUES (p_id,p_listing_id, p_listing_file, p_uploaded_by, now(),now()); 
END;

CREATE PROCEDURE `update_user`(IN p_user_id VARCHAR(255), 
IN p_email VARCHAR(255),
IN p_first_name VARCHAR(255), IN p_last_name VARCHAR(255))
BEGIN
	UPDATE `users`
    SET email = p_email, first_name = p_first_name, 
		`last_name` = p_last_name, updated_at = now()
    WHERE `id` = p_user_id;
END;

CREATE PROCEDURE `update_user_tables`(IN p_user_id VARCHAR(255),
IN p_first_name VARCHAR(255),
IN p_last_name VARCHAR(255))
BEGIN
    UPDATE `listings`
    SET `first_name` = p_first_name,
        `last_name` = p_last_name
    WHERE `user_id` = p_user_id;
    UPDATE `reviews`
    SET `first_name` = p_first_name,
    `last_name` = p_last_name
    WHERE `user_id` = p_user_id;
    UPDATE `rooms`
    SET `room_name` = CONCAT(p_first_name, " ",p_last_name)
    WHERE `chat_with` = p_user_id;
END ;
CREATE PROCEDURE `update_listing`(
	IN p_listing_id VARCHAR(255),
	IN p_user_id VARCHAR(255),
    IN p_name VARCHAR(255),
    IN p_description TEXT, 
    IN p_property_type VARCHAR(255), 
    IN p_room_type VARCHAR(255), 
    IN p_address VARCHAR(255), 
    IN p_latitude DECIMAL(10,8), 
    IN p_longitude DECIMAL(11,8), 
    IN p_bed_count INT, 
    IN p_bathroom_count INT,
    IN p_max_guest INT, 
    IN p_price_by_night DECIMAL(10,2))
BEGIN
	UPDATE `listings`
    SET `user_id` = p_user_id, 
    `name` = p_name, `description` = p_description,
    `property_type` = p_property_type,
    `room_type` = p_room_type,
    `address` = p_address,
    `latitude` = p_latitude,
    `longitude` = p_longitude,
    `bed_count` = p_bed_count,
    `bathroom_count` = p_bathroom_count,
    `max_guest` = p_max_guest,
    `price_by_night` = p_price_by_night,
    `updated_at` = now()
    WHERE `id` = p_listing_id;
END;

CREATE PROCEDURE `update_listing_tables`(
    IN p_listing_id VARCHAR(255),
    IN p_listing_name VARCHAR(255),
    IN p_listing_address VARCHAR(255)
)
BEGIN
    UPDATE `bookings`
    SET `listing_name` = p_listing_name,
    `listing_address` = p_listing_address
    WHERE `listing_id` = p_listing_id;
END ; 


CREATE DEFINER=`root`@`%` PROCEDURE `update_booking`(
	IN p_booking_id VARCHAR(255),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_is_approved SMALLINT,
    IN p_user_id VARCHAR(255),
    IN p_listing_id VARCHAR(255),
    IN p_price_per_day DECIMAL(10,2),
    IN p_price_for_stay DECIMAL(15,2))
BEGIN
	UPDATE `bookings`
    SET `start_date`= p_start_date,
    `end_date` = p_end_date,
    `is_approved` = p_is_approved,
    `user_id`= p_user_id,
    `listing_id` = p_listing_id,
    `price_per_day` = p_price_per_day,
    `price_for_stay`= p_price_for_stay,
    `updated_at` = now()
    WHERE `id` = p_booking_id;
END;

CREATE PROCEDURE `delete_listing_tables`(
    IN p_listing_id VARCHAR(255)
)
BEGIN
    DELETE FROM `bookings`
    WHERE `listing_id` = p_listing_id;
END;

CREATE PROCEDURE `delete_listing_image`(IN listing_image_id VARCHAR(255))
BEGIN
	DELETE FROM `listing_images` WHERE `id` = listing_image_id;
END;


CREATE PROCEDURE `delete_review`(IN p_review_id VARCHAR(255))
BEGIN
	DELETE FROM `reviews` WHERE `id` = p_review_id; 
END;

CREATE PROCEDURE `delete_booking`(IN p_booking_id VARCHAR(255))
BEGIN
	DELETE FROM `bookings` WHERE `id` = p_booking_id; 
END;

CREATE PROCEDURE `delete_listing`(IN p_listing_id VARCHAR(255))
BEGIN
	DELETE FROM `listings` WHERE `id` = p_listing_id; 
END;

CREATE PROCEDURE `delete_user`(IN p_user_id VARCHAR(255))
BEGIN
	DELETE FROM `users` WHERE `id` = p_user_id; 
END;