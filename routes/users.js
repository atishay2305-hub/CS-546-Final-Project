import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import validation from '../validationchecker.js';

router
  .route('/')
  .post(async (req, res) => {

    try{
        const {firstname,lastname,email,hashPassword,dob,department} = req.body;
        try{
            firstname = validation.checkString(firstname, 'First name');
            lastname = validation.checkString(lastname, 'Last name');
            email = validation.checkString(email, 'email');
            hashPassword = validation.checkString(hashPassword, 'Password');
            dob = validation.checkString(dob, 'date of birth');
            department = validation.checkString(department, 'department');
            validation.emailValidation(email);
        }catch(e){
            res.status(400).send(e); 
        }
        const updateduser = await userData.updateUser(firstname,lastname,email,hashPassword,dob,department);
        return res.json(updateduser);
    }catch(e){
        res.status(500).send(e); 
    }
  })
  .put(async (req, res) => {
    // Not implemented
    try{
        
        const {firstname,lastname,email,hashPassword,dob,department} = req.body;
        try{
            firstname = validation.checkString(firstname, 'First name');
            lastname = validation.checkString(lastname, 'Last name');
            email = validation.checkString(email, 'email');
            hashPassword = validation.checkString(hashPassword, 'Password');
            dob = validation.checkString(dob, 'date of birth');
            department = validation.checkString(department, 'department');
            validation.emailValidation(email);
        }catch(e){
            res.status(400).send(e); 
        }
        const newuser = await userData.addUser(firstname,lastname,email,hashPassword,dob,department);
        return res.json(newuser);
    }catch(e){
        res.status(500).send(e); 
    }
  });

router
  .route('/login')
  .post(async (req, res) => {
    
    try{
        
        const {email,password} = req.body;
        try{
            email = validation.checkString(email, 'email');
            password = validation.checkString(password, 'Password');
            validation.emailValidation(email);
        }catch(e){
            res.status(400).send(e); 
        }
        const updateduser = await userData.getUser(email,password);
        return res.json(updateduser);
    }catch(e){
        res.status(500).send(e); 
    }
  });
  
export default router;