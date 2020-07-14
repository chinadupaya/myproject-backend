/* Replace with your SQL commands */
DROP TABLE IF EXISTS `users`,`listings`, `reviews`, `bookings`, `amenities`, `listing_images`, `listing_amenities`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT,
    `email` VARCHAR(255),
    `first_name` VARCHAR(20),
    `last_name` VARCHAR(20),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `listings` (
    `id` INT AUTO_INCREMENT,
    `user_id` INT,
    `name` VARCHAR(255),
    `description` TEXT,
    `property_type` VARCHAR(20),
    `room_type` VARCHAR(20),
    `address` VARCHAR(255),
    `latitude` DECIMAL(10,8),
    `longitude` DECIMAL(11,8),
    `bed_count` INT,
    `bathroom_count` INT,
    `max_guest` INT,
    `price_by_night` DECIMAL(10,2),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);
CREATE TABLE `bookings` (
    `id` INT AUTO_INCREMENT,
    `start_date` DATE,
    `end_date` DATE,
    `is_approved` SMALLINT,
    `user_id` INT,
    `listing_id` INT,
    `price_per_day` DECIMAL(10,2),
    `price_for_stay` DECIMAL(15,2),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY(`listing_id`) REFERENCES `listings`(`id`)
);
CREATE TABLE `reviews` (
    `id` INT AUTO_INCREMENT,
    `user_id` INT,
    `listing_id` INT,
    `booking_id` INT,
    `rating_num` DECIMAL(2,1),
    `content` TEXT,
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY(`listing_id`) REFERENCES `listings`(`id`),
    FOREIGN KEY(`booking_id`) REFERENCES `bookings`(`id`)
);
CREATE TABLE `amenities` (
    `id` INT AUTO_INCREMENT,
    `name` VARCHAR(255),
    `amenity_file` VARCHAR(255),
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`)
);

CREATE TABLE `listing_images` (
    `id` INT AUTO_INCREMENT,
    `listing_id` INT,
    `listing_file` VARCHAR(255),
    `uploaded_by` INT,
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`listing_id`) REFERENCES `listings`(`id`),
    FOREIGN KEY(`uploaded_by`) REFERENCES `users`(`id`)
);

CREATE TABLE `listing_amenities` (
    `id` INT AUTO_INCREMENT,
    `listing_id` INT,
    `amenity_id` INT,
    `created_at` DATETIME,
    `updated_at` DATETIME,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`listing_id`) REFERENCES `listings`(`id`),
    FOREIGN KEY(`amenity_id`) REFERENCES `amenities`(`id`)
); 

INSERT INTO `users` (`email`, `first_name`, `last_name`, `created_at`, `updated_at`)
VALUES ("robwie@email.com","Robin","Wieruch",now(),now()), 
("dddd@email.com'","Dave Davids","Davidsssss",now(),now());

INSERT INTO `listings` (`user_id`,`name`, `description`, `property_type`, 
`room_type`, `address`,`latitude`,`longitude`,`bed_count`,`bathroom_count`,
`max_guest`, `price_by_night`,`created_at`, `updated_at`)
VALUES ((SELECT `id` FROM `users` WHERE `first_name`= "Robin")
,"Hello World","best place ever xoxo", "Bungalow","Shared","166 FloorIT street",
14.676041, 121.043701,3,1,5,1050,now(),now()),
((SELECT `id` FROM `users` WHERE `first_name`= "Dave Davids")
,"Bye World","worst place dont go here", "House","Entire Place","32A Mahusay Street",
32.318230, -86.902298,0,0,1,9999.99,now(),now());

INSERT INTO `bookings` (`start_date`, `end_date`, `is_approved`, `user_id`, `listing_id`, 
`price_per_day`, `price_for_stay`, `created_at`,`updated_at`)
VALUES 
    ("2020-02-02","2020-03-03", 0,1,1,200.00,3100.00,now(),now()),
    ("2020-02-02","2020-03-03", 1,2,2,250.00,3250.00,now(),now());

INSERT INTO `reviews` (`user_id`,
    `listing_id`,
    `booking_id`,
    `rating_num`,
    `content`,
    `created_at`,
    `updated_at`)
VALUES
    (1,1,1,4.0,"SO!!! AMAZING!!! I LOVE THIS PLACE",now(),now()),
    (2,2,2,1,"SO HORRIBLE NEVER COMING HERE AGAIN!!1",now(),now()) ;

INSERT INTO `amenities` (`name`,
    `amenity_file`,
    `created_at`,
    `updated_at`)
VALUES 
    ("Air conditioning", "https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", now(),now()),
    ("Hangers", "https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", now(),now()),
    ("Iron", "https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", now(),now()),
    ("Washer", "https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", now(),now()),
    ("Dryer", "https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", now(),now());

INSERT INTO `listing_images` (
	`listing_id`,
    `listing_file`,
    `uploaded_by`,
    `created_at`,
    `updated_at`)
VALUES (1,"https://image.shutterstock.com/image-photo/office-prank-sharp-thumbtacks-on-600w-1302543268.jpg", 1,now(),now());

INSERT INTO `listing_amenities` (`listing_id`,
    `amenity_id`,
    `created_at`,
    `updated_at`)
VALUES 
	(1,3,now(),now()),
    (1,4,now(),now()),
    (2,2,now(),now());