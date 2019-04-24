const express = require('express');
const router = express.Router();

//Model
const Task = require('../models/task');

//Middlewares
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const task = new Task(req.body);
        task.owner = req.user._id;

        await task.save();

        res.status(201).send('Success');
    } catch (err) {
        res.status(500).send('Error: ' + err);
    }
});

router.get('/', auth, async (req, res) => {
    //Query params
    const { sortBy, filter, limit, skip } = req.query;

    const filters = {};
    const sort = {};

    try {
        if (filter) {
            const params = filter.split('_');

            params.forEach((value) => {
                let paramParts = value.split(':');
                filters[paramParts[0]] = paramParts[1];
            });
        }

        if (sortBy) {
            const params = sortBy.split('_');

            params.forEach((value) => {
                let paramParts = value.split(':');
                sort[paramParts[0]] = paramParts[1];
            });
        }

        //For better performance with large amounts of data, it's better to replace skip with a filter 
        //"_id: { $gt: lastId }" to get the next page items.
        const tasks = await Task.find({ owner: req.user._id, ...filters })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort(sort);

        res.send(tasks);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//Express automatically adds the id property to the req params.
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task)
            return res.status(404).send();

        res.send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task)
            return res.status(404).send();
        ;

        res.send('Deleted Successfully' + task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/:id', auth, async (req, res) => {
    const bodyKeys = Object.keys(req.body);

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task)
            return res.status(404).send();

        bodyKeys.forEach((key) => task[key] = req.body[key]);
        await task.save();

        res.send('Successfully updated task!' + task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;