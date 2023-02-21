import _ from 'lodash';
var { syncRunSqlStr } = require('./query.cjs');

async function scanKpi(db='oscar_dmf') {
  return await syncRunSqlStr(`
  SELECT t.name as TABLE_NAME
  FROM ${db}..sysobjects t
  WHERE t.name LIKE 'ZZZ_%'`);
}

async function getVersionsDMF(db='oscar_dmf') {
    var queryData = await syncRunSqlStr(`    
    SELECT SUBSTRING(t.name, 5, 2) AS VERSION
    FROM ${db}..sysobjects t WHERE t.name LIKE 'WonV%'
    `);

    var versions = _.map(queryData, (row) => {
        try {
            return parseInt(row.VERSION);
        }
        catch (err) {
            return 0;
        }
    });
    return versions;
}

async function getlatestDMF(db='oscar_dmf') {
    var versions = await getVersionsDMF(db);
    return _.max(versions);
}

async function versionDMFGreaterThan(version, db='oscar_dmf') {
    return _.some(versions, (v) => v > version);
}

async function stringGreaterThanVersionDMF(name, version, db='oscar_dmf') {
    var matches = name.match(/WonV(\d+)/);
    if (matches) {
        var version = parseInt(matches[1]);
        return version > version;
    }
    matches = name.match(/V(\d+)/);
    if (matches) {
        var version = parseInt(matches[1]);
        return version > version;
    }
    return false;
}


module.exports = {
    scanKpi,
    getVersionsDMF,
    getlatestDMF,
    versionDMFGreaterThan,
    stringGreaterThanVersionDMF
}
