import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id

    const totalSubscriber = await Subscription.countDocuments({
        channel: channelId
    })

    const totalVideos = await Video.countDocuments({
        owner: channelId
    })

    const totalLikes = await Like.countDocuments({
        videoOwner: channelId 
    })

    return res.status(200).json(
        new ApiResponse(200, {
            totalSubscriber,
            totalVideos,
            totalLikes
        }, "Channel stats fetched successfully")
    )
})



export {
    getChannelStats, 
    }