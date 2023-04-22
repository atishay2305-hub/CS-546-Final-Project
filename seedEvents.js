import eventsData from "./data/events.js";

try {
    let something = await eventsData.createEvent("Something", "sdsjdisj", "edwin a. stevens hall", "Atishay Jain", 5, "jsdsdj43434fdsfdfisdj21212", "https://upload.wikimedia.org/")
    console.log(something);

} catch(error){
    console.log(error)
}

// try {
//     let something = await eventsData.getAllEvents()
//     console.log(something);

// } catch(error){
//     console.log(error)
// }

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





