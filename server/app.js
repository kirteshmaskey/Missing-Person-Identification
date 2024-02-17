require('dotenv').config();
require('./db/conn');
const express = require("express");
const cors = require("cors");

const missingPerson = require('./controllers/registerMissingPerson');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("images"));

app.use('/api', missingPerson);

app.listen(port, () => {
  console.log(`Server running on port ::: ${port}`);
});
