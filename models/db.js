//make Camelcase

let users = [
  {
    id: '1',
    email: 'robwie@email.com',
    firstName: 'Robin',
    lastName: 'Wieruch',
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0,),
  },
  {
    id: '2',
    email: 'dddd@email.com',
    firstName: 'Dave Davids',
    lastName: 'Davidsssss',
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0,),
  },
];
let listings = [
  {
    id: '1',
    name: 'Hello World',
    description: 'best place ever xoxo',
    propertyType: 'Bungalow',
    roomType: 'Shared',
    address: '166 FloorIT street',
    latitude: 14.676041,
    longitude: 121.043701,
    bedCount: 3,
    bathroomCount: 1,
    maxGuest: 5,
    priceByNight: 1050,
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id: '2',
    name: 'Bye World',
    description: 'worst place dont go here',
    propertyType: 'House',
    roomType: 'Entire Place',
    address: '32A Mahusay Street',
    latitude: 32.318230,
    longitude: -86.902298,
    bedCount: 0,
    bathroomCount: 0,
    maxGuest: 1,
    priceByNight: 9999.99,
    userId: '2',
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
];
let reviews = [
  {
    id: '1',
    userId: "1",
    listingId: "1",
    ratingNum: 4,
    content: "SO!!! AMAZING!!! I LOVE THIS PLACE",
    bookingId: "1",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id: '2',
    userId: "2",
    listingId: "2",
    ratingNum: 1,
    content: "SO HORRIBLE NEVER COMING HERE AGAIN!!1!",
    bookingId: "2",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
];
let bookings = [
  {
    id: '1',
    startDate: new Date(2020,2,2,0,0,0),
    endDate: new Date(2020,3,3,0,0,0,0),
    isApproved: 0,
    userId: "1",
    listingId: "1",
    pricePerDay: 200.00,
    priceForStay: 3100.00,
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id: '2',
    startDate: new Date(2020,2,2,0,0,0),
    endDate: new Date(2020,3,3,0,0,0,0),
    isApproved: 1,
    userId: "2",
    listingId: "2",
    pricePerDay: 250.00,
    priceForStay: 3250.00,
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
];
let amenities = [
  {
    id:"1",
    name:"Air conditioning",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"2",
    name:"Hangers",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"3",
    name:"Iron",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"4",
    name:"Washer",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"5",
    name:"Dryer",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  }
]
let lImages = [
  { 
    id:"1",
    listingId: "1",
    listingImage:{},
    uploadedBy:"1",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  }

]
let lAmenities = [
  {
    id:"1",
    listingId: "1",
    amenityId: "3",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"2",
    listingId: "1",
    amenityId: "4",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  },
  {
    id:"3",
    listingId: "2",
    amenityId: "2",
    createdAt: new Date(),
    updatedAt: new Date(1990,1,1,0,0,0,0)
  }
]

module.exports = {
    listings,
    users,
    reviews,
    bookings,
    amenities,
    lAmenities,
    lImages
}