import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params     //user - subscriber - user  subscriber ka part ho jata hai agar subscribe karta hai 
    const user = req.user._id
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(404, "invalid channel")
    }

    if (channelId.toString() === user.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }
    const existing = await Subscription.findOneAndDelete(
        {
            channel: channelId,
            subscriber: user
        }
    )
    if (existing) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "unsubscribed successfully")
            )
    }

    const newSub = await Subscription.create(
        {
            subscriber: user,
            channel: channelId
        }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(200, newSub, "subscribed successfully")
        )
    // TODO: toggle subscription
})

const getSubscriptionStatus = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const user = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const exists = await Subscription.findOne({
        channel: channelId,
        subscriber: user
    });

    return res.status(200).json(
        new ApiResponse(200, {
            isSubscribed: !!exists
        }, "Subscription status fetched")
    );
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    console.log(req.params)
    const { subscriberId } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "invalid channel id")
    }

    const count = await Subscription.countDocuments({
    channel: subscriberId
})

return res.status(200).json(
    new ApiResponse(200, { count }, "Subscriber count fetched")
)
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$channel"
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Here are your subscribed channels"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getSubscriptionStatus
}