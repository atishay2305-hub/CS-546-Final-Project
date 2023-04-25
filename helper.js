//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

const exportedMethods = {
    checkLegitName(name, valName) {
        if (!name) throw `${valName} not provided`;
        if (typeof name !== "string" || name.trim().length === 0) throw `Please provide a valid input of ${valName}`
        name = name.trim();
        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(name)) throw `${valName} must be only contain character a-z and A-Z`;
        if (name.length < 2)
            throw `${valName} length must greater than 2 words`;
        if (name.length > 25)
            throw `${valName} length must less than 25 words`;
        return name;
    },

    checkEmail(email) {
        if (!email) throw "Please provide email";
        if (typeof email !== "string" || email.trim().length <= 0) throw "Please provide a valid email";
        email = email.trim().toLowerCase();
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(email)) {
            throw "Email address should contain only letters, numbers, and common special symbols !#$%&'*+\\-/=?^_`{|} before the @ character"
        }

        return email;
    },

    checkPassword(password) {
        if (!password) throw "Password not provided";
        if (typeof password !== "string") throw "Password must be a string!";
        password = password.trim();
        if (password.length < 8 ) throw "Password must be at least 8 characters";
        const spaceRegex = /\s/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (spaceRegex.test(password)) throw "Password must not contain whitespace";
        if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character";
        return password;
    },



    checkRole(role){
        if(!role) throw "Role not provided";
        if(typeof role !== "string") throw "Role must be a string!";
        role = role.trim().toLowerCase();
        if(role !== "admin" && role!== "user"){
            throw "Invalid role, please enter either 'admin' or 'user'"
        }
        return role;
    }
}

export default exportedMethods;