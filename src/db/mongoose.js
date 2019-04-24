const mongoose = require('mongoose');
const fs = require('fs');

const password = process.env.MONGODB_PW;
const user = process.env.MONGODB_USER;
const server = process.env.MONGODB_SERVER; //localhost
const db = process.env.MONGODB_DB;
const options = process.env.MONGODB_OPT;

var url = `mongodb+srv://${user}:${password}@${server}/${db}${options}`;

//localhost url.
//var url = `mongodb://${server}/${db}${options}`;

mongoose.connect(url, {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: 1000000,    
    reconnectInterval: 3000,
    bufferMaxEntries: 0,
    useCreateIndex: true
});

mongoose.connection.on('connected', function () {
    console.log('Connected to mongo database');
});

mongoose.connection.on('error', function (err) {
    console.log('An error occurred while connecting to mongo database: ' + err);
    process.exit(0);
});

mongoose.connection.on('disconnected', function () {
    console.log('Disconnected from mongo database');
});

function handleProcessTerm(signal) {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
}

//If node process ends, close connection with mongo database.
process.on('SIGTERM', handleProcessTerm);
process.on('SIGINT', handleProcessTerm);

module.exports = mongoose
