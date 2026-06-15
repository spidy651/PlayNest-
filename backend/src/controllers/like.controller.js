import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const user = req.user._id

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    
    if (video.owner.toString() === user.toString()) {
        throw new ApiError(400, "You cannot like your own video")
    }

    
    const existingLike = await Like.findOneAndDelete({
        likedBy: user,
        video: videoId
    })

    if (existingLike) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Unliked")
        )
    }

    // Else create like
    const newLike = await Like.create({
        likedBy: user,
        video: videoId
    })

    return res.status(201).json(
        new ApiResponse(201, newLike, "Liked")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const user = req.user._id

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    // Try to unlike
    const existingLike = await Like.findOneAndDelete({
        likedBy: user,
        comment: commentId
    })

    if (existingLike) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Comment unliked")
        )
    }

    // Else create like
    const newLike = await Like.create({
        likedBy: user,
        comment: commentId
    })

    return res.status(201).json(
        new ApiResponse(201, newLike, "Comment liked")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const user = req.user._id

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    // Try to unlike
    const existingLike = await Like.findOneAndDelete({
        likedBy: user,
        tweet: tweetId
    })

    if (existingLike) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Tweet unliked")
        )
    }

    // Else create like
    const newLike = await Like.create({
        likedBy: user,
        tweet: tweetId
    })

    return res.status(201).json(
        new ApiResponse(201, newLike, "Tweet liked")
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const user = req.user._id

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(user),
                video: { $exists: true } // only video likes
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            description: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$video"
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
})

const getLikeStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOneAndDelete({
    likedBy: new mongoose.Types.ObjectId(user),
    comment: new mongoose.Types.ObjectId(commentId)
});

    return res.status(200).json(
        new ApiResponse(200, {
            isLiked: !!exists
        }, "Like status fetched")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikeStatus
}