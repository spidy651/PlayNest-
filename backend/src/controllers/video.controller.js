import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { deleteFromCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, category, sortBy, sortType, userId } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    //match stage
    const matchStage = {};


    if (query) {
        matchStage.title = { $regex: query, $options: "i" };
    }


    if (category && category !== "All") {
        matchStage.category = category;
    }


    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    //sort stage 
    const sortStage = {};

    if (sortBy) {
        sortStage[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sortStage.createdAt = -1; // ✅ default sort
    }

    const videos = await Video.aggregate(
        [
            {
                $match: matchStage
            },
            //join with user (for better perfomance)
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
                                avatar: 1,

                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: { $first: "$owner" }
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $addFields: {
                    likesCount: {
                        $size: "$likes"
                    }
                }
            },
            {
                $sort: sortStage
            },

            // Pagination + count in one go 
            {
                $facet: {
                    videos: [
                        { $skip: skip },
                        { $limit: limitNumber }
                    ],
                    totalCount: [

                        { $count: "count" }

                    ]
                }
            }
        ]
    )

    const result = videos[0];

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalVideos: result.totalCount[0]?.count || 0,
                    page: pageNumber,
                    limit: limitNumber,
                    videos: result.videos
                },
                "video fetched successfully"
            )
        )


})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "no videoFileLocalPath available")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "no thumbnailLocalPath available")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile.url) {
        throw new ApiError(400, " videoFile required ")
    }
    if (!thumbnail.url) {
        throw new ApiError(400, " thumbnail required ")
    }

    const video = await Video.create(
        {
            thumbnail: thumbnail?.url,
            videoFile: videoFile?.url,
            title,
            category,
            description,
            duration: videoFile?.duration || 0,
            isPublished: true,
            owner: req.user._id,

        }
    )
    return res
        .status(201)
        .json(
            new ApiResponse(201, video, "Video uploaded successfully")
        );

    // TODO: get video, upload to cloudinary, create video
})

const addView = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "View added")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // const video = await Video.findById(videoId);

    // return res
    // .status(200)
    // .json(
    //   new ApiResponse(200 , video , "got the video by id")  
    // )

    //     const updatedVideo = await Video.findByIdAndUpdate(
    //    videoId,
    //    {
    //       $inc: { views: 1 }
    //    },
    //    {
    //       new: true
    //    }
    // );
    console.log("=== getVideoById called ===");
   console.log("req.user:", req.user);
   console.log("videoId:", req.params.videoId);
    if (req.user?._id) {
        console.log("req.user:", req.user);
        console.log("videoId:", videoId);
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { watchHistory: videoId }
            }
        );
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },

        // owner
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

        // likes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },

        // computed fields
        {
            $addFields: {
                owner: { $first: "$owner" },
                likesCount: {
                    $size: "$likes"
                }
            }
        }
    ]);

    if (!video.length) {
        throw new ApiError(404, "video not found")
    }
    console.log("VIEWS:", video[0].views);
    return res
        .status(200)
        .json(
            new ApiResponse(200, video[0], " video fetched by id successfully")
        )
    //TODO: get video by id
})

const getUserVideos = async (req, res) => {
    try {
        const { userId } = req.params;

        const videos = await Video.find({
            owner: userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json(videos);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const { title, description } = req.body
    if (!title && !description && !req.file) {
        throw new ApiError(400, " no field to update")
    }

    let updateFields = {}

    if (title) updateFields.title = title
    if (description) updateFields.description = description

    if (req.file?.path) {
        const newThumbnail = await uploadOnCloudinary(req.file.path)

        if (!newThumbnail?.url) {
            throw new ApiError(400, "new thumbnail required")
        }

        updateFields.thumbnail = newThumbnail.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        {
            new: true
        }
    )

    if (!updatedVideo) {
        throw new ApiError(404, "video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideo, "video updated successfully")
        )



    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {   //validation
        throw new ApiError(404, "video id not valid")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    //check for authorised deletion
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not allowed to delete this video ")
    }

    if (video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail, "image")
    }
    if (video.videoFile) {
        await deleteFromCloudinary(video.videoFile, "video")
    }

    await Video.findByIdAndDelete(videoId)
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )

    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findOne(
        {
            _id: videoId,
            owner: req.user._id
        }
    )

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Publish status toggled")
        )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    addView,
    getUserVideos
}