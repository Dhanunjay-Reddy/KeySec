const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../keys');
const requirelogin = require('../middleware/requirelogin');

router.get('/', requirelogin, (req, res) => {
  res.send('Hello User!');
});

router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  if (!name || !email || !password || !confirmPassword) {
    return res.status(422).json({ error: 'Please enter all required fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ error: 'Passwords do not match.' });
  }

  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User with that email already exists.' });
      }

      bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email,
          name,
          password: hashedPassword,
        });

        newUser
          .save()
          .then((user) => {
            console.log('user saved successfully')
            res.json({ message: 'User registered successfully.' });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Server error occurred.' });
          });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Server error occurred.' });
    });
});




router.post('/signin', (req,res) =>{
    const {email, password} = req.body;
    if (!email || !password){
        res.status(401).json({error: "Please enter all the required fields"})
    }else{
        User.findOne({email:email})
        .then((saveduser)=>{
            if (!saveduser){
                res.status(422).json({error: "User not registered. Please check your email and password"})
            }else{
                bcrypt.compare(password, saveduser.password)
                .then((doMatch)=>{
                    if(doMatch){
                        // res.json({success:"Signed in successfully"});
                        const token = jwt.sign({_id:saveduser._id}, JWTSECRET)
                        res.json({token:token})
                    }else{
                        res.json({InvalidCredentials:"Entered Invalid credentials"})                    }
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

})
module.exports = router;