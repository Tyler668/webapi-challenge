const express = require('express');
const Projects = require('../helpers/projectModel.js');
const Actions = require('../helpers/actionModel.js');
const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The actions information could not be retrieved."
            });
        });
});

router.get('/:id', validateActionId, (req, res) => {
    Actions.get(req.params.id)
        .then(action => {
            if (!action) {
                res.status(404).json({ Error: "The action with the specified ID was not found" })
            }
            res.status(200).json(action);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The actions information could not be retrieved."
            });
        });
});

router.get('/:id/actions', validateActionId, (req, res) => {

    id = req.action;
    Actions.getActionActions(id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ Error: "The action with the specified ID was not found" })
            }
            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The action's actions could not be retrieved."
            });
        });
});

router.post('/', validateAction, (req, res) => {
    const newAction = req.body;

    Actions.insert(newAction)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The action's information could not be posted."
            });
        });
});

router.delete('/:id', validateActionId, (req, res) => {
    const id = req.action

    Actions.remove(id)
        .then(action => {
            if (!action) {
                res.status(404).json({ message: "The action with the specified ID does not exist." })
            }
            res.status(200).json({ message: 'RIP action' });
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the action',
            });
        });
});

router.put('/:id', validateActionId, (req, res) => {
    const changes = req.body;
    const id = req.action;

    if (!changes.notes || !changes.description) {
        res.status(400).json({ errorMessage: "Please provide both notes and a description for the action" });
    }

    Actions.update(id, changes)
        .then(action => {
            if (!action) {
                res.status(404).json({ message: "The action with the specified ID does not exist." })
            }
            else {
                res.status(200).json(action);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error updating the action',
            });
        });
});

//custom middleware

function validateActionId(req, res, next) {
    const actionID = req.params.id;

    if (actionID) {
        req.action = actionID;
        next()
    }
    else {
        res.status(404).json({ message: "Invalid action ID " })
    }


};

function validateAction(req, res, next) {
    const action = req.body;

    if (!action) {
        res.status(400).json({ message: "Missing action data" })
    }
    else if (!action.description || !action.notes) {
        res.status(400).json({ message: "Missing either action description / notes" })

    }
    else {
        next();
    }
};

// function validateAction(req, res, next) {
//     const post = req.body;

//     if(!post){
//         res.status(400).json({ message: "Missing post data" })
//     }
//     else if(!post.text){
//         res.status(400).json({ message: "Missing post text" })

//     }
//     else{
//         next();
//     }
// };

module.exports = router;
