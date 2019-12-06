const express = require("express");
const helmet = require("helmet");

const projectRouter = require("./data/helpers/projectRouter")
const actionRouter = require("./data/helpers/actionRouter")


const server = express();

server.use(helmet());
server.use(express.json());
server.use(logger);

server.get("/", (req, res) => {
    res.send("<h2>It's Working</h2>");
});

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

function logger(req, res, next){
    const timestamp = Date();

    console.log(`${req.method} to ${req.url} at ${timestamp} ✅`);

    next();
}

module.exports = server;