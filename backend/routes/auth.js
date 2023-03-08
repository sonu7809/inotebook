const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require ('../middleware/fetchuser')

const JWT_SECRET = "Somu7809";

// Route:1
//Create a user using "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    //if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check if the user with this email already exist
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        secpass= await bcrypt.hash(req.body.password,salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        });
        const data = {
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET)
        res.json({authtoken})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})

// Route:2
//Authenticate a user using post "api/auth/login". No login required
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password','password cannot be blank').exists()
], async (req, res) => {
    //if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    const{email , password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error : "Please try to login with correct credentials"})
        }
        const passwordcompare = await bcrypt.compare(password,user.password);
        if(!passwordcompare){
            return res.status(400).json({error : "Please try to login with correct credentials"})
        }

        const data ={
            user:{
                id:user.id
            }

        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        res.json({authtoken})

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

});

// Route:3
//Get loggedin User Details using: Post "api/auth/getuser".login required
router.post('/getuser',fetchuser ,async (req, res) => {

try {
    userId =req.user.id;
    const user = await User.findById(userId).select('-password')
    res.send(user)

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal srever Error")
    
}

})
module.exports = router

