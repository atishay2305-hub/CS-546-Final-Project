import {users} from '../config/mongoCollections.js';
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

};

export const updateUser = async (
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
    
    var newvalues = { $set: {
        firstName: firstname,
        lastName: lastname,
        email: email,
        hashPassword: hashPassword,
        dob: dob,
        department: department
    } };
    const userCollection = await users();
    await userCollection.updateOne({email:email},newvalues);
    return 'User details updated  successfully';

};

export const getUser = async (email,password) => {
    email = validation.checkString(email, 'email');
    password = validation.checkString(password, 'Password');
    
    const userCollection = await users();
    const user = await userCollection.findOne({email:email});
    if (!user) throw 'Error: User not found'; //check password as well
    return user;
    
    
};
