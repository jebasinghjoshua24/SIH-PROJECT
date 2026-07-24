const express = require("express");
const cors = require("cors");
const database = require('better-sqlite3');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

const db = new database('faults.db');


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})