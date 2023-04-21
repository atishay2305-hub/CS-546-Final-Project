import { posts } from "../config/mongoCollections.js";
import validation from "../validationchecker.js";
import { ObjectId } from "mongodb";
import moment from 'moment';

let exportedMethods = {
    // Create a new post with the given category and content
    async createPost(category, postedContent) {
        // category = validation.checkString(category, "category");
        //  postedContent = validation.checkString(postedContent, "PostedContent");
        let post = {
            category: category,
            postContent: postedContent,
            // img: generateImageUrl(),
            user_id: '64321cb672bd393e9e0f9ef4',
            created_Date: moment().format('MM-DD-YYYYTHH:mm:ss.SSSZ'),
            likes: 0,
            dislikes: 0,
            comments: {}
        };

        const postCollection = await posts();
        const insertInfo = await postCollection.insertOne(post);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error('Could not add post');
        }
        post._id = insertInfo.insertedId.toString();
        post = Object.assign({_id: post._id}, post);
        return post;
    },

    // Get all posts with optional projection
    async getAllPost() {
        const postCollection = await posts();
        let postList = await postCollection.find({}).project().toArray();
        if (postList.length === 0) {
            throw new Error('No posts found');
        }
        postList = postList.map(element => {
            element._id = new ObjectId(element._id).toString();
            return element;
        });
        return postList;
    },

    // Get a post by ID
    async getPostById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: new ObjectId(id)});
        if (!post) {
            throw new Error(`No post found with ID ${id}`);
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },

    async getPostByCategory(category) {
        const postCollection = await posts();
        const post = await postCollection.findOne({ category: category });
        if (!post) {
            throw new Error(`No post found with category: ${category}`);
        }
        post._id = new ObjectId(post._id).toString();
        return post;
    },
    

    async removePostById(id) {
        id = await validation.checkId(id);
        const postCollection = await posts();
        const post = await postCollection.findOneAndDelete({_id: new ObjectId(id)});
        if (!post.value) {
          throw {statusCode: 404, error: `Could not delete post with id of ${id}`};
        }
        return {
          postId: id,
          deleted: true
        };
      },

      
      async updatePost(id, category, postedContent, img) {
        // id = await validation.checkId(id);
        // category = validation.checkString(category, "category");
        // postedContent = validation.checkString(postedContent, "postedContent");
      
        const postCollection = await posts();
        const updateFields = {category, postContent: postedContent, img};
        const options = {returnOriginal: false};
        const updatedPost = await postCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updateFields}, options);
      
        if (!updatedPost.value) {
          throw new Error('Could not update post');
        }
      
        const post = updatedPost.value;
        post._id = post._id.toString();
        return post;
      },
    }
//express session,handlebars
export default exportedMethods;


