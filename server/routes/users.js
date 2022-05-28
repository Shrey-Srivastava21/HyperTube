const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
var sanitize = require('mongo-sanitize');
// const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer');
const config = require("./../config/key");
const google = require('googleapis');

const oAuth2Client = new google.Auth.OAuth2Client()
oAuth2Client.setCredentials({refresh_token: config.Oauth_Refresh_Token});

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {
    User.find({
        $or: [{ "username": req.body.username }, { "email": req.body.email }]
    }, (err, user) => {
        if (err) {
            return (res.status(400).send(err));
        } else if (user.length === 0) {
            const user = new User(sanitize(req.body));

            user.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({
                    success: true
                });
            });
        } else {
            return res.json({ success: false, err: "Email or username already used !" });
        }
    });
});

router.post("/update", auth, (req, res) => {
    let imgURL = req.body.image === "" ? req.user.image : sanitize(req.body.image);

    User.find({
        "_id": {$ne: req.user._id},
        $or : [{"username" : req.body.username}, {"email" : req.body.email}]
    }, (err, user) => {
        if (err) {
            return (res.status(400).send(err));
        } else if (user.length === 1) {
            return res.json({ success: false, err: "Email or username already used !" });
        } else {
            User.findOneAndUpdate({ _id: req.user._id },
                {
                    $set: {
                        email: sanitize(req.body.email),
                        username: sanitize(req.body.username),
                        firstName: sanitize(req.body.firstName),
                        lastName: sanitize(req.body.lastName),
                        image: imgURL
                    }
                },
                (err, doc) => {
                    if (err) return res.json({ success: false, err });
                    return res.status(200).send({
                        success: true, doc
                    });
            });
        }
    });
});

router.post("/updatePassword", auth, async (req, res) => {

    let errors = {
        password: false,
        password_confirm: false
    };
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user) {

            let password = sanitize(req.body.password);
            let password_confirm = sanitize(req.body.password_confirm);
            if (!errors.password && !errors.password_confirm) {
                user.password = password
                // user.password_confirm = password_confirm
                user.save();
                return res.status(200).json({});
            }
            else
                throw new Error('Error password');
        } else
            throw new Error('Token not find');
    } catch (err) {
        console.log(err);
        if (errors.password || errors.password_confirm)
            return res.status(400).json({ errors: errors });
        return res.status(400).json({});
    }
});

router.post('/reset/:token', async (req, res) => {
    let errors = {
        password: false,
        password_confirm: false
    };
    try {
        const token = sanitize(req.body.tokenConf);
        console.log(token)
        const user = await User.findOne({ tokenConf: token });
        if (user) {
            // check if the entries are valid

            let password = sanitize(req.body.password);
            let password_confirm = sanitize(req.body.password_confirm);
            // if (password && !schema.validate(password))
            //     errors.password = "Password must contain at least one uppercase, one number and one symbol, and at least 8 characters."
            // if (password && password_confirm && !Validator.equals(password, password_confirm))
            //     errors.password_confirm = "Passwords must match";
            if (!errors.password && !errors.password_confirm) {
                user.password = password
                user.save();
                return res.status(200).json({});
            }
            else
                throw new Error('Error password');
        } else
            throw new Error('Token not find');
    } catch (err) {
        console.log(err);
        if (errors.password || errors.password_confirm)
            return res.status(400).json({ errors: errors });
        return res.status(400).json({});
    }
});

router.get('/confirmation/:tokenConf', function (req, res) {

    var token = req.params.tokenConf;

    try {

        User.findOne({ tokenConf: token })
            .exec(function (err, user) {

                if (err) throw new Error("error find one")

                else if (!user) throw new Error("error user not find")

                else {
                    user.token_mail = true;
                    user.save(function (update_err, update_data) {
                        if (update_err) throw new Error("error save update")
                        else {
                            console.log("token mail is true  " + update_data._id);
                            return res.status(200).json({});
                        }
                    });
                }
            });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({});
    }

});

router.post("/login", (req, res) => {
    User.findOne({ username: sanitize(req.body.username) }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, username not found"
            });

        user.comparePassword(sanitize(req.body.password), (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.CheckTokenMail(sanitize(req.body.username), (err, tokenfind) => {
                console.log("the mail is confirmed :", tokenfind)
                if (!tokenfind)
                    return res.json({ loginSuccess: false, message: "thx to check your email" });
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    res.cookie("w_authExp", user.tokenExp);
                    res
                        .cookie("w_auth", user.token, { maxAge: 2 * 60 * 60 * 1000, secure: true, sameSite: "none", httpOnly: false })
                        .status(200)
                        .json({
                            loginSuccess: true, userId: user._id
                        });
                });
            });
        });
    });
});

router.post('/forgotPassword', async (req, res) => {

    // const { errors, isValid } = validateResetSend(req.body);
    // Check validation
    // if (!isValid)
    //     return res.status(400).json(errors);

    try {
        // const accessToken = await oAuth2Client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'OAuth2',
                user: config.mail, // generated user
                clientId: config.Oauth_Client_Id,
                clientSecret: config.Oauth_Client_Secret,
                refreshToken: config.Oauth_Refresh_Token,
                accessToken: config.accessToken
            },
        });

        console.log("TEST 1 " + req.body.email)
        const email = sanitize(req.body.email);
        const user = await User.findOne({ email: email });
        if (user) {
            console.log("TEST 2")
            const server = email.server.connect({
                user: `${config.mail}`,
                password: `${config.password}`,
                host: 'smtp.gmail.com',
                ssl: true,
            });      

            let info = await transporter.sendMail({
                from: 'Hypertube', // sender address
                to: sanitize(user.email), // list of receivers
                subject: "HYPERTUBE 🎬 | Registration confirmation", // Subject line
                text: `https://moviemain.herokuapp.com/confirmation/${user.tokenConf}`, // plain text body
                html: `<html>
                <body>
                    <center>
                        <h3 
                            style="
                                padding-top: 30px;
                                padding-bottom: 10px;
                                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;"
                        >
                        Hi ${user.username},
                        <br/>
                            You have just requested a password reset.
                            <br/>                            
                            Please click on the button below to create a new password:
                        </h3>
                        <br/>
                        <a 
                            href="https://moviemain.herokuapp.com/confirmation/ResetPassword/Reset/${hashtoken}" 
                            style="
                                background-color: rgb(25, 186, 144);
                                padding: 15px 20px;
                                font-size: 0.875rem;
                                border-radius: 3px; 
                                color: white;
                                font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
                                font-weight: 500;
                                line-height: 1.75;
                                letter-spacing: 0.02857em;
                                text-transform: uppercase;
                                text-decoration: none;
                                margin-top: 50px;
                                margin-bottom: 50px"
                        >
                            Reset password
                        </a>
                        <br /><br /><br />
                        <small>This email is automatic, please do not answer it.</small>
                    </center>
                </body>
            </html>`, // html body
            });
            
            // send the message and get a callback with an error or details of the message that was sent
            server.send(message, function(err, message) { console.log(err || message); });
        }
        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        console.log(5);
        return res.status(400).json({});
    }
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

//Get All users
router.get("/getUsers", auth, async (req, res) => {
    await User.find()
        .exec((err, users) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, users })
        });
});

//Get a specific user, don't forget to add auth to access it
router.get('/:userId', auth, async (req, res) => {
    User.find({ _id: req.user._id })
        .exec((err, users) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, users })
        })
});

module.exports = router;