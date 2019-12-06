const express = require("express");
const Actions = require("./actionModel");

const router = express.Router();


router.get("/", (req, res) => {
    Actions
        .get()
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        })
})

router.get("/:id", validateActionId, (req, res) => {
    const id = req.params.id;

    Actions
        .get(id)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        })
});




router.put("/:id", validateActionId,  validateAction, (req, res) => {
    const id = req.params.id;
    const action = req.body;

    Actions
        .get(id)
        .then(() => {
            Actions
                .update(id, action)
                .then(() => {
                    res.status(200).json({message: "Action updated", action})
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

router.delete("/:id", validateActionId, (req, res) => {
    const id = req.params.id;

    Actions
        .remove(id)
        .then(action => {
            res.status(200).json({message: "Action removed", action})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
});


// Validate action id
function validateActionId(req, res, next){
    const id = req.params.id;

    Actions
        .get(id)
        .then(action => {
            if(!action){
                res.status(400).json({message: "Invalid action id"})
            }
            else{
                console.log(action)
                req.action = action;
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("Server could not be contacted.")
        });
}

function validateAction(req, res, next){
    const body = req.body;

    if(body && Object.keys(body).length === 0){
        res.status(400).json({message: "Missing project data"})
    }
    else if(body && (!body.notes || !body.description)){
        res.status(400).json({message: "Missing required field"})
    }
    else{
        next();
    }
}

module.exports = router;