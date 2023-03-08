const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
// const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

// Route:1
//Get all the notes using: Get api/auth/fetchallnotes".login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
// Route:2
//Add a new notes using: Post api/notes/addnotes".login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be of 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are errors ,return Bad request and errors

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
// Route:3
//Updating an existing Note using: Post api/notes/updatenote".login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        //create a newnote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) { res.status(404).send("Not Found") }


        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");

        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }
})

// Route:4
//Delete an existing Note using: Delete api/notes/deletenote".login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        //Find the note to be delete and delete it
        let note = await Note.findById(req.params.id)
        if (!note) { res.status(404).send("Not Found") }

        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");

        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Notes has been Deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router