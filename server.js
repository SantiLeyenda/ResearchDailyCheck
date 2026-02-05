require('dotenv').config(); // Add this at the very top

const express = require("express");
const logsRouter = require("./routes/logs");
const experimentsRouter = require("./routes/experiments");


const app = express();

app.use(express.json());

app.use("/logs", logsRouter);
app.use("/experiments", experimentsRouter);



// Health check

app.get("/", (req, res) => {

    res.json({ok: true, message: "API running"});

})


app.use((err, req, res, next) => {

    console.error(err);
    res.status(500).json({error: "Something went wrong"});
})


app.listen(3000, () => console.log("Running on 3000"));