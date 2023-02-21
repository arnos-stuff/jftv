
const fs = require('fs-extra');
var { setupSybase } = require('../connect/setup.cjs');


async function syncRunSqlFile(sqlPath) {
    var db = setupSybase();
    var query = fs.readFileSync(sqlPath, 'utf8');

    const queryData = await new Promise( (success, failure) => {
        db.connect(function (err) {
            if (err) return console.log(err);
    
            return db.query(query, function (err, data) {
                if (err) console.log(err);
                fs.writeFileSync('data.json', JSON.stringify(data));
                db.disconnect();
                success(data);
            });
        });
    });
    return queryData;
}

async function syncRunSqlStr(queryString) {
    var db = setupSybase();

    const queryData = await new Promise( (success, failure) => {
        db.connect(function (err) {
            if (err) return console.log(err);
    
            return db.query(queryString, function (err, data) {
                if (err) console.log(err);
                db.disconnect();
                success(data);
            });
        });
    });
    return queryData;
}

async function asyncRunSqlStr(queryString) {
    var db = setupSybase();

    const queryData = new Promise( (success, failure) => {
        db.connect(function (err) {
            if (err) return console.log(err);
    
            return db.query(queryString, function (err, data) {
                if (err) console.log(err);
                db.disconnect();
                success(data);
            });
        });
    });
    return queryData.then( (data) => {
        return data;
    });
}

// run like this:
// $Env:SQL_QUERY='SELECT * FROM <table> WHERE <cond>' ; npm run inline

module.exports = {
    syncRunSqlFile,
    asyncRunSqlStr,
    syncRunSqlStr
}