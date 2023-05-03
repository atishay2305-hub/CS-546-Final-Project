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
await closeConnection();

