const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseHelper = require('firebase-functions-helper');
const express = require('express');
const bodyParser = require('body-parser');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const main = express();
const messageCollection = 'messages';
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as
// a parameter
exports.webApi = functions.https.onRequest(main);

//Post a new message
app.post('/messages', async (req, res) => {
    try {
        const message = {
            onwer: req.body['owner'],
            message: req.body['message'],
        };
        const newDoc = await firebaseHelper.firestore
            .createNewDocument(db, messageCollection, message);
        res.status(201).json({
            message: `Your message ${newDoc.id} has been posted succefuly`,
            api_version: '1.0',
            date: Date.now()
        });
    } catch (error) {
        res.status(400).json({
            message: `Be sur that your message has this field :  onwer, message !!!`,
            api_version: '1.0',
            date: Date.now()
        })
    }
});
// Update a part of the message
app.put('/messages/:id', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, messageCollection, req.params.id, req.body);
    res.status(200).json({
        message: `Your message ${updatedDoc} has been updated succefuly`,
        api_version: '1.0',
        date: Date.now()
    });
});
// Get a specific message by id
app.get('/messages/:id', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, messageCollection, req.params.id)
        .then(doc => res.status(200).json(doc))
        .catch(error => res.status(400).json({
            message: `An error occured when handling your request :  ${error}`,
            api_version: '1.0',
            date: Date.now()
        }));
});
// Get all messages
app.get('/messages', (req, res) => {
    firebaseHelper.firestore
        .backup(db, messageCollection)
        .then(data => res.status(200).json(data))
        .catch(error => res.status(400).json({
            message: `An error occured when handling your request :  ${error}`,
            api_version: '1.0',
            date: Date.now()
        }));
});
//API DOC
app.get('/doc', (req, res) => {
    res.status(200).json({
        guidlines: {
            title: 'This describe how a message data are setup',
            do:{
                post:{
                    message_shema: {
                        owner: 'String',
                        message: 'String'
                    },
                    response: {
                        object: {
                            message:'String',
                            api_version: 'Number',
                            time: 'Current date'
                        }
                    }
                },
                get: {
                    response: {
                        id: {
                            object: {
                                message:'String',
                                owner:'String',
                            }
                        },
                        without_id: {
                            response: [
                                {
                                    message:'String',
                                    owner:'String',
                                }
                            ]
                        }

                    }
                },
                put: {
                    id: 'The message id to update',
                    message_shema: {
                        owner: 'Not required',
                        message: 'Not Required'
                    },
                    response: {
                        object: {
                            message:'String',
                            api_version: 'Number',
                            time: 'Current date'
                        }
                    }
                },
                delete: {
                    id: 'The message id to remove',
                    response: {
                        object: {
                            message:'String',
                            api_version: 'Number',
                            time: 'Current date'
                        }
                    }
                }
            }
        },
        api_version: '1.0',
        date: Date.now()
    });
});
// Delete a specific message giving id
app.delete('/messages/:id', async (req, res) => {
    const deletedContact = await firebaseHelper.firestore
        .deleteDocument(db, messageCollection, req.params.id);
    res.status(200).json({
        message: `Your message ${deletedContact} has been deleted succefuly`,
        api_version: '1.0',
        date: Date.now()
    });
});
