import {users} from '../config/mongoCollections.js';
import {inputvalidation} from '../helpers.js';
import {ObjectId} from 'mongodb';
import validation from './validationchecker.js';

export const addUser = async (
    firstname,
    lastname,
    email,
    hashPassword,
    dob,
    department
  ) => {
    firstname = validation.checkString(firstname, 'First name');
    lastname = validation.checkString(lastname, 'Last name');
    email = validation.checkString(email, 'email');
    hashPassword = validation.checkString(hashPassword, 'Password');
    dob = validation.checkString(dob, 'date of birth');
    department = validation.checkString(department, 'department');
    validation.emailValidation(email);
    
    let newUser = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        hashPassword: hashPassword,
        dob: dob,
        department: department
        
    };
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return 'User added successfully';
}

