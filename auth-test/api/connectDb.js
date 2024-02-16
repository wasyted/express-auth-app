const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const dev_db_url = "mongodb+srv://laboratorio:4ntivar1@cluster0.akap3xz.mongodb.net/?retryWrites=true&w=majority";

const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

module.exports = db;