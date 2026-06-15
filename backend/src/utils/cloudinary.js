import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


  const uploadOnCloudinary = async (localFilePath)=>{
try{
if(!localFilePath) return null;
//upload the file on cloudinary
const response = await cloudinary.uploader.upload(localFilePath , { resource_type : "auto"} )
//file has been uploaded successfully 
//console.log("file is uploaded on cloudinary" , response.url);


fs.unlinkSync(localFilePath)   //to clear local storage
return response;

}catch(error){
fs.unlinkSync(localFilePath) //remove the locally saved temporary file as upload operation got failed
return null;
}
  }
  
  //file url on cloudinary => https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg
 
  const deleteFromCloudinary = async (fileURL, resourceType) => {
   try {
      if (!fileURL || !resourceType) return

      const parts = fileURL.split("/")
      const fileName = parts[parts.length - 1]
      const publicId = fileName.split(".")[0]

      await cloudinary.uploader.destroy(publicId, {
         resource_type: resourceType
      })

   } catch (error) {
      console.log("Error deleting:", error)
   }
}

    export {uploadOnCloudinary , deleteFromCloudinary};