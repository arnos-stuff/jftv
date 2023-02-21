var { setupFromArgs, setupSybase } = require('./connect/setup.cjs');
var { syncRunSqlFile, syncRunSqlStr } = require('./execute/query.cjs');

const yargs = require('yargs/yargs');
const fs = require('fs-extra');

const argv = yargs(process.argv.slice(2))
    .command("query", "Run a T-SQL query from the command line", (yargs) => {
        yargs.positional("input", {
            alias: ["i"], // one-letter version
            describe: "The T-SQL query to run",
            type: "string",
        })
        .option("out", {
            alias: ["o"], // one-letter version
            description: "The output file to write the results to",
            type: "string",
        });
    },
    async (argv) => {

        if (!argv.input) {
            console.log("No query provided. Use the -i or --input flag to provide a query.");
            return;
        }
        console.log("Runnning Query:\n" + argv.input);
        var db = setupFromArgs(argv);
        var query = argv.input;
        var data = await syncRunSqlStr(query);
        console.log(`Query Results: ${data.length} rows retrieved`);
        if (argv.out) {
            console.log(`Writing results to ${argv.out}`);
            fs.writeFileSync(argv.out, JSON.stringify(data));
        }
        else {
            fs.writeFileSync('data.json', JSON.stringify(data));
        }
    })
    .command("query-file", "Run a T-SQL query from a file", (yargs) => {
        yargs.positional("file", {
            alias: ["f"], // one-letter version
            describe: "The T-SQL file to run",
            type: "string",
        });
    }, (argv) => {
        if (!argv.file) {
            console.log("No query provided. Use the -f or --file     flag to provide a query.");
            return;
        }
        console.log(argv.file);
        var db = setupFromArgs(argv);
        var file = argv.file;
        var data = syncRunSqlFile(file);
        console.log(data);
    })
    
    .option("host", {
            alias: ["ho"], // one-letter version
            description: "Host of the Sybase server, e.g. 'localhost'. Default is '10.250.6.212'.",
            type: "string",
        })
    .option("port", {
        alias: ["p"], // one-letter version
        description: "Port of the Sybase server, e.g. '5000' or '5020'. Default is '5020'.",
        type: "string",
    })
    .option("database", {
        alias: ["db"], // one-letter version
        description: "Your Sybase database name, e.g. 'mydb'. Default is 'oscar_tma'.",
        type: "string",
    })
    .option("user", {
        alias: ["u"], // one-letter version
        description: "Your Sybase username, e.g. 'myuser'. Default is 'oscardmf_adm'.",
        type: "string",
    })
    .option("password", {
        alias: ["pw"], // one-letter version
        description: "Your Sybase password, e.g. 'mypassword'. Default is 'oskdmf1*!'.",
        type: "string",
    })
    .demandCommand() // require a subcommand
    .strict() // require a VALID subcommand, and only supported options
    .help() // the coolest part of yargs is that it builds the usage output, but only if you tell it to
    .argv; // trigger the parsing. If you forget this, it does nothing
