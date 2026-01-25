const express = require('express');
const router = express.Router();
const Size = require('../models/Size');

// GET all sizes
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        
        const sizes = await Size.find(filter).sort({ category: 1, createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            data: sizes,
            count: sizes.length 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// GET single size
router.get('/:id', async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);
        if (!size) {
            return res.status(404).json({ 
                success: false, 
                message: 'Size not found' 
            });
        }
        res.status(200).json({ success: true, data: size });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// CREATE size
router.post('/', async (req, res) => {
    try {
        const size = await Size.create(req.body);
        res.status(201).json({ success: true, data: size });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// UPDATE size
router.put('/:id', async (req, res) => {
    try {
        const size = await Size.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!size) {
            return res.status(404).json({ 
                success: false, 
                message: 'Size not found' 
            });
        }
        res.status(200).json({ success: true, data: size });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// DELETE size
router.delete('/:id', async (req, res) => {
    try {
        const size = await Size.findByIdAndDelete(req.params.id);
        if (!size) {
            return res.status(404).json({ 
                success: false, 
                message: 'Size not found' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Size deleted successfully',
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

