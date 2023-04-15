import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData, userData} from './data/index.js';


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const userOne = {
        firstName: "Emma",
        lastName: "Smith",
        email: "emma.smith@stevens.edu",
        hashPassword: "2D3F6A1E",
        dob: "06-23-2001",
        department: "Computer Science"
    };

    const userTwo = {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.johnson@stevens.edu",
        hashPassword: "5B8D2C7F",
        dob: "11-07-2000",
        department: "Mechanical Engineering"
    };

    const userThree = {
        firstName: "Avery",
        lastName: "Davis",
        email: "avery.davis@stevens.edu",
        hashPassword: "9E6A3B2D",
        dob: "03-12-2002",
        department: "Chemical Engineering"
    };

    const userFour = {
        firstName: "Olivia",
        lastName: "Brown",
        email: "olivia.brown@stevens.edu",
        hashPassword: "1F6A2D8C",
        dob: "07-19-2001",
        department: "Business"
    };

    const userFive = {
        firstName: "Ethan",
        lastName: "Wilson",
        email: "ethan.wilson@stevens.edu",
        hashPassword: "3A7C8F6B",
        dob: "04-01-2002",
        department: "Civil Engineering"
    };


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
        const user = await userData.addUser(userOne.firstName, userOne.lastName, userOne.email,
            userOne.hashPassword, userOne.dob, userOne.department);
        await userData.addUser(userTwo.firstName, userTwo.lastName, userTwo.email,
            userTwo.hashPassword, userTwo.dob, userTwo.department);
        await userData.addUser(userThree.firstName, userThree.lastName, userThree.email,
            userThree.hashPassword, userThree.dob, userThree.department);
        await userData.addUser(userFour.firstName, userFour.lastName, userFour.email,
            userFour.hashPassword, userFour.dob, userFour.department);
        await userData.addUser(userFive.firstName, userFive.lastName, userFive.email,
            userFive.hashPassword, userFive.dob, userFive.department);

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
    console.log("Done");
    await closeConnection();
}

main();