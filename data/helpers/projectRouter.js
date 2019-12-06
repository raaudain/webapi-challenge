const express = require("express");
const Projects = require("./projectModel");
const Actions = require("./actionModel")

const router = express.Router();


router.get("/", (req, res) => {
    
    Projects
        .get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});

router.get("/:id", validateProjectId, (req, res) => {
    const id = req.params.id;

    Projects
        .getProjectActions(id)
        .then(project => {
            console.log("get id", id)
            res.status(200).json(project)
        })
        .catch(err => {
            console.log("get id", id)
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});

router.post("/", validateProject, (req, res) => {
    const add = req.body;

    Projects
        .insert(add)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});

router.post("/:id/actions", validateProjectId, (req, res) => {
    const id = req.project.id;
    const action = req.body;

    Projects
        .get(id)
        .then(() => {
            Actions
                .insert({
                    project_id: id, 
                    description: action.description,
                    notes: action.notes
                })
                .then(() => {
                    res.status(201).json(action)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json("Server could not be contacted.")
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});

router.put("/:id", validateProjectId,  (req, res) => {
    const id = req.project.id;
    const project = req.body;

    Projects
        .getProjectActions(id)
        .then(() => {
            Projects
                .update(id, project)
                .then(() => {
                    res.status(200).json({message: "Project udpated", project})
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json("Server could not be contacted.")
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});

router.delete("/:id", validateProjectId, (req, res) => {
    const id = req.params.id;

    Projects
        .remove(id)
        .then(project => {
            res.status(200).json({message: "Project removed", project})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});


// Validate project id
function validateProjectId(req, res, next){
    const id = req.params.id;

    Projects
        .get(id)
        .then(project => {
            if(!project){
                res.status(400).json({message: "Invalid project id"})
            }
            else{
                console.log(project)
                req.project = project;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
}

function validateProject(req, res, next){
    const body = req.body;

    if(body && Object.keys(body).length === 0){
        res.status(400).json({message: "Missing project data"})
    }
    else if(body && (!body.name || !body.description)){
        res.status(400).json({message: "Missing required field"})
    }
    else{
        next();
    }
}

module.exports = router;