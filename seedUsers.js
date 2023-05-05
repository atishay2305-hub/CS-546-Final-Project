import usersData from "./data/users.js";

try {
    let creatingUser = await usersData.createUser("Atishay", "Jain", "atishay23", "ajainz20@stevens.edu", "Test@1234#", "1999-05-23", "user", "computer science")
    console.log(creatingUser)
    
} catch(error){
    console.log(error)
}

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