const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// GET all brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            data: brands,
            count: brands.length 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// GET single brand
router.get('/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ 
                success: false, 
                message: 'Brand not found' 
            });
        }
        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// CREATE brand
router.post('/', async (req, res) => {
    try {
        const brand = await Brand.create(req.body);
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Brand name already exists' 
            });
        }
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// UPDATE brand
router.put('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!brand) {
            return res.status(404).json({ 
                success: false, 
                message: 'Brand not found' 
            });
        }
        res.status(200).json({ success: true, data: brand });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Brand name already exists' 
            });
        }
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// DELETE brand
router.delete('/:id', async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ 
                success: false, 
                message: 'Brand not found' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Brand deleted successfully',
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
