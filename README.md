# airperium
- This is the backend for an airbnb clone for Saperium Internship 2020

## Running on docker
`docker-compose build`
- Build images. Do this everytime Dockerfile is changed.
`docker-compose up`
- This should migrate all the tables into the mysql server
`docker-compose down`
- Use for cleanup. Stops and deletes the containers.

## Local Development
- Go to start.sh
- to run nodemon, change last line to "npm run dev" otherwise "npm start"

## Database
Tables: users, listings, reviews, bookings, amenities, listing images, listing amenities
- put all tables/dummy data/stored procedures in **-init-tables-up.js

## API fields
name, imageupload -> POST and PUT amenities