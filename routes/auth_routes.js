//import express, express router as shown in lecture code
import Router from "express"

const router = Router();
import validator from "../helpers.js"
import {checkUser, createUser} from "../data/users.js"


router.route('/').get(async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
        } else if (req.session.user.role === 'user') {
            return res.redirect('/protected');
        }
    }else {
        res.redirect('/login');
    }
});

router
    .route('/register')
    .get(async (req, res) => {
        //code here for GET
        if (req.session.user) {
            if (req.session.user.role === 'admin') {
                 res.redirect('/admin');
            } else if (req.session.user.role === 'user') {
                 res.redirect('/protected');
            }
        }else {
            res.render('register', {title: "Register"});
        }
    })
    .post(async (req, res) => {
        //code here for POST
        let {
            firstNameInput,
            lastNameInput,
            emailAddressInput,
            passwordInput,
            confirmPasswordInput,
            roleInput
        } = req.body;
        try {
            firstNameInput = validator.checkLegitName(firstNameInput);
            lastNameInput = validator.checkLegitName(lastNameInput);
            emailAddressInput = validator.checkEmail(emailAddressInput);
            passwordInput = validator.checkPassword(passwordInput);
            confirmPasswordInput = validator.checkPassword(confirmPasswordInput);
            roleInput = validator.checkRole(roleInput);
            if (passwordInput !== confirmPasswordInput) throw "Passwords do not match";
        } catch (e) {
            return res.status(400).render('error', {title: "Error", message: e});
        }

        try {
            const user = await createUser(firstNameInput,
                lastNameInput,
                emailAddressInput,
                passwordInput,
                roleInput);
            if (user.insertedUser) {
                res.redirect('/login');
            }
        } catch (e) {
            return res.status(500).render('error', {title: "Error", message: "Internal Server Error"});
        }
    });

router
    .route('/login')
    .get(async (req, res) => {
        //code here for GET
        if(req.session.user){
            res.redirect('/');
        }
        req.method
        res.render('login', {title: "Log in"});
    })
    .post(async (req, res) => {
        //code here for POST
        let {emailAddressInput, passwordInput} = req.body;
        try {
            emailAddressInput = validator.checkEmail(emailAddressInput);
            passwordInput = validator.checkPassword(passwordInput);
            const user = await checkUser(emailAddressInput, passwordInput);
            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                role: user.role
            };
            if (user.role === "admin") {
                res.redirect('/admin');
            } else {
                res.redirect('/protected');
            }
        } catch (e) {
                return res.status(400).render('error', {
                    title: "Error",
                    message: e
                });
        }
    });

router.route('/protected').get(async (req, res) => {
    //code here for GET
    let isAdmin = false;
    if(req.session.user.role === "admin"){
        isAdmin = true;
    }
    res.render('protected', {
        title: "Protected",
        firstName: req.session.user.firstName,
        currentTime: new Date().toUTCString(),
        role: req.session.user.role,
        isAdmin: isAdmin
    });
});

router.route('/admin').get(async (req, res) => {
    //code here for GET
    if(!req.session.user){
        res.redirect('/login')
    }else if(req.session.user.role !== "admin"){
        return res.status(403).render('error', {
            title: "Error",
            message: "You do not have permission to view this page."
        });
    }
    res.render('admin', {
        title: "Admin",
        firstName: req.session.user.firstName,
        currentTime: new Date().toUTCString()
    })
});

router.route('/error').get(async (req, res) => {
    //code here for GET
    res.render('error', {message: ""});
});

router.route('/logout').get(async (req, res) => {
    //code here for GET
    res.clearCookie("AuthCookie");
    res.render('logout', {
        redirectUrl: '/'
    });
});

export default router;