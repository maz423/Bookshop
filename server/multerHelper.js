const multer = require('multer');
let fs = require('fs-extra');

let storage = multer.diskStorage({
destination: function (req, file, cb) {
    let Id = req.body.id;
    let directory = req.body.directory;
    let path = `uploads/${directory}/${Id}`;
    fs.mkdirsSync(path);
    cb(null, path);
},
filename: function (req, file, cb) {
    console.log(file);

    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.originalname);
 }
})

let upload = multer({ storage: storage });

let createUserImage = upload.array('images', 100);
let uploadImage = upload.single('file');

let multerHelper = {
    createUserImage,
    uploadImage,
}

module.exports = multerHelper;