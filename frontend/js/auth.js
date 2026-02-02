/**
 * Authentication Logic
 * Handles login and registration
 */

// Check which page we're on
const isLoginPage = document.getElementById('login-form');
const isRegisterPage = document.getElementById('register-form');

// Show error message
const showError = (message) => {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
};

// Handle Login
if (isLoginPage) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const data = await authAPI.login({ email, password });
      
      // Save auth data
      saveAuth(data);
      
      // Redirect to main app
      window.location.href = 'index.html';
    } catch (error) {
      showError(error.message || 'Login failed. Please try again.');
    }
  });
}

// Handle Registration
if (isRegisterPage) {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const data = await authAPI.register({ name, email, password });
      
      // Save auth data
      saveAuth(data);
      
      // Redirect to main app
      window.location.href = 'index.html';
    } catch (error) {
      showError(error.message || 'Registration failed. Please try again.');
    }
  });
}

// Check authentication on page load for login/register pages
if ((isLoginPage || isRegisterPage) && isAuthenticated()) {
  window.location.href = 'index.html';
}
