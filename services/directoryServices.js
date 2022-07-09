let Model = require('../model');
const {QueryTypes } = require('sequelize');


exports.findAndCreate           = findAndCreate;
exports.getOneDirector          = getOneDirector;
exports.saveData                = saveData;
exports.rawQuery                = rawQuery;
exports.updateRawQuery          = updateRawQuery;
exports.getCountAndFind         = getCountAndFind;
exports.update                  = update;

async function getOneDirector(criteria){
    return await Model.directory.findOne({
        where : criteria
    });
};
async function findAndCreate(criteria, defaultObj){
    return await Model.directory.findOrCreate({
        where : criteria,
        defaults : defaultObj
    });
}

async function saveData(data){
    return await Model.directory.create(data);
}

async function rawQuery(query){
    return await Model.sequelize.query(query, { type: QueryTypes.SELECT });
}

async function updateRawQuery(query){
    return await Model.sequelize.query(query, { type: QueryTypes.UPDATE});
}

async function getCountAndFind(criteria, limit=0, offset=0, order=[]){
    return await Model.directory.findAndCountAll({
        where : criteria,
        offset,
        limit,
        order : order,
    });
}

async function update(critera ,setData){
    return await Model.directory.update(setData,{
        where : critera
    })
}