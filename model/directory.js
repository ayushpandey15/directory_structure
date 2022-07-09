"use strict";

const Sequelize = require("sequelize");

console.log("inside dirtory")

module.exports = (sequelize, DataTypes)=>{
    var directory = sequelize.define("directory", {
        id : {type : Sequelize.BIGINT, primaryKey : true, autoIncrement: true},
        name : {type : DataTypes.STRING(255), allowNull : false},
        formate : {type : DataTypes.STRING(50), allowNull : false, defaultValue : "folder"},
        size : {type : DataTypes.INTEGER, allowNull : false, defaultValue : 0},
        parentId : {type : Sequelize.BIGINT, allowNull : true, defaultValue :null},
        isDeleted : {type : Sequelize.BOOLEAN, allowNull : false, defaultValue : 0}
    },{
        timestamps : true
    },{
        indexes : [{
            fields : ["parentId"]
        }]
    });
    return directory;
};