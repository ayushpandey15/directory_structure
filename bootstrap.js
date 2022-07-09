let directoryServices = require('./services/directoryServices');
let lodash = require('lodash');

let drirectoryArr = require('./testCase').data;

async function bootstrap(){
    let parentId =null
    for(let data of drirectoryArr){
        let names = data.full_name.split('/');
        // console.log(names);
        // break;
        parentId =null;
        let i;
        for(i=0; i<names.length-1; i++){
            let [getDirct, created] = await directoryServices.findAndCreate({
                name : names[i]
            },{
                name : names[i],
                size : 0,
                parentId : parentId
            });
            parentId = getDirct.id;
            // await Model.directory.increment({size :data.size || 0},{where :{id : getDirct.id}});
        }

        let obj = {
            name : names[i],
            formate : data.type || "folder",
            size : data.size,
            parentId
        }
        let getData = await directoryServices.getOneDirector({name : names[i]});
        if(lodash.isEmpty(getData)){
            await directoryServices.saveData(obj);
        }
    }
}

bootstrap()