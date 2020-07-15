var { v4:uuidv4 } = require('uuid')
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
var _ = require('lodash');
var db = require('../models/db');
const multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   
var uploadSingle = multer({ 
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file, cb)
    }
 }).single('imageupload')
var uploadMultiple = multer({ 
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file, cb)
    }
}).array("listingImages",4)

// Check File Type
function checkFileType(file, cb){
    console.log("check file type")
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
  }

const controller = {
    getUsers: (req,res)=>{
        knex.raw('CALL get_users()')
        .then((response)=>{return res.status(200).json({data: response[0][0]})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getUser: (req,res)=>{
        knex.raw('CALL get_user(?)',[req.params.userId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    putUser: (req,res)=>{
        //const id = req.params.userId
        //const toUpdate = _.findIndex(db.users, function(o){return o.id == req.params.userId})
        //const updatedAt = new Date();
        new Promise((resolve,reject)=>{
            data = req.body
            knex.raw('CALL update_user(?,?,?,?)',[req.params.userId, data.email, data.firstName, data.lastName])
            .then(()=>{
                return res.status(200).json({
                    data:{
                        email: data.email,
                        first_name: data.firstName,
                        last_name: data.lastName
                    }
                })
            })
            .catch(()=>{return res.status(404).json({
                error: {
                    message: "Internal server error"
                }
            })});
        })
    },
    postUser: (req,res)=>{
        //const id = uuidv4();
        var data = req.body;
        if(data.firstName && data.lastName && data.email){
            knex.raw("CALL is_unique_email(?)",[data.email])
            .then(response => {
                if(response[0][0].length==0){
                    knex.raw('CALL create_user(?,?,?)',[data.email,data.firstName, data.lastName])
                    .then((response)=>{console.log(response);
                        return res.status(200).json({data: {
                            email: data.email,
                            first_name: data.firstName,
                            last_name: data.lastName
                        }})})
                    .catch(()=>{return res.status(404).json({
                        error: {
                            message: "Internal server error"
                        }
                    })});
                }else{
                    return res.status(404).json({
                        error: {
                            message: "Email already exists."
                        }
                    })
                }
            })      
        }else{
            //find what's missing
            res.status(404).json({
                error: {
                    message: 'One of your values is missing'
                }
            });
        }
    },
    deleteUser: (req,res)=>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_user(?)',[req.params.userId])
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.userId
                    }
                })
            })
            .catch((error)=>{
                console.log(error);
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
        
        
    },
    getBookings:(req,res)=>{
        knex.raw('CALL get_bookings()')
        .then((response)=>{return res.status(200).json({data: response[0][0]})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getBooking:(req,res)=>{
        knex.raw('CALL get_booking(?)',[req.params.bookingId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    putBooking:(req,res)=>{
        const id = req.params.bookingId;
        const data = req.body;
        new Promise((resolve,reject)=>{
                const booking = {
                    id,
                    startDate:data.startDate, 
                    endDate:data.endDate,
                    isApproved: data.isApproved,
                    userId: data.userId,
                    listingId: data.listingId,
                    pricePerDay: data.pricePerDay,
                    priceForStay: data.priceForStay,
                }
                knex.raw('CALL update_booking(?,?,?,?,?,?,?,?)',[id,data.startDate, data.endDate,
                    data.isApproved,data.userId,data.listingId,data.pricePerDay, data.priceForStay])
                .then(()=>{
                    res.status(200).json({
                        data: booking
                    })
                })
                resolve()
        })

    },
    postBooking:(req,res)=>{
        new Promise((resolve,reject)=>{
            var data = req.body;
            if(data.startDate && data.endDate 
                && data.userId 
                && data.listingId 
                && data.pricePerDay
                && data.priceForStay){
                const booking = {
                    start_date:data.startDate, 
                    end_date:data.endDate,
                    is_approved: 0,
                    user_id: data.userId,
                    listing_id: data.listingId,
                    price_per_day: data.pricePerDay,
                    price_for_stay: data.priceForStay,
                };
                knex.raw('CALL create_booking(?,?,?,?,?,?,?)',[
                    data.startDate, data.endDate, data.isApproved, data.userId,
                    data.listingId, data.pricePerDay,data.priceForStay
                ]).then((response)=>{
                    console.log(response);
                    return res.status(200).json({data: booking})
                    })
                .catch(()=>{return res.status(404).json({
                    error: {
                        message: "Internal server error"
                    }
                })});
            }else{
                res.status(404).json({
                    error:{
                        message: "Wrong formatting"
                    }
                })
            }
            resolve()
        })
        
    },
    deleteBooking:(req,res)=>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_booking(?)',[req.params.bookingId])
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.bookingId
                    }
                })
            })
            .catch((error)=>{
                console.log(error);
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
    },
    getListings: (req,res)=>{
        //integrate queries
        knex.raw('CALL get_listings()')
        .then((response)=>{return res.status(200).json({data: response[0][0]})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getListing: (req,res)=>{
        knex.raw('CALL get_listing(?)',[req.params.listingId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});

    },
    postListing: (req,res)=>{
        const data = req.body;
        new Promise((resolve, reject)=>{
            if(data.name && data.address 
                && data.latitude && data.longitude 
                && data.bedCount && data.bathroomCount 
                && data.maxGuest && data.priceByNight && data.userId){
                    knex.raw('CALL create_listing(?,?,?,?,?,?,?,?,?,?,?,?)',[
                        data.userId, data.name, data.description, data.propertyType,
                        data.roomType, data.address,data.latitude,data.longitude,
                        data.bedCount, data.bathroomCount, data.maxGuest, data.priceByNight
                    ]).then((response)=>{console.log(response);
                        return res.status(200).json({data: {
                            user_id: data.userId,
                            name: data.name,
                            description: data.description,
                            property_type: data.propertyType,
                            room_type: data.roomType,
                            address: data.address,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            bed_count: data.bedCount,
                            bathroom_count: data.bathroomCount,
                            max_guest: data.maxGuest,
                            price_by_night:data.priceByNight
                        }})})
                    .catch(()=>{return res.status(404).json({
                        error: {
                            message: "Internal server error"
                        }
                    })});
            }else{
                res.status(404).json({
                    error:{
                        message: "At least one of your fields is missing"
                    }
                })
            }
            resolve();
        })
    },
    putListing: (req,res)=>{
        const id = req.params.listingId
        var data = req.body;
        new Promise((resolve,reject)=>{
            const listing = {
                id,
                name:data.name, 
                description:data.description,
                property_type: data.propertyType,
                room_type: data.roomType,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                bed_count: data.bedCount,
                bathroom_count: data.bathroomCount,
                max_guest: data.maxGuest,
                price_by_night: data.priceByNight,
                user_id: data.userId,
            }
            knex.raw('CALL update_listing(?,?,?,?,?,?,?,?,?,?,?,?,?)',[id,
                data.userId, data.name, data.description, data.propertyType,
                data.roomType, data.address, data.latitude, data.longitude, data.bedCount,
                data.bathroomCount, data.maxGuest, data.priceByNight
            ]).then(()=>{
                res.status(200).json({
                    data: listing
                })
            }).catch((err)=>{
                console.log(err);
                res.status(404).json({
                    error: {
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
    },
    deleteListing: (req,res)=>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_listing(?)',[req.params.listingId])
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.listingId
                    }
                })
            })
            .catch((error)=>{
                console.log(error);
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
        
    },
    getReviews: (req,res) =>{
        knex.raw('CALL get_reviews(?)',[req.params.listingId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getReview: (req,res) =>{
        knex.raw('CALL get_review(?,?)',[req.params.listingId, req.params.reviewId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    postReview: (req,res) =>{
        const data = req.body
        new Promise((resolve,reject)=>{
            if(data.listingId && data.userId && data.ratingNum && data.bookingId){
                const review = {
                    user_id:data.userId,
                    listing_id: data.listingId,
                    rating_num: data.ratingNum,
                    content: data.content,
                    booking_id:data.bookingId,
                };
                knex.raw('CALL create_review(?,?,?,?,?)',[
                    data.userId, data.listingId, data.bookingId, data.ratingNum, data.content
                ]).then(()=>{
                    res.status(200).json({
                        data: review
                    })
                })
                .catch(()=>{return res.status(404).json({
                    error: {
                        message: "Internal server error"
                    }
                })});
                
            }else{
                res.status(404).json({
                    error: {
                        message: "Wrong formatting"
                    }
                })
            }
            resolve()

        })
        
    },
    deleteReview: (req,res) =>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_listing_image(?)', req.params.reviewId)
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.reviewId
                    }
                })
            })
            .catch(()=>{
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
    },
    getAmenities: (req,res)=>{
        knex.raw('CALL get_amenities()')
        .then((response)=>{return res.status(200).json({data: response[0][0]})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getAmenity: (req,res)=>{
        knex.raw('CALL get_amenity(?)',[req.params.amenityId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
        /* const amenity = _.find(db.amenities, function(o){return o.id == req.params.amenityId})
        new Promise((resolve, reject)=>{
            if(amenity){
                resolve(amenity)
            }else{
                reject()
            }
        }).then((amenity)=>{
            res.status(200).json({
                data: amenity
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'Amenity not found'
                }
            })
        }) */
    },
    postTestAmenity: (req,res)=>{
        new Promise((resolve,reject,next)=>{
            uploadSingle(req,res,(err)=>{
                if(err){
                    console.error(err);
                    res.status(404).json({
                        error:{
                            message: "Internal server error"
                        }
                    })
                }else{
                    if(req.file == undefined){
                        res.status(400).json({
                            error:{
                                message: "Bad request. No image uploaded"
                            }
                        })
                    }else{
                        //const file = req.file;
                        const filePath = req.file.path;
                        const name = req.body.name;
                        if(name){
                            const amenity= {
                                name: name,
                                amenity_file: filePath,
                            }
                            knex.raw('CALL create_amenity(?,?)',[name, filePath])
                            .then((response)=>{
                                console.log(response.json)
                                return res.status(200).json({
                                    data: amenity
                                })
                            })
                            
                        }else{
                            res.status(409).json({
                                error:{
                                    message: "One or more of your fields is missing"
                                }
                            })
                        }
                    }
                }
            })
            resolve()
        })
        
    },
    deleteAmenity: (req,res)=>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_amenity(?)', req.params.amenityId)
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.amenityId
                    }
                })
            })
            .catch(()=>{
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
    },
    putAmenity: (req,res)=>{
        const id = req.params.amenityId
        new Promise((resolve, reject)=>{
            uploadSingle(req,res,(err)=>{
                if(err){
                    console.error(err);
                    res.status(404).json({
                        error:{
                            message: "Internal server error in uploading"
                        }
                    })
                }else{
                    if(req.file == undefined){
                        //only update name
                        knex.raw('CALL update_amenity_name(?,?)',[id, req.body.name])
                        .then(()=>{
                            res.status(200).json({
                                data: {
                                    id,
                                    name: req.body.name
                                }
                            })
                        })
                        .catch((err)=>{
                            console.log(err);
                            res.status(404).json({
                                error: {
                                    message: "Internal server error"
                                }
                            })
                        })
                    }else{
                        //update amenity_file + name
                        const filePath = req.file.path;
                        const name = req.body.name;
                        const amenity= {
                            id,
                            name: name,
                            amenity_file: filePath,
                        }
                        knex.raw('CALL update_amenity_full(?,?,?)',[id, name, filePath])
                        .then((response)=>{
                            console.log(response.json)
                            return res.status(200).json({
                                data: amenity
                            })
                        })
                            
                    }
                }
            })
            resolve()
        })
    },
    getLAmenities: (req,res)=>{
        knex.raw('CALL get_listing_amenities(?)',[req.params.listingId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getLAmenity: (req,res)=>{
        knex.raw('CALL get_listing_amenity(?,?)',[req.params.listingId, req.params.lAmenityId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    postLAmenity: (req,res)=>{
        //const id = uuidv4();
        //var createdAt =  new Date();
        //var updatedAt= new Date(1990,1,1,0,0,0,0);
        const data = req.body;
        console.log(req.body);
        new Promise((resolve, reject)=>{
            //if amenity exists and new
            const lAmenity= {
                listing_id: req.params.listingId,
                amenity_id: data.amenityId,
            }
            knex.raw('CALL create_listing_amenity(?,?)',[req.params.listingId,data.amenityId])
            .then(()=>{
                return res.status(200).json({
                    data: lAmenity
                })
            })
            .catch(()=>{
                return res.status(404).json({
                    error: {
                        message: "Internal server error."
                    }
                })
            })
            
            resolve()
        })
    },
    deleteLAmenity: (req,res)=>{
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_listing_amenity(?)',[req.params.lAmenityId])
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.lAmenityId
                    }
                })
            })
            .catch(()=>{
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
            resolve()
        })
    },
    putLAmenity: (req,res)=>{
        const id = req.params.amenityId
        const updated_at = new Date();
        console.log(req.body)
        const toUpdate = _.findIndex(db.amenities, function(o){return o.id == req.params.amenityId})
        new Promise((resolve, reject)=>{
            if (toUpdate>=0){
                const amenity = {
                    id,
                    name: req.body.name,
                    created_at: req.body.created_at,
                    updated_at: updated_at
                }
                db.amenities[toUpdate] = amenity;
                  res.status(200).json({
                      data: amenity
                  })
            }else{
                res.status(404).json({
                    error:{
                        message: "Wrong formatting"
                    }
                })
            }
            resolve()
        })
    },
    getLImages: (req,res)=>{
        knex.raw('CALL get_listing_images(?)',[req.params.listingId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getLImage: (req,res)=>{
        knex.raw('CALL get_listing_image(?,?)',[req.params.listingId, req.params.lImageId])
        .then((response)=>{return res.status(200).json({
            data: response[0][0][0]
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    postLImage: (req,res)=>{
        let images = [];
        new Promise((resolve, reject, next)=>{
            uploadMultiple(req,res,(err)=>{
                if(err){
                    console.error(err);
                    res.status(404).json({
                        error:{
                            message: "Internal server error"
                        }
                    });
                }else{
                    if(req.files == undefined){
                        res.status(400).json({
                            error:{
                                message: "Bad request. No image uploaded"
                            }
                        })
                    }else{
                        const files = req.files;
                        const filesLength = req.files.length;
                        const listingId = req.body.listingId;
                        const uploadedBy = req.body.uploadedBy;
                        var promises = [];
                        for (var i = 0; i<filesLength;i++){
                            var filePath = files[i].path
                            //check if image
                            let image = {
                                listing_id: listingId,
                                listing_file: filePath,
                                uploadedBy: uploadedBy,
                            }
                            promises.push(knex.raw('CALL create_listing_image(?,?,?)',[
                                listingId, filePath, uploadedBy
                            ])
                            .then(()=>{
                                images.push(image);})
                            .catch((err)=>{throw err;})
                            )
                            
                        }
                        Promise.all(promises)
                        .then(()=>{
                            res.status(200).json({data: images})
                        })
                        .catch(()=>{
                            res.status(404).json({
                                error:{
                                    message: "Internal server error."
                                }
                            })
                        })
                    }
                }
            })
            resolve();
        }).catch(()=>{
            res.status(404).json({
                error:{
                    message: "Internal server error."
                }
            })
        })
    },
    deleteLImage: (req,res)=>{
        //const toDelete = _.findIndex(db.lImages, function(o){return o.id == req.params.lImageId})
        new Promise((resolve, reject)=>{
            knex.raw('CALL delete_listing_image(?)', req.params.lImageId)
            .then(()=>{
                res.status(200).json({
                    data: {
                        id: req.params.lImageId
                    }
                })
            })
            .catch(()=>{
                res.status(404).json({
                    error:{
                        message: "Internal server error"
                    }
                })
            })
        })  
    }
}

function amenityExistsAndNew(amenityId, listingId){
    var lAmenities = _.filter(db.lAmenities, function(o) { return o.listingId == listingId; });
    var foundIndex = _.findIndex(db.amenities, function(o) { return o.id == amenityId; });
    var foundListingIndex = _.findIndex(lAmenities, function(o){return o.amenityId == amenityId})
    if(foundIndex >=0 ){ //amenity exists in database
        if(foundListingIndex == -1){ //listing does not have amenity
            return true
        } 
        return false
    }
    return false
}

module.exports = controller;
