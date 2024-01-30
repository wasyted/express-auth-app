const mongoose = require("mongoose");

const mongoDb = "mongodb+srv://laboratorio:4ntivar1@cluster0.akap3xz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
