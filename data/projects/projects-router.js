const express = require('express');
const Projects = require('../helpers/projectModel.js');
const Actions = require('../helpers/actionModel.js');
const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The projects information could not be retrieved."
            });
        });
});

router.get('/:id', validateProjectId, (req, res) => {
    Projects.get(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({ Error: "The project with the specified ID was not found" })
            }
            res.status(200).json(project);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The projects information could not be retrieved."
            });
        });
});

router.get('/:id/actions', validateProjectId, (req, res) => {

    id = req.project;
    Projects.getProjectActions(id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ Error: "The project with the specified ID was not found" })
            }
            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The project's actions could not be retrieved."
            });
        });
});

router.post('/', validateProject, (req, res) => {
    const newProject = req.body;

    Projects.insert(newProject)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The project's information could not be posted."
            });
        });
});

router.post('/:id/actions', validateProjectId, (req, res) => {

    Actions.insert(req.body)
        .then(action => {
            if (!action) {
                res.status(404).json({ Error: "The project with the specified ID was not found" })
            }

            res.status(200).json(action);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The action could not be posted."
            });
        });
});

router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.project

    Projects.remove(id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: "The project with the specified ID does not exist." })
            }
            res.status(200).json({ message: 'RIP project' });
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the project',
            });
        });
});

router.put('/:id', validateProjectId, (req, res) => {
    const changes = req.body;
    const id = req.project;

    if (!changes.name || !changes.description) {
        res.status(400).json({ errorMessage: "Please provide both a name and description for the project" });
    }

    Projects.update(id, changes)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: "The project with the specified ID does not exist." })
            }
            else {
                res.status(200).json(project);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error updating the project',
            });
        });
});

//custom middleware

function validateProjectId(req, res, next) {
    const projectID = req.params.id;

    if (projectID) {
        req.project = projectID;
        next()
    }
    else {
        res.status(404).json({ message: "Invalid project ID " })
    }


};

function validateProject(req, res, next) {
    const project = req.body;

    if (!project) {
        res.status(400).json({ message: "Missing project data" })
    }
    else if (!project.name) {
        res.status(400).json({ message: "Missing project name" })

    }
    else {
        next();
    }
};

function validateAction(req, res, next) {
    const post = req.body;

    if(!post){
        res.status(400).json({ message: "Missing post data" })
    }
    else if(!post.text){
        res.status(400).json({ message: "Missing post text" })

    }
    else{
        next();
    }
};

module.exports = router;
