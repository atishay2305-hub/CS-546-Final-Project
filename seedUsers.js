import usersData from "./data/users.js";

try {
    let creatingUser = await usersData.createUser("Atishay", "Jainz", "lenovo233a36", "Test6a69@stevens.edu", "Test12345#", "2023-15-11", "user", "Computer Science")
    console.log(creatingUser)
    
} catch(error){
    console.log(error)
}

const allowedDepartment = [
    "biomedical engineering", "chemistry and chemical biology", "chemical engineering and materials science",
   "civil, environmental and ocean engineering", "computer science", "electrical and computer engineering",
   "mathematical sciences", "mechanical engineering", "physics"
];



// try {
//     let creatingUser = await usersData.createUser("Atishay", "Jain", "atishay234", "ajain706@stevens.edu", "Test@1234#", "1999-05-23", "user", "computer science")
//     console.log(creatingUser)
    
// } catch(error){
//     console.log(error)
// }



// // try {
// //     let creatingUser = await usersData.getUserByEmail("ajain70@stevens.edu")
// //     console.log(creatingUser)
    
// // } catch(error){
// //     console.log(error)
// // }

// try {
//     let creatingUser = await usersData.checkUser("atishay23", "ajain70@stevens.edu")
//     console.log(creatingUser)
    
// } catch(error){
//     console.log(error)
// }