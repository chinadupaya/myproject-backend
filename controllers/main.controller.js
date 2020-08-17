const repo = require('../repositories/main.repository');
const shortId = require('shortid');
var bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname)
        cb(null, __dirname + '/../public/images/')
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
        repo.getUsers()
        .then((response)=>{
            return res.status(200).json({data: response})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getUser: (req,res)=>{
        repo.getUser(req.params.userId)
        .then((response)=>{return res.status(200).json({
            data: response
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getUserBookings:(req,res)=>{
        repo.getUserBookings(req.params.userId)
        .then((response)=> {return res.status(200).json({data: response})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getUserListings:(req,res)=>{
        repo.getUserListings(req.params.userId)
        .then((response)=> {return res.status(200).json({data: response})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    putUser: (req,res)=>{
        new Promise((resolve,reject)=>{
            data = req.body
            repo.putUser(req.params.userId, data.email, data.firstName, data.lastName)
            .then(()=>{
                return res.status(200).json({
                    data:{
                        id: req.params.userId,
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
    loginUser: (req,res)=>{
        data = req.body;
        repo.compareEmail(data.email)
        .then(response=>{
            if(response[0][0].length==0){
                return res.status(404).json({
                    error: {
                        message: "Email does not exist in database."
                    }
                })
            }else{
                bcrypt.compare(data.password, response[0][0][0].password, (err, res2) => {
                    // res == true or res == false
                    if(err){
                        console.log(err);
                        throw err;
                    }else{
                        if(res2==true && data.email === response[0][0][0].email ){
                            res.status(200).json({
                                success: true,
                                id: response[0][0][0].id,
                                email: response[0][0][0].email,
                                first_name: response[0][0][0].first_name,
                                last_name: response[0][0][0].last_name,
                            })
                        }
                        else{
                            res.status(404).json({
                                success: false,
                                message: "Your email or password is incorrect. Check again."
                            })
                        }
                    }
                })
            }
        })
        .catch((error)=>{
            console.log(error)
            res.status(404).json({
                error:{
                    message: "Internal server error in email"
                }
            })
        })
    },
    postUser: (req,res)=>{
        var data = req.body;
        var newId = shortId.generate();
        if(data.firstName && data.lastName && data.email){
            repo.compareEmail(data.email)
            .then(response => {
                if(response[0][0].length==0){
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(data.password, salt, function(err, hash) {
                            // Store hash in your password DB.
                            //console.log(data);
                            repo.postUser(newId, data.email,data.firstName, data.lastName, hash)
                            .then((response)=>{
                                console.log(response);
                                return res.status(200).json({data: {
                                    id: newId,
                                    email: data.email,
                                    first_name: data.firstName,
                                    last_name: data.lastName,
                                    password: hash
                                }})})
                            .catch((err)=>{return res.status(404).json({
                                error: {
                                    message: "Internal server error 1"
                                }
                            })});
                        });
                    });
                    
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
        repo.deleteUser(req.params.userId)
        .then((response)=>{
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
    },
    getBookings:(req,res)=>{
        repo.getBookings()
        .then((response)=>{return res.status(200).json({data: response})})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getBooking:(req,res)=>{
        repo.getBooking(req.params.bookingId)
        .then((response)=>{return res.status(200).json({
            data: response
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
            repo.putBooking(id,data.startDate, data.endDate,
                data.isApproved,data.userId,data.listingId, data.pricePerDay, data.priceForStay)
            .then(()=>{
                res.status(200).json({
                    data: booking
                })
            })
            .catch(()=>{return res.status(404).json({
                error: {
                    message: "Internal server error"
                }
            })});
    },
    postBooking:(req,res)=>{
        var data = req.body;
        var newId = shortId.generate();
        if(data.startDate && data.endDate && data.userId && data.listingId && data.listingName && data.listingAddress && data.pricePerDay && data.priceForStay){
            const booking = {
                id: newId,
                start_date:data.startDate, 
                end_date:data.endDate,
                is_approved: 0,
                user_id: data.userId,
                listing_id: data.listingId,
                listing_name: data.listingName,
                listing_address: data.listingAddress,
                price_per_day: data.pricePerDay,
                price_for_stay: data.priceForStay,
            };
            repo.postBooking(newId,
                data.startDate, data.endDate, data.isApproved, data.userId,
                data.listingId, data.listingName, data.listingAddress, data.pricePerDay,data.priceForStay
            ).then((response)=>{
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
    },
    deleteBooking:(req,res)=>{
        repo.deleteBooking(req.params.bookingId)
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
    },
    getListings: (req,res)=>{
        //integrate queries
        var room_type = req.query.room_type;
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var property_type = req.query.property_type;
        var min_bed = req.query.min_bed;
        var min_bathroom = req.query.min_bathroom;
        var sort_by = req.query.sort_by;
        var page_num = req.query.page_num;
        if(min_bed == undefined){min_bed = null};
        if(latitude == undefined){latitude = null};
        if(longitude == undefined){longitude = null};
        if(min_bathroom == undefined){min_bathroom = null};
        if(room_type==undefined){room_type=null};
        if(property_type==undefined){property_type=null};
        if(sort_by==undefined){sort_by=''};
        if(page_num==undefined){page_num=1};
        repo.getListings(latitude, longitude,min_bed, min_bathroom, room_type,property_type,sort_by,page_num)
        .then((response)=>{return res.status(200).json({
            page: page_num,
            data: response})})
        .catch((error)=>{
            console.log(error);
            return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getListing: (req,res)=>{
        repo.getListing(req.params.listingId)
        .then((response)=>{
            return res.status(200).json({
                data: response
            })
        })
        .catch((err)=>{
            console.log("err",err);
            return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});

    },
    getUserListingBookings:(req,res)=>{
        repo.getUserListingBookings(req.params.userId, req.params.listingId)
        .then((response)=> {return res.status(200).json({data: response})})
        .catch((err)=>{
            
            return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getListingBookings:(req,res)=>{
        console.log(req.params.listingId)
        repo.getListingBookings(req.params.listingId)
        .then((response)=> {return res.status(200).json({data: response})})
        .catch((err)=>{
            console.log(err);
            return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    postListing: (req,res)=>{
        const data = req.body;
        var newId = shortId.generate();
        new Promise((resolve, reject)=>{
            if(data.name && data.address 
                && data.latitude && data.longitude 
                && data.bedCount && data.bathroomCount 
                && data.maxGuest && data.priceByNight && data.userId){
                    repo.postListing(newId,data.userId, data.firstName, data.lastName, data.name, data.description, data.propertyType,
                        data.roomType, data.address,data.latitude,data.longitude,
                        data.bedCount, data.bathroomCount, data.maxGuest, data.priceByNight
                    ).then((response)=>{console.log(response);
                        return res.status(200).json({data: {
                            id: newId,
                            user_id: data.userId,
                            first_name: data.firstName,
                            last_name: data.lastName,
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
            repo.putListing(id,
                data.userId, data.name, data.description, data.propertyType,
                data.roomType, data.address, data.latitude, data.longitude, data.bedCount,
                data.bathroomCount, data.maxGuest, data.priceByNight)
            .then((data)=>{ 
                res.status(200).json({data:listing})  
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
            repo.deleteListing(req.params.listingId)
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
        repo.getReviews(req.params.listingId)
        .then((response)=>{return res.status(200).json({
            data: response
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    getReview: (req,res) =>{
        repo.getReview(req.params.listingId, req.params.reviewId)
        .then((response)=>{return res.status(200).json({
            data: response
        })})
        .catch(()=>{return res.status(404).json({
            error: {
                message: "Internal server error"
            }
        })});
    },
    postReview: (req,res) =>{
        const data = req.body
        var newId = shortId.generate();
        new Promise((resolve,reject)=>{
            if(data.listingId && data.userId && data.ratingNum && data.bookingId){
                const review = {
                    id: newId,
                    user_id:data.userId,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    listing_id: data.listingId,
                    rating_num: data.ratingNum,
                    content: data.content,
                    booking_id:data.bookingId,
                };
                repo.postReview(newId, data.userId, data.firstName, data.lastName,data.listingId, data.bookingId, data.ratingNum, data.content)
                .then(()=>{
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
            repo.deleteReview(req.params.reviewId)
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
    getLImages: (req,res)=>{
        repo.getLImages(req.params.listingId)
        .then((response)=>{return res.status(200).json({
            data: response
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
                            message: "Internal server error3"
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
                        console.log("files",files);
                        console.log(req.body.listingId);
                        const filesLength = req.files.length;
                        const listingId = req.body.listingId;
                        const uploadedBy = req.body.uploadedBy;
                        repo.postLImages(files,filesLength, listingId, uploadedBy)
                        .then((response)=>{
                            res.status(200).json({data: response})
                        })
                        .catch(()=>{
                            res.status(404).json({
                                error:{
                                    message: "Internal server error1."
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
                    message: "Internal server error2."
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
module.exports = controller;
