import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData, userData} from './data/index.js';


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const userOne = {
        firstName: "Emma",
        lastName: "Smith",
        userName: "PixelPenguin22",
        email: "emma.smith@stevens.edu",
        password: "Kt9J$y#h@Lm",
        DOB: "2001-06-23",
        role:"admin",
        authentication: "Get privilege",
        department:"computer science"
    };

    const userTwo = {
        firstName: "Michael",
        lastName: "Johnson",
        userName: "MysticMeadow98",
        email: "michael.johnson@stevens.edu",
        password: "G^vP3%wNq8c",
        DOB: "2000-07-11",
        role:"user",
        department:"computer science"
    };

    const userThree = {
        firstName: "Avery",
        lastName: "Davis",
        userName: "RainbowRider77",
        email: "avery.davis@stevens.edu",
        password: "bR#f2Q9Xt@j",
        DOB: "2002-12-03",
        role:"user",
        department: "mathematical sciences"
    };

    const userFour = {
        firstName: "Olivia",
        lastName: "Brown",
        userName: "ElectricEagle91",
        email: "olivia.brown@stevens.edu",
        password: "Ym7Tn@p$Bx8",
        DOB: "2001-08-07",
        role:"user",
        department:"chemistry and chemical biology"
    };

    const userFive = {
        firstName: "Ethan",
        lastName: "Wilson",
        userName: "CosmicCactus13",
        email: "ethan.wilson@stevens.edu",
        password: "Lk6&z$F#d9s",
        DOB: "2002-01-04",
        role:"user",
        department:"mechanical engineering"
    };
    const userSix = {
        firstName: "shane",
        lastName: "Watson",
        userName: "Cosmi13",
        email: "shane.watson@stevens.edu",
        password: "Lk6&z$Fhj9s",
        DOB: "2005-05-04",
        role:"admin",
        department:"mechanical engineering"
    };

    const eventOne = {
        userId: "200456231",
        eventName: "Spring Fling Festival",
        description: "A celebration of the arrival of spring, featuring live music, food trucks, and carnival games",
        buildingName: "Carnegie Laboratory",
        organizer: "Stevens Student Government Association",
        seatingCapacity: 100
    };

    const eventTwo = {
        userId: "20045d121",
        eventName: "Innovation Summit",
        description: "A conference bringing together experts in the fields of technology and entrepreneurship to share insights and ideas.",
        buildingName: "Babbio Center for Technology Management",
        organizer: "Stevens School of Business",
        seatingCapacity: 200,
    };

    const eventThree = {
        userId: "200412361",
        eventName: " Halloween Bash",
        description: " A costume party with music, dancing, and refreshments.",
        buildingName: "Walker Gymnasium",
        organizer: "Stevens Residence Life",
        seatingCapacity: 500
    };

    const eventFour = {
        userId: "200412661",
        eventName: "Career Fair",
        description: "An opportunity for students to network with employers and explore job and internship opportunities.",
        buildingName: "Burchard Building",
        organizer: "Stevens Career Center",
        seatingCapacity: 1000
    };
    const eventFive = {
        userId: "200411661",
        eventName: "Musician Showcase",
        description: "An evening of live music featuring local bands and solo artists.",
        buildingName: "Gatehouse",
        organizer: " Stevens Music Society",
        seatingCapacity: 200
    };
    const eventSix = {
        userId: "200411661",
        eventName: "Magic Show",
        description: "To entertain you with some intersting magic tricks.",
        buildingName: "Babbio Center",
        organizer: " Stevens Cultural Society",
        seatingCapacity: 100
    };

    let userId1 = undefined;
    let userId2 = undefined;
    let userId3 = undefined;
    let userId4 = undefined;
    let userId5 = undefined;
    let userId6 = undefined;
    try {
        const user1 = await userData.createUser(userOne.firstName, userOne.lastName,
            userOne.userName, userOne.email, userOne.password, userOne.DOB, userOne.role,userOne.department, userOne.authentication);
        const user2 = await userData.createUser(userTwo.firstName, userTwo.lastName, userTwo.userName, userTwo.email,
            userTwo.password, userTwo.DOB, userTwo.role,userTwo.department, userTwo.authentication);
        const user3 = await userData.createUser(userThree.firstName, userThree.lastName, userThree.userName, userThree.email,
            userThree.password, userThree.DOB, userThree.role,userThree.department, userThree.authentication);
        const user4 =  await userData.createUser(userFour.firstName, userFour.lastName, userFour.userName, userFour.email,
            userFour.password, userFour.DOB, userFour.role,userFour.department, userFour.authentication);
        const user5 = await userData.createUser(userFive.firstName, userFive.lastName, userFive.userName, userFive.email,
            userFive.password, userFive.DOB, userFive.role,userFive.department, userFive.authentication);
        const user6 = await userData.createUser(userSix.firstName, userSix.lastName, userSix.userName, userSix.email,
            userSix.password, userSix.DOB, userSix.role,userSix.department, userSix.authentication);

        userId1 = user1.userID;
        userId2 = user2.userID;
        userId3 = user3.userID;
        userId4 = user4.userID;
        userId5 = user5.userID;
        userId6 = user6.userID;



    } catch (e) {
        console.log(e);
    }

    try{
        const event1 = await eventsData.createEvent(userId1 ,eventOne.eventName,
            eventOne.description, eventOne.buildingName, eventOne.organizer, eventOne.seatingCapacity);
        const event2 = await eventsData.createEvent(userId2 , eventTwo.eventName, eventTwo.description,
            eventTwo.buildingName, eventTwo.organizer, eventTwo.seatingCapacity);
        const event3 = await eventsData.createEvent(userId3, eventThree.eventName, eventThree.description,
            eventThree.buildingName, eventThree.organizer, eventThree.seatingCapacity);
        const event4 = await eventsData.createEvent(userId3, eventFour.eventName, eventFour.description,
            eventFour.buildingName, eventFour.organizer, eventFour.seatingCapacity);
        const event5 = await eventsData.createEvent(userId4, eventFive.eventName, eventFive.description,
            eventFive.buildingName, eventFive.organizer, eventFive.seatingCapacity);
            const event6 = await eventsData.createEvent(userId6, eventSix.eventName, eventSix.description,
                eventSix.buildingName, eventSix.organizer, eventSix.seatingCapacity);
    }catch (e){
        console.log(e);
    }
    // try{
    //     const user1 = await userData.putPost()
    //
    // }catch (e){
    //     console.log(e);
    // }

    console.log("Done");
    await closeConnection();
}

