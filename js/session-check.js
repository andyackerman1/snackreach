/**
 * Session Management for SnackReach
 * Ensures persistent login sessions across all pages
 */

// Check if user is logged in and redirect if needed
function checkLoginStatus() {
    const token = localStorage.getItem('snackreach_token');
    const userType = localStorage.getItem('snackreach_user_type');
    
    if (token && userType) {
        // User is logged in - update navigation to show logged-in state
        updateNavigationForLoggedInUser(userType);
    }
}

// Update navigation bar for logged-in users
function updateNavigationForLoggedInUser(userType) {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;
    
    const userName = localStorage.getItem('snackreach_user_name') || 'User';
    const companyName = localStorage.getItem('snackreach_company_name') || '';
    
    // Determine dashboard URL based on user type
    const dashboardUrl = '/dashboard';
    
    // Update navigation buttons
    navButtons.innerHTML = `
        <a href="${dashboardUrl}" class="btn btn-primary">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
        </a>
        <button onclick="logout()" class="btn btn-outline">
            <i class="fas fa-sign-out-alt"></i>
            Log Out
        </button>
    `;
}

// Logout function - only clears session on explicit logout
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('snackreach_token');
        localStorage.removeItem('snackreach_user_type');
        localStorage.removeItem('snackreach_user_name');
        localStorage.removeItem('snackreach_company_name');
        window.location.href = 'index.html';
    }
}

// Make logout available globally
window.logout = logout;

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});




