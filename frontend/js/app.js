/**
 * Main Application Logic
 * Handles task management functionality
 */

// Check authentication
if (!isAuthenticated()) {
  window.location.href = 'login.html';
}

// Global state
let currentTaskId = null;
let taskToDelete = null;

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const loadingDiv = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');
const filterStatus = document.getElementById('filter-status');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Display user name
const user = getUser();
if (user) {
  userNameSpan.textContent = `Welcome, ${user.name}`;
}

// Logout handler
logoutBtn.addEventListener('click', () => {
  clearAuth();
  window.location.href = 'login.html';
});

/**
 * Show/hide loading state
 */
const setLoading = (isLoading) => {
  loadingDiv.style.display = isLoading ? 'block' : 'none';
};

/**
 * Show error message
 */
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
};

/**
 * Format date to readable string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get status class for styling
 */
const getStatusClass = (status) => {
  return status.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Create task card HTML
 */
const createTaskCard = (task) => {
  const statusClass = getStatusClass(task.status);
  
  return `
    <div class="task-card status-${statusClass}">
      <div class="task-header">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
      </div>
      <p class="task-description">${escapeHtml(task.description)}</p>
      <div class="task-meta">
        <span class="task-status status-${statusClass}">${task.status}</span>
        <span class="task-date">${formatDate(task.createdAt)}</span>
      </div>
      <div class="task-actions">
        <button class="btn btn-primary" onclick="editTask('${task._id}')">Edit</button>
        <button class="btn btn-danger" onclick="showDeleteModal('${task._id}')">Delete</button>
      </div>
    </div>
  `;
};

/**
 * Escape HTML to prevent XSS
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Load and display tasks
 */
const loadTasks = async (status = '') => {
  try {
    setLoading(true);
    errorMessage.style.display = 'none';
    
    const response = await taskAPI.getAllTasks(status);
    const tasks = response.data;
    
    if (tasks.length === 0) {
      taskList.innerHTML = '';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      taskList.innerHTML = tasks.map(task => createTaskCard(task)).join('');
    }
  } catch (error) {
    showError(error.message || 'Failed to load tasks');
    taskList.innerHTML = '';
  } finally {
    setLoading(false);
  }
};

/**
 * Reset form to add mode
 */
const resetForm = () => {
  taskForm.reset();
  currentTaskId = null;
  formTitle.textContent = 'Add New Task';
  submitBtn.textContent = 'Add Task';
  cancelBtn.style.display = 'none';
  document.getElementById('task-id').value = '';
};

/**
 * Edit task - Load task data into form
 */
window.editTask = async (taskId) => {
  try {
    const response = await taskAPI.getTaskById(taskId);
    const task = response.data;
    
    // Populate form
    document.getElementById('task-id').value = task._id;
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('status').value = task.status;
    
    // Update form UI
    currentTaskId = task._id;
    formTitle.textContent = 'Edit Task';
    submitBtn.textContent = 'Update Task';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showError(error.message || 'Failed to load task');
  }
};

/**
 * Show delete confirmation modal
 */
window.showDeleteModal = (taskId) => {
  taskToDelete = taskId;
  deleteModal.classList.add('active');
};

/**
 * Hide delete confirmation modal
 */
const hideDeleteModal = () => {
  taskToDelete = null;
  deleteModal.classList.remove('active');
};

/**
 * Delete task
 */
const deleteTask = async () => {
  if (!taskToDelete) return;
  
  try {
    await taskAPI.deleteTask(taskToDelete);
    hideDeleteModal();
    loadTasks(filterStatus.value);
  } catch (error) {
    hideDeleteModal();
    showError(error.message || 'Failed to delete task');
  }
};

/**
 * Handle form submission (Create or Update)
 */
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;
  
  const taskData = { title, description, status };
  
  try {
    if (currentTaskId) {
      // Update existing task
      await taskAPI.updateTask(currentTaskId, taskData);
    } else {
      // Create new task
      await taskAPI.createTask(taskData);
    }
    
    resetForm();
    loadTasks(filterStatus.value);
  } catch (error) {
    showError(error.message || 'Failed to save task');
  }
});

/**
 * Cancel edit
 */
cancelBtn.addEventListener('click', () => {
  resetForm();
});

/**
 * Filter tasks by status
 */
filterStatus.addEventListener('change', (e) => {
  loadTasks(e.target.value);
});

/**
 * Delete modal handlers
 */
confirmDeleteBtn.addEventListener('click', deleteTask);
cancelDeleteBtn.addEventListener('click', hideDeleteModal);

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) {
    hideDeleteModal();
  }
});

// Initial load
loadTasks();
