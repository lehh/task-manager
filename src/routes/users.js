const express = require('express');
const router = express.Router();
const email = require('../email/forwarding');

//Model
const User = require('../models/user');

//Middleware
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.generateAuthToken();

        //user.tokens.push(token);
        await user.save();

        email.sendWelcome(user.email, user.name);

        res.status(201).send('Successfully registered user ' + user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        if (!user) {
            return res.status(401).send("You shall not pass. Email or password is wrong.");
        }

        const token = await user.generateAuthToken();

        user.tokens.push(token);
        await user.save();

        res.send('You shall pass');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token != req.token;
        });

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find({});

//         res.send(users);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// router.get('/:id', auth, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user)
//             return res.status(404).send();

//         res.send(user);
//     } catch (err) {
//         res.status(500).send(e);
//     }
// });

router.delete('/me', auth, async (req, res) => {
    try {
        await User.remove({ _id: req.user._id });
        res.send(`Deleted user ${req.user.name} successfully!`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// router.delete('/:id', auth, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);

//         if (!user)
//             res.status(404).send();

//         res.send('Deleted user successfully!' + user);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.patch('/me', auth, async (req, res) => {
    try {
        var bodyKeys = Object.keys(req.body);

        bodyKeys.forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();

        res.send('Successfully updated the user ' + req.user.name);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// router.patch('/:id', auth, async (req, res) => {
//     var bodyKeys = Object.keys(req.body);

//     try {
//         var user = await User.findById(req.params.id);

//         if (!user)
//             return res.status(404).send();

//         bodyKeys.forEach((key) => user[key] = req.body[key]);
//         await user.save();

//         res.send('Successfully updated the user ' + user);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

module.exports = router;