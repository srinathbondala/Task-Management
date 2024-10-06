import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the User Page');
});

router.get('/profile', (req, res) => {
    res.send('Welcome to the User Profile Page');
});

router.get('/tasks', (req, res) => {
    res.send('Welcome to the User Tasks Page');
});

router.get('/tasks/:id', (req, res) => {
    res.send('Welcome to the User Task By Id Page');
});

router.post('/tasks', (req, res) => {
    res.send('Welcome to the User Task Create Page');
});

router.put('/tasks/:id', (req, res) => {
    res.send('Welcome to the User Task Update Page');
});

router.delete('/tasks/:id', (req, res) => {
    res.send('Welcome to the User Task Delete Page');
});

router.get('/logout', (req, res) => {
    res.send('Welcome to the User Logout Page');
});

router.get('/taskspriority', (req, res) => {
    res.send('Welcome to the User Tasks Priority Page');
});

modules.exports = router;