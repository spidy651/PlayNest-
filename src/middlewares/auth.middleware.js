import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler( async(req,_,next) => { try {  //you can use _ in place of res if you r not using res
     //Authorization header = Bearer <Tocken>
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") // we just want token 
    
    if(!token){
        throw new ApiError(401 , "Unauthorized request")
    }
    
    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        //NEXT_VIDEO : discuss about frontend
        throw new ApiError(401,"Invalid Acess Token")
    } 
    
    req.user = user;
    next()
} catch (error) {
    throw new ApiError(401, error?.message ||"Invalid Acess Token")
}

})

