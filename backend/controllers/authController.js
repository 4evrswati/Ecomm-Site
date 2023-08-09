const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../helper/authHelper');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const {name, email, password, mobile, address, answer} = req.body;

        if(!name || !email || !password || !mobile || !address || !answer)
        {
            return res.status(403).send({message: 'Provide complete details'})
        }

        const user = await User.findOne({ email });

        if(user) 
        {
            return res.status(400).send({
                success: false,
                message: "Email id already exists"});
        }

        const hashedPassword = await hashPassword(password);
        const userData = {name, email, password: hashedPassword, mobile, address, answer};
        const newUser = await User.create(userData);
        const userToReturn = {...newUser.toJSON()};

        return res.status(200).send({
            success: true,
            message: 'User Register Successfully',
            userToReturn
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
        });
    }
}

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(403).send({
                success: false,
                message: 'Provide complete details'})
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).send({
                success: false,
                message: "Email is not registered"});
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if(!isPasswordValid) {
            return res.status(403).send({
                success: false,
                message: "Invalid password"});
        }

        //token create
        const token = await jwt.sign({_id: user._id }, process.env.JWT_SECRET, {expiresIn: '7d'});

        const userToReturn = {...user.toJSON()};
        delete userToReturn.password;

        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            userToReturn,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
}

//forgotPasswordController
const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body

        if(!email || !answer || !newPassword) {
            return res.status(400).send({message: 'Provide complete details'})
        }

        const user = await User.findOne({ email, answer })

        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Password'
            })
        }

        const hashed = await hashPassword(newPassword)
        
        await User.findByIdAndUpdate(user._id, {password: hashed});

        return res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

const testController = (req, res) => {
    try {
        res.send('Protected Routes');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createUser, loginController, forgotPasswordController, testController}; 