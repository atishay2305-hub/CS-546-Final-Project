import postData from "./data/posts.js"

// try {
//     let postDataCreation = await postData.createPost("sports", "./images/default.jpg", "Nice Photo", "test123")
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

// try {
//     let gettingAll = await postData.getAllPosts();
//     console.log(gettingAll)
// }
// catch(error){
//     console.log(error)
// }


// try {
//     let postDataCreation = await postData.getPostByCategory("sports");
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }


// try {
//     let postDataCreation = await postData.getPostById("6454a71d0829bcf69ffcb66c")
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }


// try {
//     let postDataCreation = await postData.getPostByUserId("6452b314a2d50fbccd559605")
//     console.log(postDataCreation)
// } catch(error){
//     console.log(error);
// }

try {
    let postDataCreation = await postData.updatePost("6442269732b1e3c891419771", "dancing", "Zumba", "Random");
    console.log(postDataCreation)
} catch(error){
    console.log(error);
}