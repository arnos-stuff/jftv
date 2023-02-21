const fs = require('fs-extra');
const Sybase = require('sybase');


const { readJsonSync } = fs;

function readConfig() {
    var config = readJsonSync('sybase.config.json');
    return config;
}

function setupSybase() {
    var config = readConfig();

    var db = new Sybase(
        config.host,
        config.port,
        config.database,
        config.user,
        config.password,
    );
    return db;
}

function setupFromArgs(yargs) {
    var config = readConfig();

    const { host, port, database, user, password } = yargs;

    if (host) config.host = host;
    if (port) config.port = port;
    if (database) config.database = database;
    if (user) config.user = user;
    if (password) config.password = password;

    var db = new Sybase(
        config.host,
        config.port,
        config.database,
        config.user,
        config.password,
    );
    return db;
}


module.exports = {
    setupSybase,
    setupFromArgs,
    readConfig
}