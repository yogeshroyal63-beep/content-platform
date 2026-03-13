const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Content, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All content routes require authentication
router.use(authenticate);

// POST /api/content — Create new content
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
  body('body').trim().isLength({ min: 1 }).withMessage('Body content is required'),
  body('category').optional().isIn(['article', 'tutorial', 'news', 'review', 'other']),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { title, body: bodyText, category = 'article', tags = [], status = 'published' } = req.body;

    const content = await Content.create({
      title,
      body: bodyText,
      category,
      tags,
      status,
      authorId: req.user.id,
    });

    const fullContent = await Content.findByPk(content.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully.',
      data: { content: fullContent },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/content — Fetch content with pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().isIn(['article', 'tutorial', 'news', 'review', 'other']),
  query('status').optional().isIn(['draft', 'published', 'archived']),
  query('search').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    const { category, status, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { body: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Content.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        content: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/content/:id — Get single content
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
    });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found.' });

    await content.increment('views');
    res.json({ success: true, data: { content } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/content/:id
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found.' });
    if (content.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await content.destroy();
    res.json({ success: true, message: 'Content deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
