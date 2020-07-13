var { v4:uuidv4 } = require('uuid')
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
        new Promise((resolve, reject)=>{
            resolve();
            
        }).then(()=>{
            res.status(200).json({
                data: db.users
            });
        })
    },
    getUser: (req,res)=>{
        const user = _.find(db.users, function(o){return o.id == req.params.userId})
        new Promise((resolve, reject)=>{
            if(user){
                resolve(user)
            }else{
                reject()
            }
        }).then((user)=>{
            res.status(200).json({
                data: user
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'User not found'
                }
            })
        })
    },
    putUser: (req,res)=>{
        const id = req.params.userId
        const toUpdate = _.findIndex(db.users, function(o){return o.id == req.params.userId})
        const updatedAt = new Date();
        new Promise((resolve,reject)=>{
            if (toUpdate>=0){
                const user = {
                    id,
                    email:req.body.email, 
                    firstName:req.body.firstName,
                    lastName: req.body.lastName,
                    createdAt: req.body.createdAt,
                    updatedAt
                }
                db.users[toUpdate] = user;
                resolve(user)
            }else{
                reject()
            }
        }).then((user)=>{
                res.status(200).json({
                    data: user
                })
        }).catch(()=>{
            res.status(404).json({
                error:{
                    message: "User does not exist"
                }
            })
        })
    },
    postUser: (req,res)=>{
        const id = uuidv4();
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0)
        var data = req.body;
        new Promise((resolve, reject)=>{
            if(data){
                if(data.firstName && data.lastName && data.email){
                    if(isUniqueUser(data.email)){
                        const user = {
                            id,
                            email:req.body.email, 
                            firstName:req.body.firstName,
                            lastName: req.body.lastName,
                            createdAt,
                            updatedAt
                        };
                        db.users.push(user);
                        res.status(200).json({
                            data: user
                        })
                    }else{
                        res.status(409).json({
                            error: {
                                message: 'The email already exists'
                            }
                        });
                    }
                    
                }else{
                    //find what's missing
                    res.status(404).json({
                        error: {
                            message: 'Wrong formatting'
                        }
                    });
                }
                resolve();
            }
        })

    },
    deleteUser: (req,res)=>{
        const toDelete = _.findIndex(db.users, function(o){return o.id == req.params.userId})
        console.log("hey:"+toDelete);
        new Promise((resolve, reject)=>{
            
            if(toDelete>=0){
                var user = db.users.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: user[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "User not found"
                }
            })
        })
        
        
    },
    getBookings:(req,res)=>{
        new Promise((resolve, reject)=>{
            resolve();
            
        }).then(()=>{
            res.status(200).json({
                data: db.bookings
            });
        })
    },
    getBooking:(req,res)=>{
        const booking = _.find(db.bookings, function(o){return o.id == req.params.bookingId})
        new Promise((resolve, reject)=>{
            if(booking){
                resolve(booking)
            }else{
                reject()
            }
        }).then(()=>{
            res.status(200).json({
                data: booking
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'Booking not found'
                }
            })
        })
    },
    putBooking:(req,res)=>{
        const id = req.params.bookingId
        const updatedAt = new Date();
        const toUpdate = _.findIndex(db.bookings, function(o){return o.id == req.params.bookingId})
        new Promise((resolve,reject)=>{
            if (toUpdate>=0){
                const booking = {
                    id,
                    startDate:req.body.startDate, 
                    endDate:req.body.endDate,
                    isApproved: req.body.isApproved,
                    userId: req.body.userId,
                    listingId: req.body.listingId,
                    pricePerDay: req.body.pricePerDay,
                    priceForStay: req.body.priceForStay,
                    createdAt: req.body.createdAt,
                    updatedAt
                }
                db.bookings[toUpdate] = booking;
                resolve(booking)
            }else{
                reject()
            }
        }).then((booking)=>{
                res.status(200).json({
                    data: booking
                })
        }).catch(()=>{
            res.status(404).json({
                error:{
                    message: "Booking does not exist"
                }
            })
        })

    },
    postBooking:(req,res)=>{
        const id = uuidv4();
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0);
        
        new Promise((resolve,reject)=>{
            var data = req.body;
                if(data.startDate && data.endDate 
                    && data.userId 
                    && data.listingId 
                    && data.pricePerDay
                    && data.priceForStay){
                    const booking = {
                        id,
                        startDate:data.startDate, 
                        endDate:data.endDate,
                        isApproved: 0,
                        userId: data.userId,
                        listingId: data.listingId,
                        pricePerDay: data.pricePerDay,
                        priceForStay: data.priceForStay,
                        createdAt,
                        updatedAt
                    };
                    db.bookings.push(booking);
                    res.status(200).json({
                        data: booking
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
    deleteBooking:(req,res)=>{
        const toDelete = _.findIndex(db.bookings, function(o){return o.id == req.params.bookingId})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var booking = db.bookings.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: booking[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "Booking not found"
                }
            })
        })
    },
    getListings: (req,res)=>{
        //integrate queries
        new Promise((resolve, reject)=>{
            resolve();
            
        }).then(()=>{
            res.status(200).json({
                data: db.listings
            });
        })
    },
    getListing: (req,res)=>{
        const listing = _.find(db.listings, function(o){return o.id == req.params.listingId})
        new Promise((resolve, reject)=>{
            if(listing){
                resolve(listing)
            }else{
                reject()
            }
        }).then((listing)=>{
            res.status(200).json({
                data: listing
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'Listing not found'
                }
            })
        })
    },
    postListing: (req,res)=>{
        const id = uuidv4();
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0);
        const data = req.body;
        new Promise((resolve, reject)=>{
            if(data.name && data.address 
                && data.latitude && data.longitude 
                && data.bedCount && data.bathroomCount 
                && data.maxGuest && data.priceByNight && data.userId){
                    const listing = {
                        id,
                        name:data.name, 
                        description:data.description,
                        propertyType: data.propertyType,
                        roomType: data.roomType,
                        address: data.address,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        bedCount: data.bedCount,
                        bathroomCount: data.bathroomCount,
                        maxGuest: data.maxGuest,
                        priceByNight: data.priceByNight,
                        userId: data.userId,
                        createdAt,
                        updatedAt
                    };
                    db.listings.push(listing);
                    res.status(200).json({
                        data: listing
                    })
            }else{
                res.status(404).json({
                    error:{
                        message: "Wrong formatting"
                    }
                })
            }
            resolve();
        })
    },
    putListing: (req,res)=>{
        const id = req.params.listingId
        const updatedAt = new Date();
        const toUpdate = _.findIndex(db.listings, function(o){return o.id == req.params.listingId})
        var data = req.body;
        new Promise((resolve,reject)=>{
            if (toUpdate>=0){
                const listing = {
                    id,
                    name:data.name, 
                    description:data.description,
                    propertyType: data.propertyType,
                    roomType: data.roomType,
                    address: data.address,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    bedCount: data.bedCount,
                    bathroomCount: data.bathroomCount,
                    maxGuest: data.maxGuest,
                    priceByNight: data.priceByNight,
                    userId: data.userId,
                    createdAt: data.createdAt,
                    updatedAt
                  }
                  db.listings[toUpdate] = listing;
                  res.status(200).json({
                      data: listing
                  })
            }else{
                res.status(404).json({
                    error:{
                        message: "Listing not found"
                    }
                })
            }
            resolve()
        })
    },
    deleteListing: (req,res)=>{
        const toDelete = _.findIndex(db.listings, function(o){return o.id == req.params.listingId})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var listing = db.listings.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: listing[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "Listing not found"
                }
            })
        })
        
    },
    getReviews: (req,res) =>{
        new Promise((resolve, reject)=>{
            var reviews = _.filter(db.reviews, function(o) { return o.listing_id == req.params.listingId; });
            if(reviews){
                resolve(reviews);
            }else{
                reject()
            }
        }).then((reviews)=>{
            res.status(200).json({
                data: reviews
            });
        }).catch(()=>{
            res.status(404).json({
                error:{
                    message: "No reviews exist"
                }
            })
        })
    },
    getReview: (req,res) =>{
        const review = _.find(db.reviews, function(o){return o.id == req.params.reviewId && o.listingId == req.params.listingId})
        new Promise((resolve, reject)=>{
            if (review){
                res.status(200).json({
                    data: review
                })
            }else{
                res.status(404).json({
                    error:{
                        message: "Review does not exist"
                    }
                })
            }
            resolve()
        })
    },
    postReview: (req,res) =>{
        const id = uuidv4();
        const data = req.body
        new Promise((resolve,reject)=>{
            if(data.listingId && data.userId && data.ratingNum && data.bookingId){
                const review = {
                    id,
                    userId:data.userId,
                    listingId: data.listingId,
                    ratingNum: data.ratingNum,
                    content: data.content,
                    bookingId:data.bookingId,
                    createdAt: new Date(),
                    updatedAt: new Date(1990,1,1,0,0,0,0)
                };
                db.reviews.push(review);
                res.status(200).json({
                    data: review
                })
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
        const toDelete = _.findIndex(db.reviews, function(o){return o.id == req.params.reviewId /* && o.listing_id == req.params.listingId */})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var review = db.reviews.splice(toDelete,1); 
                res.status(200).json({
                    data: review[0]
                })
            }else{
                res.status(404).json({
                    error: {
                        message: 'Review not found'
                    }
                })
            }
            resolve()
        })
    },
    getAmenities: (req,res)=>{
        new Promise((resolve, reject)=>{
            resolve();
            
        }).then(()=>{
            res.status(200).json({
                data: db.amenities
            });
        })
    },
    getAmenity: (req,res)=>{
        const amenity = _.find(db.amenities, function(o){return o.id == req.params.amenityId})
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
        })
    },
    /* postAmenity: (req,res)=>{
        const id = uuidv4();
        var created_at =  new Date();
        var updated_at= new Date(1990,1,1,0,0,0,0);
        const data = req.body;
        new Promise((resolve, reject)=>{
            if(data.name && isUniqueAmenity(data.name)){
                const amenity= {
                    id,
                    name: data.name,
                    created_at,
                    updated_at
                }
                db.amenities.push(amenity);
                res.status(200).json({
                    data: amenity
                })
            }else{
                res.status(409).json({
                    error:{
                        message: "Wrong formatting"
                    }
                })
            }
        })
    }, */
    postTestAmenity: (req,res)=>{
        const id = uuidv4();
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0);
        new Promise((resolve,reject,next)=>{
            uploadSingle(req,res,(err)=>{
                if(err){
                    console.error(err);
                    res.status(404).json({
                        error:{
                            msg: "Internal server error"
                        }
                    })
                }else{
                    if(req.file == undefined){
                        res.status(400).json({
                            error:{
                                msg: "Bad request. No image uploaded"
                            }
                        })
                    }else{
                        const file = req.file;
                        const name = req.body.name;
                        if(name && isUniqueAmenity(name)){
                            const amenity= {
                                id,
                                name: name,
                                imageIcon: file,
                                createdAt,
                                updatedAt
                            }
                        
                            db.amenities.push(amenity);
                            res.status(200).json({
                                data: amenity
                            })
                        }else{
                            res.status(409).json({
                                error:{
                                    message: "Wrong formatting"
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
        const toDelete = _.findIndex(db.amenities, function(o){return o.id == req.params.amenityId})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var amenity = db.amenities.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: amenity[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "Booking not found"
                }
            })
        })
    },
    putAmenity: (req,res)=>{
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
    getLAmenities: (req,res)=>{
        new Promise((resolve, reject)=>{
            var lAmenities = _.filter(db.lAmenities, function(o) { return o.listingId == req.params.listingId; });
            if(lAmenities){
                resolve(lAmenities);
            }else{
                reject()
            }
            
        }).then((lAmenities)=>{
            res.status(200).json({
                data: lAmenities
            });
        })
    },
    getLAmenity: (req,res)=>{
        const lAmenity = _.find(db.lAmenities, function(o){return o.id == req.params.lAmenityId})
        new Promise((resolve, reject)=>{
            if(lAmenity){
                resolve(lAmenity)
            }else{
                reject()
            }
        }).then((lAmenity)=>{
            res.status(200).json({
                data: lAmenity
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'Listing Amenity not found'
                }
            })
        })
    },
    postLAmenity: (req,res)=>{
        const id = uuidv4();
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0);
        const data = req.body;
        console.log(req.body);
        new Promise((resolve, reject)=>{
            if(amenityExistsAndNew(data.amenityId, req.params.listingId)){
                const lAmenity= {
                    id,
                    listingId: req.params.listingId,
                    amenityId: data.amenityId,
                    createdAt,
                    updatedAt
                }
                db.lAmenities.push(lAmenity);
                res.status(200).json({
                    data: lAmenity
                })
            }else{
                res.status(409).json({
                    error:{
                        message: "Wrong formatting"
                    }
                })
            }
            resolve()
        })
    },
    deleteLAmenity: (req,res)=>{
        const toDelete = _.findIndex(db.lAmenities, function(o){return o.id == req.params.lAmenityId})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var lAmenity = db.lAmenities.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: lAmenity[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "Amenity not found"
                }
            })
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
        new Promise((resolve, reject)=>{
            var lImages = _.filter(db.lImages, function(o) { return o.listingId == req.params.listingId; });
            if(lImages){
                resolve(lImages);
            }else{
                reject()
            }
            
        }).then((lImages)=>{
            res.status(200).json({
                data: lImages
            });
        })
    },
    getLImage: (req,res)=>{
        const lImage = _.find(db.lImages, function(o){return o.id == req.params.lImageId})
        new Promise((resolve, reject)=>{
            if(lImage){
                resolve(lImage)
            }else{
                reject()
            }
        }).then((lImage)=>{
            res.status(200).json({
                data: lImage
            });
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: 'Listing Image not found'
                }
            })
        })
    },
    postLImage: (req,res)=>{
        
        var createdAt =  new Date();
        var updatedAt= new Date(1990,1,1,0,0,0,0);
        let images = [];
        new Promise((resolve, reject, next)=>{
            uploadMultiple(req,res,(err)=>{
                if(err){
                    console.error(err);
                    res.status(404).json({
                        error:{
                            msg: "Internal server error"
                        }
                    });
                }else{
                    if(req.files == undefined){
                        res.status(400).json({
                            error:{
                                msg: "Bad request. No image uploaded"
                            }
                        })
                    }else{
                        const files = req.files;
                        const filesLength = req.files.length;
                        const listingId = req.body.listingId;
                        const uploadedBy = req.body.uploadedBy;
                        for (var i = 0; i<filesLength;i++){
                            
                            var id = uuidv4();
                            //check if image
                            let image = {
                                id,
                                listingId: listingId,
                                listingImage: files[i],
                                uploadedBy: uploadedBy,
                                createdAt,
                                updatedAt
                            }
                            db.lImages.push(image);
                            images.push(image);
                        }
                        res.status(200).json({data: images})
                    }
                }
            })
            resolve();
        })
    },
    deleteLImage: (req,res)=>{
        const toDelete = _.findIndex(db.lImages, function(o){return o.id == req.params.lImageId})
        new Promise((resolve, reject)=>{
            if(toDelete>=0){
                var lImage = db.lImages.splice(toDelete,1); 
                //delete db.bookings[toDelete]
                res.status(200).json({
                    data: lImage[0]
                })
            }else{
                reject()
            }
            resolve()
        }).catch(()=>{
            res.status(404).json({
                error: {
                    message: "Listing Image not found"
                }
            })
        })
    }
}

function isUniqueUser(email){
    const user = _.find(db.users, function(o){return o.email == email})
    if(user){
        return false;
    }
    return true;
}
function isUniqueAmenity(name){
    const amenity = _.find(db.amenities, function(o){return o.name.toUpperCase() == name.toUpperCase()})
    if (amenity){
        return false;
    }return true;
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
