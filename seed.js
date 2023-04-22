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
        DOB: "06-23-2001",
        isAdmin: true,
        authentication: "Get privilege"
    };

    const userTwo = {
        firstName: "Michael",
        lastName: "Johnson",
        userName: "MysticMeadow98",
        email: "michael.johnson@stevens.edu",
        password: "G^vP3%wNq8c",
        DOB: "11-07-2000",
    };

    const userThree = {
        firstName: "Avery",
        lastName: "Davis",
        userName: "RainbowRider77",
        email: "avery.davis@stevens.edu",
        password: "bR#f2Q9Xt@j",
        DOB: "03-12-2002",
    };

    const userFour = {
        firstName: "Olivia",
        lastName: "Brown",
        userName: "ElectricEagle91",
        email: "olivia.brown@stevens.edu",
        password: "Ym7Tn@p$Bx8",
        DOB: "07-19-2001",
    };

    const userFive = {
        firstName: "Ethan",
        lastName: "Wilson",
        userName: "CosmicCactus13",
        email: "ethan.wilson@stevens.edu",
        password: "Lk6&z$F#d9s",
        DOB: "04-01-2002",
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

    let userId1 = undefined;
    let userId2 = undefined;
    let userId3 = undefined;
    let userId4 = undefined;
    let userId5 = undefined;

    try {
        const user1 = await userData.createUser(userOne.firstName, userOne.lastName,
            userOne.userName, userOne.email, userOne.password, userOne.DOB, userOne.isAdmin, userOne.authentication);
        const user2 = await userData.createUser(userTwo.firstName, userTwo.lastName, userTwo.userName, userTwo.email,
            userTwo.password, userTwo.DOB, userTwo.isAdmin, userTwo.authentication);
        const user3 = await userData.createUser(userThree.firstName, userThree.lastName, userThree.userName, userThree.email,
            userThree.password, userThree.DOB, userThree.isAdmin, userThree.authentication);
        const user4 =  await userData.createUser(userFour.firstName, userFour.lastName, userFour.userName, userFour.email,
            userFour.password, userFour.DOB, userFour.isAdmin, userFour.authentication);
        const user5 = await userData.createUser(userFive.firstName, userFive.lastName, userFive.userName, userFive.email,
            userFive.password, userFive.DOB, userFive.isAdmin, userFive.authentication);

        userId1 = user1.userID;
        userId2 = user2.userID;
        userId3 = user3.userID;
        userId4 = user4.userID;
        userId5 = user5.userID;




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



main();