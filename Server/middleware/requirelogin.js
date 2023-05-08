const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');



module.exports = (req, res, next)=>{
    const {authorization} =req.headers;
    if(!authorization){
        res.status(401).json({error:"You must be logged in"})
    }else{
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, JWTSECRET, (err, payload) => {
            if(err){
                res.status(401).json({error: "You must be logged in"})
            }else{
                const {_id}= payload;
                User.findById(_id).then(userdata => {
                    req.user = userdata;
            

                })

            }
            next()
        })
        
    }
   

}