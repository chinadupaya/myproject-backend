var knex = require('knex')({
    client: 'mysql',
    version: '5.7',
    connection: {
        host : 'db_server',
        user : 'root',
        password : 'password',
        database : 'mydb'
    }
});
var shortid = require('shortid');
const Redis = require("ioredis");
const redis = new Redis(6379, "app_redis")

const repo = {
    getUsers: function(){
        return knex.raw('CALL get_users()')
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    getUser: function(userId){
        const pipeline = redis.pipeline();
        pipeline.hgetall(`users:${userId}`)
        return pipeline.exec()
        .then((data)=>{
            return data[0][1]
        })
    },
    getUserBookings: function(userId){
        return knex.raw('CALL get_user_bookings(?)',[userId])
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    getUserListings: function(userId){
        return knex.raw('CALL get_user_listings(?)',[userId])
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    putUser: function(userId, email, firstName, lastName){
        const dbTask = knex.raw('CALL update_user(?,?,?,?)',[userId, email, firstName, lastName])
        const dbTask2 = knex.raw('CALL update_user_tables(?,?,?)',[userId, firstName,  lastName])
        const redisObject = {
            id:userId, email:email, first_name:firstName, last_name:lastName
        }
        const pipeline = redis.pipeline();
        var stream = redis.scanStream({
            match:`listings:*`,
        });
        stream.on("data", function (resultKeys) {
        // `resultKeys` is an array of strings representing key names.
        // Note that resultKeys may contain 0 keys, and that it will sometimes
        // contain duplicates due to SCAN's implementation in Redis.
        for (var i = 0; i < resultKeys.length; i++) {
            redis.hgetall(resultKeys[i])
            .then((response)=>{
                console.log("response",response);
                if(response.user_id ==userId){
                    console.log("userId",userId)
                    redis.hmset(`listings:${response.id}`,{
                        first_name:firstName,
                        last_name: lastName
                    }).then(()=>{
                        console.log("success");
                    })
                }
            })
        }
        });
        stream.on("end", function () {
            console.log("all keys have been visited");
        })
        
        console.log(redisObject);
        
        pipeline.hmset(`users:${userId}`,redisObject);
        const kvsTask = pipeline.exec();
        return Promise.all([dbTask,dbTask2,kvsTask])
    },
    compareEmail: function(email){
        return knex.raw('CALL is_unique_email(?)', [email])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    postUser: function(id, email, firstName, lastName, hash){
        const dbTask= knex.raw('CALL create_user(?,?,?,?,?)',[id, email, firstName, lastName, hash])
        .then((data)=>{
            return Promise.resolve(data);
        })
        const redisObject = {
            id: id, email:email, first_name: firstName, last_name: lastName
        }
        const pipeline = redis.pipeline();
        pipeline.hmset(`users:${id}`, redisObject)
        const kvsTask = pipeline.exec();
        return Promise.all([dbTask, kvsTask])
    },
    deleteUser: function(userId){
        return knex.raw('CALL delete_user(?)',[userId])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    getBookings: function(){
        return knex.raw('CALL get_bookings()')
        .then((data)=>{
            return Promise.resolve(data[0][0]);
        })
    },
    getBooking: function(bookingId){
        return knex.raw('CALL get_booking(?)',[bookingId])
        .then((data)=>{
            return Promise.resolve(data[0][0][0]);
        })
    },
    putBooking: function(id, startDate, endDate, isApproved, userId, listingId, pricePerDay, priceForStay){
        return knex.raw('CALL update_booking(?,?,?,?,?,?,?,?)',[id,startDate, endDate,
            isApproved,userId,listingId, pricePerDay, priceForStay])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    postBooking: function(id, startDate, endDate, isApproved, userId, listingId, listingName, listingAddress, pricePerDay, priceForStay){
        return knex.raw('CALL create_booking(?,?,?,?,?,?,?,?,?,?)',[id,
            startDate,  endDate,  isApproved,  userId,
            listingId,  listingName, listingAddress,  pricePerDay, priceForStay
        ])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    deleteBooking: function(bookingId){
        return knex.raw('CALL delete_booking(?)',[bookingId])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    getListings: function(latitude, longitude,min_bed, min_bathroom, room_type,property_type,sort_by,page_num){
        
        return knex.raw('CALL get_listings(?,?,?,?,?,?,?,?)',[latitude, longitude,min_bed, min_bathroom, room_type,property_type,sort_by,page_num])
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    getListing: function(listingId){
        const pipeline = redis.pipeline();
        pipeline.hgetall(`listings:${listingId}`);
        return pipeline.exec()
        .then((data)=>{
            return data[0][1]
        })
        /* return knex.raw('CALL get_listing(?)',[listingId])
        .then((data)=>{
            return Promise.resolve(data[0][0][0])
        }) */
    },
    getUserListingBookings: function(userId, listingId){
        return knex.raw('CALL get_user_listing_bookings(?,?)',[userId, listingId])
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    getListingBookings: function(listingId){
        return knex.raw('CALL get_listing_bookings(?)',listingId)
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    postListing: function(id, userId, firstName, lastName, name, description, propertyType,
        roomType, address, latitude, longitude,bedCount, bathroomCount,maxGuest,priceByNight){
        const dbTask =  knex.raw('CALL create_listing(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[
            id, userId, firstName, lastName, name, description, propertyType,
            roomType, address, latitude,longitude,
            bedCount, bathroomCount, maxGuest, priceByNight
        ])
        
        const redisObject = {
            id:id, user_id:userId, first_name:firstName, last_name:lastName, name:name, description:description, property_type:propertyType,
            room_type:roomType, address:address, latitude:latitude,longitude:longitude,
            bed_count:bedCount, bathroom_count:bathroomCount, max_guest:maxGuest, price_by_night:priceByNight
        }

        const pipeline = redis.pipeline();
        pipeline.hmset(`listings:${id}`, redisObject)
        const kvsTask = pipeline.exec();
        return Promise.all([dbTask, kvsTask]);
    },
    putListing: function(id, userId, name, description, propertyType,
        roomType, address, latitude, longitude, bedCount,
        bathroomCount, maxGuest, priceByNight){
        const dbTask =  knex.raw('CALL update_listing(?,?,?,?,?,?,?,?,?,?,?,?,?)',[id,
            userId, name, description, propertyType,
            roomType, address, latitude, longitude, bedCount,
            bathroomCount, maxGuest, priceByNight
        ])
        const dbTask2 = knex.raw('CALL update_listing_tables(?,?,?)',[id, name, address])
        
        const redisObject = {
            id:id, user_id:userId, name:name, description:description, property_type:propertyType,
            room_type:roomType, address:address, latitude:latitude,longitude:longitude,
            bed_count:bedCount, bathroom_count:bathroomCount, max_guest:maxGuest, price_by_night:priceByNight
        }
        //console.log(redisObject);
        const pipeline = redis.pipeline();
        pipeline.hmset(`listings:${id}`, redisObject)
        const kvsTask = pipeline.exec();
        return Promise.all([dbTask, dbTask2, kvsTask]);
    },
    deleteListing: function(listingId){
        const dbTask = knex.raw('CALL delete_listing(?)',[listingId])
        const dbTask2 = knex.raw('CALL delete_listing_tables(?)',[listingId])
        const pipeline = redis.pipeline();
        pipeline.del(`listings:${listingId}`);
        const kvsTask = pipeline.exec();
        return Promise.all([dbTask, dbTask2, kvsTask]);
    },
    getReviews: function(listingId){
        return knex.raw('CALL get_reviews(?)',[listingId])
        .then((data)=>{
            return Promise.resolve(data[0][0]);
        })
    },
    getReview: function(listingId, reviewId){
        return knex.raw('CALL get_review(?,?)',[listingId, reviewId])
        .then((data)=>{
            return Promise.resolve(data[0][0][0])
        })
    },
    postReview: function(id, userId, firstName, lastName,listingId, bookingId, ratingNum, content){
        return knex.raw('CALL create_review(?,?,?,?,?,?,?,?)',[
            id, userId, firstName, lastName,listingId, bookingId, ratingNum, content
        ])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    deleteReview: function(reviewId){
        return knex.raw('CALL delete_listing_image(?)', [reviewId])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    getUserRooms: function(userId){
        return knex.raw('CALL get_user_rooms(?)',[userId])
        .then((data)=>{
            return Promise.resolve(data[0][0]);
        })
    },
    postRoom: function(roomId, userIdOne, userIdTwo, nameOne, nameTwo){
        
        const dbTaskOne =  knex.raw('CALL create_room(?,?,?,?)',[
            roomId, userIdOne, userIdTwo, nameTwo
        ]);
        const dbTaskTwo =  knex.raw('CALL create_room(?,?,?,?)',[
            roomId, userIdTwo, userIdOne, nameOne
        ])

        return Promise.all([dbTaskOne, dbTaskTwo]);
    },
    getMessages: function(roomId){
        return knex.raw('CALL get_room_messages(?)',[roomId])
        .then((data)=>{
            return Promise.resolve(data[0][0])
        })
    },
    postMessage: function(id, roomId, type, sentBy,content){
        return knex.raw('CALL create_message(?,?,?,?,?)',[id,roomId, sentBy,content, type])
        .then((data)=>{
            return Promise.resolve(data);
        })
    },
    getLImages: function(listingId){
        return knex.raw('CALL get_listing_images(?)',[listingId])
        .then((data)=>{
            console.log(data[0][0]);
            return Promise.resolve(data[0][0])
        })
    },
    postLImages: function(files,filesLength, listingId, uploadedBy){
        var promises = [];
        let images= [];
        for (var i = 0; i<filesLength;i++){
            var filePath = files[i].path
            //check if image
            let image = {
                listing_id: listingId,
                listing_file: filePath,
                uploadedBy: uploadedBy,
            }
            console.log(files[i].path);
            promises.push(knex.raw('CALL create_listing_image(?,?,?,?)',[
                shortid.generate(),listingId, filePath, uploadedBy
            ])
            .then(()=>{
                console.log('uploaded images')
                images.push(image);})
            .catch((err)=>{console.log(err);})
            )
            
        }
        return Promise.all(promises).then(()=>{return images})
    }
}


module.exports = repo