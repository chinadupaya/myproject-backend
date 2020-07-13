var express = require('express');
var router = express.Router();
const controller = require('../controllers/main.controller');
//const multer = require('multer');
//const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    data:{
      message: "This is a health check"
    }
  })
  //res.render('index', { title: 'health check.' });
});

/* var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 
var upload = multer({ storage: storage }) */

router.get('/form',function(req,res){
  res.render('uploadForm', { title: 'Health Check'});
});

//users
router.get('/users', controller.getUsers);
router.get('/users/:userId',controller.getUser);
router.post('/users',controller.postUser);
router.delete('/users/:userId',controller.deleteUser);
router.put('/users/:userId',controller.putUser);
//bookings
router.get('/bookings', controller.getBookings);
router.get('/bookings/:bookingId',controller.getBooking);
router.post('/bookings',controller.postBooking);
router.delete('/bookings/:bookingId',controller.deleteBooking);
router.put('/bookings/:bookingId',controller.putBooking);
//reviews
router.get('/listings/:listingId/reviews', controller.getReviews);
router.get('/listings/:listingId/reviews/:reviewId',controller.getReview);
router.post('/listings/:listingId/reviews',controller.postReview);
router.delete('/listings/:listingId/reviews/:reviewId',controller.deleteReview);
//listings
router.get('/listings', controller.getListings);
router.get('/listings/:listingId',controller.getListing);
router.post('/listings',controller.postListing);
router.delete('/listings/:listingId',controller.deleteListing);
router.put('/listings/:listingId',controller.putListing);
//amenities
router.get('/amenities', controller.getAmenities);
router.get('/amenities/:amenityId',controller.getAmenity);
router.post('/amenities',controller.postTestAmenity);
router.delete('/amenities/:amenityId',controller.deleteAmenity);
router.put('/amenities/:amenityId',controller.putAmenity);
//listing amenities
router.get('/listings/:listingId/amenities', controller.getLAmenities);
router.get('/listings/:listingId/amenities/:lAmenityId',controller.getLAmenity);
router.post('/listings/:listingId/amenities',controller.postLAmenity);
router.delete('/listings/:listingId/amenities/:lAmenityId',controller.deleteLAmenity);
router.put('/listings/:listingId/amenities/:lAmenityId',controller.putLAmenity);
//listing images
router.get('/listings/:listingId/images',controller.getLImages);
router.get('/listings/:listingId/images/:lImageId',controller.getLImage);
router.post('/listings/:listingId/images'/* , upload.array("listingImages",4) */,controller.postLImage);
router.delete('/listings/:listingId/images/:lImageId', controller.deleteLImage);

//test
router.post('/uploadAmenity'/* , upload.single('imageupload') */,controller.postTestAmenity);

module.exports = router;

