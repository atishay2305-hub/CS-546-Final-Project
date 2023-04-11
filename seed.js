import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData} from './data/index.js';


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const eventOne = {
        eventName: "Spring Fling Festival",
        description: "A celebration of the arrival of spring, featuring live music, food trucks, and carnival games",
        date: "05/15/2023",
        time: "12:00 PM - 4:00 PM",
        location: "Stevens Institute of Technology Campus Green",
        organizer: "Stevens Student Government Association",
        seatingCapacity: 100
    };

    const eventTwo = {
        eventName: "Innovation Summit",
        description: "A conference bringing together experts in the fields of technology and entrepreneurship to share insights and ideas.",
        date: "10/14/2023",
        time: "9:00 AM - 5:00 PM",
        location: "Babbio Center for Technology Management",
        organizer: "Stevens School of Business",
        seatingCapacity: 200
    };

    const eventThree = {
        eventName: " Halloween Bash",
        description: " A costume party with music, dancing, and refreshments.",
        date: "10/28/2023",
        time: "8:00 PM - 11:00 PM",
        location: "Jacobus Lounge",
        organizer: "Stevens Residence Life",
        seatingCapacity: 500
    };

    const eventFour = {
        eventName: "Career Fair",
        description: "An opportunity for students to network with employers and explore job and internship opportunities.",
        date: "02/21/2024",
        time: "11:00 AM - 3:00 PM",
        location: "Canavan Arena",
        organizer: "Stevens Career Center",
        seatingCapacity: 1000
    };
    const eventFive = {
        eventName: "Musician Showcase",
        description: "An evening of live music featuring local bands and solo artists.",
        date: "11/30/2023",
        time: "7:00 PM - 10:00 PM",
        location: "Pierce Dining Hall",
        organizer: " Stevens Music Society",
        seatingCapacity: 200
    };
    const eventSix = {
        eventName: "Global Entrepreneurship Day",
        description: " A series of workshops and seminars aimed at promoting entrepreneurship and innovation.",
        date: "10/13/2023",
        time: "9:00 AM - 5:00 PM",
        location: "Various locations on campus",
        organizer: "Stevens School of Engineering and Science",
        seatingCapacity: 1000
    };
    const eventSeven = {
        eventName: "International Festival",
        description: "A celebration of the diverse cultures represented at Stevens, featuring music, dance, and food from around the world.",
        date: "04/19/2024",
        time: "5:00 PM - 8:00 PM",
        location: "Howe Center Great Hall",
        organizer: " Stevens International Student Association",
        seatingCapacity: 200
    };
    const eventEight = {
        eventName: "Hackathon",
        description: "A coding competition where participants work together to create innovative solutions to real-world problems.",
        date: "03/08/2024",
        time: "6:00 PM - 8:00 PM",
        location: "Babbio Center for Technology Management",
        organizer: " Stevens Institute of Technology Computer Science Department",
        seatingCapacity: 200
    };
    const eventNine = {
        eventName: " Movie Night Under the Stars",
        description: "An outdoor screening of a popular movie, complete with popcorn and other snacks.",
        date: "08/31/2023",
        time: "8:00 PM - 10:00 PM",
        location: "Stevens Institute of Technology Campus Green",
        organizer: "Stevens Campus Activities Board",
        seatingCapacity: 1000
    };
    const eventTen = {
        eventName: "TechTalks",
        description: " A series of talks on the latest advancements in technology.",
        date: "2023/05/01",
        time: "1:00 PM - 5:00 PM",
        location: " Babbio Center",
        organizer: "Stevens Technology Club",
        seatingCapacity: 100
    };

    let event = undefined;
    let event1 = undefined;
    let eventId = undefined;
    let eventId1 = undefined;

    try {
        event = await eventsData.createEvent(eventOne.eventName, eventOne.description, eventOne.date,
            eventOne.time, eventOne.location, eventOne.organizer, eventOne.seatingCapacity);
        await eventsData.createEvent(eventTwo.eventName, eventTwo.description, eventTwo.date,
            eventTwo.time, eventTwo.location, eventTwo.organizer, eventTwo.seatingCapacity);
        await eventsData.createEvent(eventThree.eventName, eventThree.description, eventThree.date,
            eventThree.time, eventThree.location, eventThree.organizer, eventThree.seatingCapacity);
        await eventsData.createEvent(eventFour.eventName, eventFour.description, eventFour.date,
            eventFour.time, eventFour.location, eventFour.organizer, eventFour.seatingCapacity);
        await eventsData.createEvent(eventFive.eventName, eventFive.description, eventFive.date,
            eventFive.time, eventFive.location, eventFive.organizer, eventFive.seatingCapacity);

        event1 = await eventsData.createEvent(eventSix.eventName, eventSix.description, eventSix.date,
            eventSix.time, eventSix.location, eventSix.organizer, eventSix.seatingCapacity);
        await eventsData.createEvent(eventSeven.eventName, eventSeven.description, eventSeven.date,
            eventSeven.time, eventSeven.location, eventSeven.organizer, eventSeven.seatingCapacity);
        eventId = event._id.toString();
        eventId = event1._id.toString();
    } catch (e) {
        console.log(e);
    }
    console.log("Done");
    await closeConnection();
}

main();