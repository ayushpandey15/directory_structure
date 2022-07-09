const Joi = require('joi');

exports.getFileSize                = getFileSize;
exports.addNewFileOrFolder         = addNewFileOrFolder;
exports.deleteFileOrDirectory      = deleteFileOrDirectory;
exports.updateDirectoryFolder      = updateDirectoryFolder;
exports.searchFilesFolder          = searchFilesFolder;
exports.listFilesFolder            = listFilesFolder;

async function getFileSize(req, res, next){
    try {
        let schema = Joi.object().keys({
            id : Joi.number().min(0).required()
        });
        await schema.validateAsync(req.query);
        next();
    } catch (error) {
        // console.log(error);
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}

async function addNewFileOrFolder(req, res, next){
    try {
        let schema = Joi.object().keys({
            name : Joi.string().trim().required(),
            type : Joi.string().trim().required(),
            parentId : Joi.number().min(1).optional(),
            size : Joi.number().min(0).default(0).optional()
        });
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}

async function deleteFileOrDirectory(req, res, next){
    try {
        let schema = Joi.object().keys({
            id : Joi.number().min(0).required() 
        });
        await schema.validateAsync(req.params);
        next();
    } catch (error) {
        console.error(error)
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}

async function updateDirectoryFolder(req, res, next){
    try {
        let schema = Joi.object().keys({
            id : Joi.number().min(0).required(),
            name : Joi.string().trim().required()
        });
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}

async function listFilesFolder(req, res, next){
    try {
        let schema = Joi.object().keys({
            limit :  Joi.number().min(0).optional(),
            skip :  Joi.number().min(0).optional()
        });
        await schema.validateAsync(req.query);
        next();
    } catch (error) {
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}

async function searchFilesFolder(req, res, next){
    try {
        let schema = Joi.object().keys({
            name  : Joi.string().trim().optional(),
            limit :  Joi.number().min(0).optional(),
            skip :  Joi.number().min(0).optional()
        });
        await schema.validateAsync(req.query);
        next();
    } catch (error) {
        console.log(error);
        let sendError = error && error.details && error.details.length && error.details[0].message ? error.details[0].message : error
        return res.status(400).send({status : 400, message : sendError, data :[]});
    }
}