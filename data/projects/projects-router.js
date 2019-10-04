const express = require('express');
const Projects = require('../helpers/projectModel.js');
// const Posts = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser,(req, res) => {
    const newUser = req.body;

    Users.insert(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The user's information could not be posted."
            });
        });
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
   
    Posts.insert(req.body)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ Error: "The user with the specified ID was not found" })
            }

            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The user's information could not be posted."
            });
        });
});

router.get('/', (req, res) => {
    Users.get(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The users information could not be retrieved."
            });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    Users.getById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({ Error: "The user with the specified ID was not found" })
            }
            res.status(200).json(user);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The users information could not be retrieved."
            });
        });
});

router.get('/:id/posts', validateUserId, (req, res) => {

    id = req.user;
    Users.getUserPosts(id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ Error: "The user with the specified ID was not found" })
            }
            res.status(200).json(posts);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                error: "The user's posts could not be retrieved."
            });
        });
});

router.delete('/:id', validateUserId, (req, res) => {
    const id  = req.user

    Users.remove(id)
    .then(user => {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
            res.status(200).json({ message: 'RIP user' });
    })
    .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
            message: 'Error removing the user',
        });
    });
});

router.put('/:id', validateUserId, (req, res) => {
    const changes = req.body;
    const id = req.user;
    
    if (!changes.name) {
        res.status(400).json({ errorMessage: "Please provide a name for the user" });
    }

    Users.update(id, changes)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
            else {
                res.status(200).json(user);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error updating the user',
            });
        });
});

//custom middleware

function validateUserId(req, res, next) {
const userID = req.params.id;

if (userID) {
    req.user = userID;
    next()
}
else {
    res.status(404).json({ message: "Invalid user ID 564654" })
}


};

function validateUser(req, res, next) {
const user = req.body;

if(!user){
    res.status(400).json({ message: "Missing user data" })
}
else if(!user.name){
    res.status(400).json({ message: "Missing user name" })

}
else{
    next();
}
};

function validatePost(req, res, next) {
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
