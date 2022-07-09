
require('./model')
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const controller = require('./controller/directoryController');
const validator = require('./validator/directoryValidator');
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));



// parse requests of content-type - application/json
// require('./model');
app.use(bodyParser.json());
require('./bootstrap');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req,res)=>{res.send("HELLO WORLD")})

app.get('/user/getFolderSize', validator.getFileSize, controller.getsizeOfFileFolder);
app.post('/user/addFileFolder', validator.addNewFileOrFolder, controller.addFolderOrFile);
app.put('/user/updateDirectory', validator.updateDirectoryFolder, controller.updateDirectoryOrFolder);
app.delete("/user/deletedFileOrFolder/:id", validator.deleteFileOrDirectory, controller.deleteFileOrDirectory);
app.get('/user/listAllFilesFolders', validator.listFilesFolder, controller.listFile);
app.get('/user/SearchFileOrFolder', validator.searchFilesFolder, controller.searchFileOrFolder);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});