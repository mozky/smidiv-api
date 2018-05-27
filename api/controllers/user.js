'use strict';

const util = require('util')
const passwordHash = require('password-hash')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const config = require('../../config') // get our config file


module.exports = {
    getUsersList: function (req, res) {
        User.find({
                deleted: false,
                // occupation: /host/,
                // 'name.last': 'Ghost',
                // age: { $gt: 17, $lt: 66 },
                // likes: { $in: ['running', 'talking'] }
            })
            .limit(50)
            .sort({
                username: 1
            })
            .select('-_id username')
            .exec(function (err, users) {
                res.json(users)
            });
    },
    getUser: function (req, res) {
        // find one user with a given username
        const query = User.findOne({
            'username': req.swagger.params.username.value,
            'deleted': false
        });

        // ignoring deleteds

        // selecting the desired fields
        query.select('_id username email profile')

        query.populate({
            path: 'vehiculo',
            select: '_id marca modelo smidivID placas'
        })

        // execute the query
        query.exec(function (err, user) {
            if (err) {
                console.log('Error user.get', err);
                return res.status(500).json('Server error')
            }

            // this sends back a JSON response which is a single string
            if (!user) {
                return res.json('');
            }

            res.json({
                user: user
            });
        })

    },
    addUser: function (req, res) {
        const userObject = req.swagger.params.user.value;

        if (!userObject) res.status(400).json('Error');

        // We encrypt the password
        // Note: Encryption must be done on the front end not here!
        userObject.password = passwordHash.generate(userObject.password);

        const newUser = new User(userObject);

        newUser.save(function (err, newUser) {
            if (err) {
                if (err.code == 11000) res.status(400).json('Username already registered');
                return console.error(err);
            } else {
                console.log('New user saved', newUser)

                // We remove the password from the user object after creation
                newUser.password = undefined
                newUser.dateCreated = undefined
                newUser.dateUpdated = undefined
                newUser.deleted = undefined

                // We create a token with the user information
                var token = jwt.sign({
                    user: newUser
                }, config.secret, {
                    expiresIn: 60 * 60 * 72 // Sets expiration in 3 days
                });

                // Return authentication succesfull and token
                res.json({
                    success: true,
                    message: 'Enjoy your stay!',
                    token: token
                });
            }
        });

    },
    updateUser: function (req, res) {
        const username = req.swagger.params.username.value
        console.log('username', username)

        const updates = req.swagger.params.updates.value
        if (updates.password)
            updates.password = passwordHash.generate(updates.password)

        if (!updates || !username) res.status(400).json('Error')

        updates.dateUpdated = new Date()

        User.findOneAndUpdate({
            username: username
        }, {
            $set: updates
        }, {
            new: true
        }, function (err, updatedUser) {
            if (err || !updatedUser) {
                res.status(500).json('Error updating user')
                return console.error(err)
            } else {
                console.log(updatedUser)
                res.json(username + ' updated')
            }
        })
    },
    deleteUser: function (req, res) {
        const username = req.swagger.params.username.value;
        console.log('username', username);

        if (!username) res.status(400).json('Error');

        User.findOneAndUpdate({
            username: username
        }, {
            $set: {
                deleted: true,
                dateUpdated: new Date()
            }
        }, {
            new: true
        }, function (err, deletedUser) {
            if (err || !deletedUser) {
                res.status(500).json('Error deleting user');
                return console.error(err);
            } else {
                console.log(deletedUser);
                res.json(username + ' deleted');
            }
        });
    }
};