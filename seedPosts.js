import postsData from "./data/posts.js"

try {
    let postDataCreation = await postsData.createPost("Entertainment","something", "Trial", "6449c982e68ef47a83503011", "req");
    console.log(postDataCreation)
} catch(error){
    console.log(error);
}


// try {
//     let postDataCreation = await postsData.getAllPosts();
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

// // try {
// //     let postDataCreation = await postsData.getPostById("644220a379e865daab28c4f4");
// //     console.log(postDataCreation)
// // } catch(error){
// //     console.log(error);
// // }

// // try {
// //     let postDataCreation = await postsData.removePostById("644220a379e865daab28c4f4");
// //     console.log(postDataCreation)
// // } catch(error){
// //     console.log(error);
// // }

// // try {
// //     let postDataCreation = await postsData.updatePost("6442269732b1e3c891419771", "dancing", "Zumba", "Random");
// //     console.log(postDataCreation)
// // } catch(error){
// //     console.log(error);
// // }