import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData, userData} from './data/index.js';


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    // const userOne = {
    //     firstName: "Emma",
    //     lastName: "Smith",
    //     userName: "PixelPenguin22",
    //     email: "emma.smith@stevens.edu",
    //     password: "Kt9J$y#h@Lm",
    //     DOB: "06-23-2001",
    // };

    // const userTwo = {
    //     firstName: "Michael",
    //     lastName: "Johnson",
    //     userName: "MysticMeadow98",
    //     email: "michael.johnson@stevens.edu",
    //     password: "G^vP3%wNq8c",
    //     DOB: "11-07-2000",
    // };

    // const userThree = {
    //     firstName: "Avery",
    //     lastName: "Davis",
    //     userName: "RainbowRider77",
    //     email: "avery.davis@stevens.edu",
    //     password: "bR#f2Q9Xt@j",
    //     DOB: "03-12-2002",
    // };

    // const userFour = {
    //     firstName: "Olivia",
    //     lastName: "Brown",
    //     userName: "ElectricEagle91",
    //     email: "olivia.brown@stevens.edu",
    //     password: "Ym7Tn@p$Bx8",
    //     DOB: "07-19-2001",
    // };

    // const userFive = {
    //     firstName: "Ethan",
    //     lastName: "Wilson",
    //     userName: "CosmicCactus13",
    //     email: "ethan.wilson@stevens.edu",
    //     password: "Lk6&z$F#d9s",
    //     DOB: "04-01-2002",
    // };


    const eventOne = {
        eventName: "Spring Fling Festival",
        description: "A celebration of the arrival of spring, featuring live music, food trucks, and carnival games",
        location: "Stevens Institute of Technology Campus Green",
        organizer: "Stevens Student Government Association",
        seatingCapacity: 100
    };

    const eventTwo = {
        eventName: "Innovation Summit",
        description: "A conference bringing together experts in the fields of technology and entrepreneurship to share insights and ideas.",
        location: "Babbio Center for Technology Management",
        organizer: "Stevens School of Business",
        seatingCapacity: 200
    };

    const eventThree = {
        eventName: " Halloween Bash",
        description: " A costume party with music, dancing, and refreshments.",
        location: "Jacobus Lounge",
        organizer: "Stevens Residence Life",
        seatingCapacity: 500
    };

    const eventFour = {
        eventName: "Career Fair",
        description: "An opportunity for students to network with employers and explore job and internship opportunities.",
        location: "Canavan Arena",
        organizer: "Stevens Career Center",
        seatingCapacity: 1000
    };
    const eventFive = {
        eventName: "Musician Showcase",
        description: "An evening of live music featuring local bands and solo artists.",
        location: "Pierce Dining Hall",
        organizer: " Stevens Music Society",
        seatingCapacity: 200
    };




    try {
    //     const user = await userData.createUser(userOne.firstName, userOne.lastName,
    //         userOne.userName, userOne.email, userOne.password, userOne.DOB);
    //     await userData.createUser(userTwo.firstName, userTwo.lastName,
    //         userTwo.userName, userTwo.email, userTwo.password, userTwo.DOB);
    //     await userData.createUser(userThree.firstName, userThree.lastName,
    //         userThree.userName, userThree.email, userThree.password, userThree.DOB);
    //     await userData.createUser(userFour.firstName, userFour.lastName,
    //         userFour.userName, userFour.email, userFour.password, userFour.DOB);
    //     await userData.createUser(userFive.firstName, userFive.lastName,
    //         userFive.userName, userFive.email, userFive.password, userFive.DOB);

       const event = await eventsData.createEvent(eventOne.eventName, eventOne.description,
           eventOne.location, eventOne.organizer, eventOne.seatingCapacity);
        await eventsData.createEvent(eventTwo.eventName, eventTwo.description, eventTwo.location,
            eventTwo.organizer, eventTwo.seatingCapacity);
        await eventsData.createEvent(eventThree.eventName, eventThree.description, eventThree.location,
            eventThree.organizer, eventThree.seatingCapacity);
        await eventsData.createEvent(eventFour.eventName, eventFour.description,  eventFour.location,
            eventFour.organizer, eventFour.seatingCapacity);
        await eventsData.createEvent(eventFive.eventName, eventFive.description,  eventFive.location,
            eventFive.organizer, eventFive.seatingCapacity);



    } catch (e) {
        console.log(e);
    }

    // try{
    //     const user1 = await userData.putPost()

    // }catch (e){
    //   console.log(e);
    // }

    console.log("Done");
    await closeConnection();
}



main();