import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData, userData,commentData} from './data/index.js';

const db= await dbConnection();

//const userFive = {
    //     firstName: "Ethan",
    //     lastName: "Wilson",
    //     userName: "CosmicCactus13",
    //     email: "ethan.wilson@stevens.edu",
    //     password: "Lk6&z$F#d9s",
    //     DOB: "04-01-2002",
    // };

// try{
// const user = await userData.removeUserById('643f041e0639d003d498816b');
// console.log(user);
// }catch(e){
//     console.log(e);
// }

// try{
// const comment = await commentData.createComment('643f3edec2137a9db93c1d5b',"6446f36afda8b12b0452adf7", "6442269732b1e3c891419771", "PixelPenguin22", "Hello how are you?");
// console.log(comment);
// }catch(e){
//     console.log(e);
// }

// try {
//     const getAllComments = await commentData.getAllComments();
//     console.log(getAllComments)
// } catch (error){
//     console.log(error)
// }

try {
    const getAllComments = await commentData.getEventCommentById("6446f48cef0f7537b23018d9");
    console.log(getAllComments)
} catch (error){
    console.log(error)
}

/*try{
    const comment = await commentData.removeComment('643f07dee2ef68b3316eed1e');
    console.log(comment);
    }catch(e){
        console.log(e);
    }
    /*try{
        const comment = await commentData.removeComment('643f06ffcf44f9e76f9945d3');
        console.log(comment);
        }catch(e){
            console.log(e);
        }*/
    
// try{
//     const comment = await commentData.removeCommentById('6448a76c745f1f47ad126786');
//     console.log(comment);
// }catch(e){
//         console.log(e);
// }

import eventsData from "./data/events.js";

// try {
//     let something = await eventsData.createEvent("6441e06cf0917340bd02623c", "something", "lieb building", "lieb building", "Atishay Jain", 5)
//     console.log(something);

// } catch(error){
//     console.log(error)
// }

try {
    let something = await eventsData.searchEvent("Updated")
    console.log(something);

} catch(error){
    console.log(error)
}

// try {
//     let something = await eventsData.getEventByID("6442e7e7b9f2f13914c32dc3")
//     console.log(something);

// } catch(error){
//     console.log(error)
// }

// try {
//     let something = await eventsData.removeEventById("6442e7e7b9f2f13914c32dc3")
//     console.log(something);

// } catch(error){
//     console.log(error)
// }



// try {
//     let something = await eventsData.updateEvent("64420396072af37a3c258e2f", "Updated event", "SOmething has been updated", "Building name has been updated", "Atishay", 10)
//     console.log(something);

// } catch(error){
//     console.log(error)
// }

import postsData from "./data/posts.js"

try {
    let postDataCreation = await postsData.createPost("sports", "")
    console.log(postDataCreation)
} catch(error){
    console.log(error);
}

// try {
//     let postDataCreation = await postsData.getAllPost();
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

// try {
//     let postDataCreation = await postsData.getPostById("644220a379e865daab28c4f4");
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

// try {
//     let postDataCreation = await postsData.removePostById("644220a379e865daab28c4f4");
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

// try {
//     let postDataCreation = await postsData.updatePost("6442269732b1e3c891419771", "dancing", "Zumba", "Random");
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }




import usersData from "./data/users.js";

// try {
//     let creatingUser = await usersData.updateUser("Atishay", "Jain", "atishay23", "ajainz20@stevens.edu", "Test@1234#", "1999-05-23", "user", "computer science")
//     console.log(creatingUser)
    
// } catch(error){
//     console.log(error)
// }

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



main();

await closeConnection();