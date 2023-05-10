import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {eventsData, userData, commentData, discussData, postData} from './data/index.js';


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
        authentication: "getprivilege",
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
        authentication: "getprivilege",
        department:"mechanical engineering"
    };
    const userSeven = {
        firstName: "satya",
        lastName: "nadella",
        userName: "Nadella13",
        email: "satya.nadella@stevens.edu",
        password: "Lk6&z$Fhj9sh",
        DOB: "2005-09-04",
        role:"admin",
        authentication: "getprivilege",
        department:"computer science"
    };

   

    var userId1,userId2,userId3,userId4,userId5,userId6,userId7;
    var eventId1,eventId2,eventId3,eventId4,eventId5,eventId6,eventId7;
    var postId1,postId2;
    var commentId1,commentId2;
    
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
            const user7 = await userData.createUser(userSeven.firstName, userSeven.lastName, userSeven.userName, userSeven.email,
                userSeven.password, userSeven.DOB, userSeven.role,userSeven.department, userSeven.authentication);
    
       
        userId1 = user1.userID;
        userId2 = user2.userID;
        userId3 = user3.userID;
        userId4 = user4.userID;
        userId5 = user5.userID;
        userId6 = user6.userID;
        userId7 = user7.userID;

   

    } catch (e) {
        console.log(e);
    }


    try{
        const eventOne = {
            userId:userId1,
            eventName: "Spring Fling Festival",
            date:"2023-06-12",
            roomNumber:"110",
            description: "A celebration of the arrival of spring, featuring live music, food trucks, and carnival games",
            buildingName: "Carnegie Laboratory",
            organizer: "Stevens Student Government Association",
            seatingCapacity: 100,
            image:"background.jpg"
        };
    
        const eventTwo = {
            userId: userId2,
            eventName: "Innovation Summit",
            description: "A conference bringing together experts in the fields of technology and entrepreneurship to share insights and ideas.",
            buildingName: "Babbio Center for Technology Management",
            organizer: "Stevens School of Business",
            seatingCapacity: 200,
            roomNumber:"116",
            date:"2023-06-22",
            image:"background.jpg"
        };
    
        const eventThree = {
            userId: userId3,
            eventName: " Halloween Bash",
            description: " A costume party with music, dancing, and refreshments.",
            buildingName: "Walker Gymnasium",
            organizer: "Stevens Residence Life",
            seatingCapacity: 500,
            roomNumber:"115",
            date:"2023-07-12",
            image:"background.jpg"
        };
    
        const eventFour = {
            userId: userId4,
            eventName: "Career Fair",
            description: "An opportunity for students to network with employers and explore job and internship opportunities.",
            buildingName: "Burchard Building",
            organizer: "Stevens Career Center",
            seatingCapacity: 1000,
            roomNumber:"330",
            date:"2023-08-12",
            image:"background.jpg"
        };
        const eventFive = {
            userId: userId5,
            eventName: "Musician Showcase",
            description: "An evening of live music featuring local bands and solo artists.",
            buildingName: "Gatehouse",
            organizer: " Stevens Music Society",
            seatingCapacity: 200,
            roomNumber:"110",
            date:"2023-06-28",
            image:"background.jpg"
        };
        const eventSix = {
            userId: userId6,
            eventName: "Magic Show",
            description: "To entertain you with some intersting magic tricks.",
            buildingName: "Babbio Center",
            organizer: " Stevens Cultural Society",
            seatingCapacity: 100,
            roomNumber:"119",
            date:"2023-09-12",
            image:"background.jpg"
        };
        const eventSeven = {
            userId: userId7,
            eventName: "Innovation Summit",
            description: "A conference bringing together experts in the fields of technology and entrepreneurship to share insights and ideas.",
            buildingName: "Babbio Center for Technology Management",
            organizer: "Stevens School of Business",
            seatingCapacity: 250,
            roomNumber:"140",
            date:"2023-06-19",
            image:"background.jpg"
        };
        const event1 = await eventsData.createEvent(eventOne.eventName,
            eventOne.description,eventOne.date, eventOne.buildingName,eventOne.roomNumber, eventOne.organizer, eventOne.seatingCapacity,userId1,eventOne.image);
        const event2 = await eventsData.createEvent( eventTwo.eventName, eventTwo.description,eventTwo.date,
            eventTwo.buildingName,eventTwo.roomNumber, eventTwo.organizer, eventTwo.seatingCapacity,userId7,eventTwo.image);
        const event3 = await eventsData.createEvent( eventThree.eventName, eventThree.description,eventThree.date,
            eventThree.buildingName,eventThree.roomNumber, eventThree.organizer, eventThree.seatingCapacity,userId1,eventThree.image);
        const event4 = await eventsData.createEvent( eventFour.eventName, eventFour.description,eventFour.date,
            eventFour.buildingName,eventFour.roomNumber, eventFour.organizer, eventFour.seatingCapacity,userId6,eventFour.image);
        const event5 = await eventsData.createEvent( eventFive.eventName, eventFive.description,eventFive.date,
            eventFive.buildingName,eventFive.roomNumber, eventFive.organizer, eventFive.seatingCapacity,userId1,eventFive.image);
            const event6 = await eventsData.createEvent( eventSix.eventName, eventSix.description,eventSix.date,
                eventSix.buildingName,eventSix.roomNumber, eventSix.organizer, eventSix.seatingCapacity,userId6,eventSix.image);
                const event7 = await eventsData.createEvent( eventSeven.eventName, eventSeven.description,eventSeven.date,
                    eventSeven.buildingName,eventSeven.roomNumber, eventSeven.organizer, eventSeven.seatingCapacity,userId7,eventSeven.image);

        
        eventId1 = event1._id.toString();
        eventId2 = event2._id.toString();
        eventId3 = event3._id.toString();
        eventId4 = event4._id.toString();
        eventId5 = event5._id.toString();
        eventId6 = event6._id.toString();
        eventId7 = event7._id.toString();
    }catch (e){
        console.log(e);
    }
    try{
        const postOne={
            category:"education",
             image:'background.jpg',
            postedContent:"eductaion is divine",
             userName:"MysticMeadow98"
            
        };
        const postTwo={
            category:"sports",
             image:'background.jpg',
            postedContent:"soccer vs football",
             userName:"RainbowRider77"
            
        };

        const post1 = await postData.createPost(postOne.category,postOne.image,postOne.postedContent,postOne.userName);
        const post2 = await postData.createPost(postTwo.category,postTwo.image,postTwo.postedContent,postTwo.userName);
        postId1 = post1._id;
        postId2 = post2._id;
        
    }catch(e){
        console.log(e);
    }
    try{
        const commentOne ={
            userId: userId1,
            eventId:eventId1,
            postId:postId1,
            contents:"true its correct",
            commentType:"post"
        };
        const commentTwo ={
            userId: userId7,
            eventId:eventId6,
            postId: postId2,
            contents:"wow",
            commentType:"event"
        };
        const comment1 = await commentData.createComment(commentOne.userId,commentOne.eventId,commentOne.postId,commentOne.contents,commentOne.commentType);
        const comment2 = await commentData.createComment(commentTwo.userId,commentTwo.eventId,commentTwo.postId,commentTwo.contents,commentTwo.commentType);
        
        commentId1 = comment1.commentId;
        commentId2 = comment2.commentId;
        }
        catch (e){
            console.log(e);
        }
        try{
            const discussOne={
                category:"sports",
                description:"best performance by ms dhoni",
                userId: userId3
            };
            const discussTwo={
                category:"sports",
                description:"best football match",
                userId: userId2
            };
            const discussion1 = await discussData.createDiscussion(discussOne.category,discussOne.description,discussOne.userId);
            const discussion2 = await discussData.createDiscussion(discussTwo.category,discussTwo.description,discussTwo.userId);
            
           
        }catch (e){
            console.log(e);
        }
   
   

    console.log("Done");
    await closeConnection();
}



main();