let response        = require('../response');
let services        = require('../services/directoryServices');
const {Op}          = require('sequelize');
let _lodash         = require('lodash');


exports.getsizeOfFileFolder       = getsizeOfFileFolder;
exports.addFolderOrFile           = addFolderOrFile;
exports.deleteFileOrDirectory     = deleteFileOrDirectory;
exports.searchFileOrFolder        = getFileName;
exports.listFile                  = listFile;
exports.updateDirectoryOrFolder   = updateDirectoryOrFolder;


async function addFolderOrFile(req, res){
    try {
        // let name = req.body.name;
        let parentId =req.body.parentId || null;
        if(parentId){
            let checkIfDataExists = await services.getOneDirector({id :parentId});
            if(_lodash.isEmpty(checkIfDataExists)){
                return response.sendCustomResponse(res, "INVALID PARENT ID", 400, []);
            }
        }
        let formate;
        if(req.body.type && req.body.type != "folder"){
            formate =  req.body.name.split(".").pop();
        }else{
            formate = req.body.type || "folder"
        }
        let obj = {
            name : req.body.name,
            formate : formate,
            size : req.body.size || 0,
            parentId
        }
        let data = await services.saveData(obj);
        return response.sendCustomResponse(res, "SUCESSFULL", 200, data);

    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}

async function getsizeOfFileFolder(req, res){
    try {
        let sql = `WITH RECURSIVE cte(id,size) AS (
            SELECT id,size FROM directories
            WHERE id = ${req.query.id} AND isDeleted =0
            UNION ALL
            SELECT dir.id,dir.size FROM directories dir, cte 
            WHERE cte.id = dir.parentId AND dir.isDeleted =0
        ) SELECT id,size FROM cte`;
        let data  =await services.rawQuery(sql);
        // console.log(JSON.stringify(data));
        let size =0
        if(data.length){
         size = data.reduce((x,y)=>{return x+y.size},0)   
        }
        return response.sendCustomResponse(res, "SUCESSFULL", 200, {size});
    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}

async function deleteFileOrDirectory(req, res){
    try {
        let sql =`UPDATE directories SET isDeleted  = 1
        WHERE id IN(
            WITH RECURSIVE cte AS (
                SELECT id FROM directories 
                WHERE id = ${req.params.id}
                UNION ALL
                SELECT dir.id FROM directories dir, cte 
                WHERE cte.id = dir.parentId AND dir.isDeleted =0
            ) SELECT id FROM cte
        )`
        await services.updateRawQuery(sql);
        return response.sendCustomResponse(res, "SUCESSFULL", 200, {});
    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}

async function getFileName(req, res){
    try {
        let search = " ";
        if(req.query.name){
            search+= ` AND (name LIKE "%${req.query.name}%" OR formate LIKE "%${req.query.name}") `;
        }
        //   LIMIT ${req.query.limit || 20} OFFSET ${req.query.skip || 0}
        //(id,name, formate, parentId, isDeleted, createdAt, path)
        //1=1 ${search} AND
        let sql = `WITH RECURSIVE cte AS (
            SELECT id,name, formate, parentId, isDeleted, createdAt, name As path FROM directories 
            WHERE  isDeleted = 0 AND parentId IS NULL
            UNION ALL
            SELECT dir.id,dir.name, dir.formate, dir.parentId, dir.isDeleted, dir.createdAt, concat_ws('/', cte.path,  dir.name)
            from  directories as dir
            INNER JOIN cte  ON cte.id = dir.parentId AND dir.isDeleted =0
        ) SELECT * FROM cte WHERE 1=1 ${search}`
        //            WHERE cte.paentId = dir.id AND dir.isDeleted =0
        let data = await services.rawQuery(sql);
        return response.sendCustomResponse(res, "SUCESSFULL", 200, data);
    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}

async function listFile(req, res){
    try {
        let criteria = {
            isDeleted : {
                [Op.eq] : 0
            }
        };
        console.log(">>>>>>>><<<<<<<<")
        let {count, rows} = await services.getCountAndFind(criteria, req.query.limit || 30, req.query.skip || 0, [["createdAt", "DESC"]]);
        return response.sendCustomResponse(res, "SUCESSFULL", 200, {count,data :rows});
    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}

async function updateDirectoryOrFolder(req, res){
    try {
        let criteria = {
            id : {
                [Op.eq] : req.body.id
            }
        }
        await services.update(criteria, req.body);
        return response.sendCustomResponse(res, "SUCESSFULL", 200, []);
    } catch (error) {
        console.log("error", error);
        return response.sendCustomResponse(res, "ERROR", 400, error);
    }
}