const express = require('express');
const router = express.Router();
const Color = require('../models/Color');

// GET all colors
router.get('/', async (req, res) => {
    try {
        const colors = await Color.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            data: colors,
            count: colors.length 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// GET single color
router.get('/:id', async (req, res) => {
    try {
        const color = await Color.findById(req.params.id);
        if (!color) {
            return res.status(404).json({ 
                success: false, 
                message: 'Color not found' 
            });
        }
        res.status(200).json({ success: true, data: color });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// CREATE color
router.post('/', async (req, res) => {
    try {
        const color = await Color.create(req.body);
        res.status(201).json({ success: true, data: color });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Color name already exists' 
            });
        }
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// UPDATE color
router.put('/:id', async (req, res) => {
    try {
        const color = await Color.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!color) {
            return res.status(404).json({ 
                success: false, 
                message: 'Color not found' 
            });
        }
        res.status(200).json({ success: true, data: color });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Color name already exists' 
            });
        }
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// DELETE color
router.delete('/:id', async (req, res) => {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);
        if (!color) {
            return res.status(404).json({ 
                success: false, 
                message: 'Color not found' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Color deleted successfully',
            data: {} 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;
