const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 * @query   status - Filter by status (optional)
 */
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    let query = { user: req.user._id };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this task',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  [
    protect,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Status must be To Do, In Progress, or Done'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { title, description, status } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || 'To Do',
        user: req.user._id,
      });

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  [
    protect,
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('status')
      .optional()
      .isIn(['To Do', 'In Progress', 'Done'])
      .withMessage('Status must be To Do, In Progress, or Done'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      let task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Make sure user owns the task
      if (task.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }

      task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      // Handle invalid ObjectId
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task removed',
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
