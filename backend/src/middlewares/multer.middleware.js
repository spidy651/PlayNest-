import multer from "multer";

const storage  =  multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./public/temp')
    },
    filename : function(req ,file,cb ) {
        cb(null , file.originalname)    //you can also use suffix to make filename unique such as --> file.fieldname + '-' +uniqueSuffix
    }
})
export const upload = multer({storage : storage}) //or simply storage