import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { pipeline } from "stream"

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.aggregate([

        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },

        // owner info
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
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

        // likes info
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },

        {
            $addFields: {

                owner: {
                    $first: "$owner"
                },

                likesCount: {
                    $size: "$likes"
                },

                isLiked: {
                    $in: [
                        req.user?._id,
                        "$likes.likedBy"
                    ]
                }
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $skip: (page - 1) * limit
        },

        {
            $limit: Number(limit)
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Comments fetched successfully"
        )
    );
});

const addComment = asyncHandler(async (req, res) => {
    const user = req.user._id
  const { videoId } = req.params;
const { content } = req.body;

    if (!videoId || !content) {
        throw new ApiError(400, "videoId and content required")
    }

    const comment = await Comment.create(
        {
            owner: user,
            content,
            video: videoId
        }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, " comment added")
        )

    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const {content} = req.body
    if(!content){
        throw new ApiError(400 , "content is required")
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(404, "comment not found")
    }
    
    // const comment = await Comment.findById(commentId)
    // if(!comment){
    //     throw new ApiError(404 , " comment cannot be found")
    // }

    // if (req.user._id.toString() !==comment.owner.toString()) {
    //     throw new ApiError(403, "You cannot update the comment")
    // }
    
    // const updatedComment = await Comment.findByIdAndUpdate(
    //     commentId,
    //      {
    //      $set : { content}
    // },

    //     {
    //         new: true
    //     }
    // )

    const updatedComment = await Comment.findOneAndUpdate(
    {
        _id: commentId,
        owner: req.user._id
    },
    {
        $set: { content }
    },
    {
        new: true
    }
)

if (!updatedComment) {
    throw new ApiError(403, "Not authorized or comment not found")
}

    return res
    .status(200)
    .json(
        new ApiResponse(200 , updatedComment , " comment updated successfully")
    )


    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400 , " comment cannot be deleted")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404 , " comment not found ")
    }

    if(req.user._id.toString()!== comment.owner.toString()){
        throw new ApiError(403 , "you cannot delete this comment ")
    }

    await comment.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} ,"comment deleted successfully")
    )
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}