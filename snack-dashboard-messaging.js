// Messaging functionality for snack-dashboard.html
// Add this script at the end of snack-dashboard.html before </body>

// Load offices for startups to message
async function loadOffices() {
    const container = document.getElementById('offices-list-container');
    if (!container) return;
    
    const API_BASE_URL = (() => {
        const hostname = window.location.hostname;
        if (hostname.includes('railway.app')) {
            return '/api';
        } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'https://snackreach-production.up.railway.app/api';
        } else {
            return 'http://localhost:3000/api';
        }
    })();
    
    const token = localStorage.getItem('snackreach_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/offices`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load offices');
        
        const offices = await response.json();
        
        if (offices.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-building"></i></div>
                    <h4>No offices found yet</h4>
                    <p>Office spaces will appear here once they join SnackReach.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="offices-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                ${offices.map(office => `
                    <div class="office-card" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1.1rem;">${escapeHtml(office.companyName || office.name)}</h4>
                        <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.9rem;">${escapeHtml(office.name || 'Office Manager')}</p>
                        <button class="btn btn-primary btn-small" onclick="showNewMessageModal('${office.id}', '${escapeHtml(office.companyName || office.name).replace(/'/g, "\\'")}')" style="width: 100%;">
                            <i class="fas fa-envelope"></i> Message
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading offices:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-exclamation-circle"></i></div>
                <h4>Error loading offices</h4>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Load messages for current user
async function loadMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    const API_BASE_URL = (() => {
        const hostname = window.location.hostname;
        if (hostname.includes('railway.app')) {
            return '/api';
        } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'https://snackreach-production.up.railway.app/api';
        } else {
            return 'http://localhost:3000/api';
        }
    })();
    
    const token = localStorage.getItem('snackreach_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load messages');
        
        const messages = await response.json();
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-comments"></i></div>
                    <h4>No messages yet</h4>
                    <p>Start a conversation with an office or view messages from office managers.</p>
                </div>
            `;
            return;
        }
        
        // Get current user ID from token (decode JWT or use stored value)
        // For now, we'll check fromUserType to determine direction
        container.innerHTML = messages.map(msg => {
            const isSent = msg.fromUserType === 'startup';
            const otherParty = isSent ? msg.toUserName : msg.fromUserName;
            
            return `
                <div class="message-item" style="background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid ${isSent ? '#667eea' : '#10b981'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div>
                            <strong style="color: #1f2937;">${isSent ? 'To' : 'From'}: ${escapeHtml(otherParty)}</strong>
                            <span style="color: #6b7280; font-size: 0.85rem; margin-left: 1rem;">${new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        ${!isSent && !msg.read ? '<span style="background: #667eea; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">New</span>' : ''}
                    </div>
                    <div style="font-weight: 600; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.1rem;">${escapeHtml(msg.subject)}</div>
                    <div style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(msg.message)}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading messages:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-exclamation-circle"></i></div>
                <h4>Error loading messages</h4>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Show new message modal
async function showNewMessageModal(officeId = null, officeName = null) {
    const modal = document.getElementById('new-message-modal');
    const toSelect = document.getElementById('message-to');
    const form = document.getElementById('new-message-form');
    
    if (!modal || !toSelect || !form) return;
    
    // Load offices into select
    const API_BASE_URL = (() => {
        const hostname = window.location.hostname;
        if (hostname.includes('railway.app')) {
            return '/api';
        } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'https://snackreach-production.up.railway.app/api';
        } else {
            return 'http://localhost:3000/api';
        }
    })();
    
    const token = localStorage.getItem('snackreach_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/offices`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const offices = await response.json();
            toSelect.innerHTML = '<option value="">Select an office...</option>' +
                offices.map(o => `<option value="${o.id}" ${officeId === o.id ? 'selected' : ''}>${escapeHtml(o.companyName || o.name)}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading offices:', error);
    }
    
    if (officeId) {
        toSelect.value = officeId;
    }
    
    form.reset();
    const errorDiv = document.getElementById('message-error');
    if (errorDiv) errorDiv.style.display = 'none';
    modal.style.display = 'flex';
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

