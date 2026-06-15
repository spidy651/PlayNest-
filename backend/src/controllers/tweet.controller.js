import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content || content.trim() === "") {
        throw new ApiError(400, "tweet content is required")
    }
    const tweet = await Tweet.create(
        {
            owner: req.user._id,
            content
        }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "tweet created successfully")
        )

    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({
        owner: req.user._id
    }).sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, " no such tweet exist")
    }
    const { content } = req.body
    if (!content || content.trim() === "") {
        throw new ApiError(400, " content is required")
    }
    // const tweet = await Tweet.findById(tweetId)
    // if(!tweet){
    //  throw new ApiError(404 , "no tweet found")
    // }

    // if(tweet.owner.toString()!==req.user._id.toString()){
    //     throw new ApiError(403 , "you cannot update the tweet")
    // }

    // const UpdatedTweet = await Tweet.findByIdAndUpdate(
    //     tweetId,
    //     {
    //         $set : {
    //             content
    //         }
    //     },
    //     {
    //         new : true
    //     }
    // )

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: req.user._id
        },
        {
            $set: { content }
        },
        {
            new: true
        }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or not authorized")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTweet, " your tweet has been updated")
        )

    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, " no such tweet exist")
    }
    // const tweet = await Tweet.findById(tweetId) 
    // if(!tweet){
    //     throw new ApiError(404 , " no tweet found to delete")
    // }
    // if(tweet.owner.toString()!==req.user._id.toString()){
    //     throw new ApiError(403 , "you cannot delete  the tweet")
    // }
    
    // await tweet.deleteOne()

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner : req.user._id
        }
    )
    if(!deletedTweet){
        throw new ApiError(404 , " tweet not found or unauthorised ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} ," tweet deleted successfully")
    )
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}