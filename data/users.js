import {users} from '../config/mongoCollections.js';
import {inputvalidation} from '../helpers.js';
import {ObjectId} from 'mongodb';

export const create = async (
    firstname,
    lastname,
    email,
    hashPassword,
    dob,
    department
  ) => {
    if(!firstname || !lastname || !email || !hashPassword || !dob || !department ) throw new Error('All fields need to have valid values');
    let validationarr = [
        {inputname:'firstname',value:firstname,checktype:'string'},
        {inputname:'lastname',value:lastname,checktype:'string'},
        {inputname:'email',value:email,checktype:'string'},
        {inputname:'hashPassword',value:hashPassword,checktype:'string'},
        {inputname:'dob',value:dob,checktype:'date'},
        {inputname:'department',value:department,checktype:'string'},
    ]
    inputvalidation(validationarr);
    const validateEmail = email => /^[^@ ]+@[^@ ]+\.[^@ \.]+$/.test(email);


  }