import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videoId } = req.body
    const userId = req.user._id

    if (videoId && !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, " invalid video id for the playlist")
    }

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "playlist name and description required")
    }

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: userId,
            videos: videoId ? [videoId] : []
        }
    )
    return res
        .status(201)
        .json(
            new ApiResponse(200, playlist, "Playlist created successfully")
        )

    //TODO: create playlist
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },

        //  Lookup owner (user info)
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

        {
            $unwind: "$owner"
        },

        //  Lookup videos
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            duration: 1
                        }
                    }
                ]
            }
        },

        // Add total videos
        {
            $addFields: {
                totalVideos: { $size: "$videos" }
            }
        }
    ])

    if (!playlist.length) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist[0], "Playlist fetched successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }, {
            $addFields: {
                totalVideos: { $size: "$videos" }
            }
        }, {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, " Playlist fetched successfully")
        )


    //TODO: get user playlists
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    
    console.log("playlistId:", playlistId);
    console.log("videoId:", videoId);

    if (
        !mongoose.Types.ObjectId.isValid(playlistId) ||
        !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid video ID or playlist ID")
    }

    const user = req.user._id

    
    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    
    if (playlist.owner.toString() !== user.toString()) {
        throw new ApiError(403, "You cannot modify this playlist")
    }

    // Prevent duplicate videos 
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist")
    }

    // Add video
    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    
    const { playlistId, videoId } = req.params
     if (
        !mongoose.Types.ObjectId.isValid(playlistId) ||
        !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid video ID or playlist ID")
    }

    
   
   
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id : playlistId,
            owner : req.user._id
        },
        {
            $pull : { videos : videoId}
        },
        { 
            new : true
        }
    )
   if(!updatedPlaylist){
    throw new ApiError(404 , " playlist  not found or unathorised ")
   }
    return res
    .status(200)
    .json(
        new ApiResponse(200 , updatedPlaylist , " video deleted from playlist successfully")
    )
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400 , " invalid playlist id")
    }

    const deletedPlaylist = await Playlist.findOneAndDelete(
        {
            _id : playlistId,
            owner : req.user._id
        }
    )
    if(!deletedPlaylist){
        throw new ApiError(404 , " Playlist not found or unauthorised request")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200 , {} , " playlist deleted successfully")
    )

    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const { name, description } = req.body

    if (!name?.trim() && !description?.trim()) {
        throw new ApiError(400, "Name or description is required to update the playlist")
    }

    const updateFields = {}

    if (name) updateFields.name = name
    if (description) updateFields.description = description

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $set: updateFields
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found or unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}