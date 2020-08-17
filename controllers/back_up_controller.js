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