# Messaging Functionality Update Guide

## Changes needed to snack-dashboard.html

### 1. Update Discover Offices Tab (around line 163)

**Replace:**
```html
<div class="empty-state">
    <div class="empty-icon">
        <i class="fas fa-building"></i>
    </div>
    <h4>No offices found yet</h4>
    <p>Office spaces will appear here once they join SnackReach...</p>
</div>
```

**With:**
```html
<div id="offices-list-container">
    <div class="empty-state">
        <div class="empty-icon">
            <i class="fas fa-building"></i>
        </div>
        <h4>Loading offices...</h4>
        <p>Finding office spaces you can connect with.</p>
    </div>
</div>
```

### 2. Update Messages Tab (around line 217)

**Replace:**
```html
<div class="section-header">
    <h3>Messages</h3>
    <div class="message-limit-info">
        <span class="limit-text">0/10 messages sent today</span>
        ...
    </div>
</div>
<div class="empty-state">
    <div class="empty-icon">
        <i class="fas fa-comments"></i>
    </div>
    <h4>No messages yet</h4>
    <p>Messages from office managers will appear here...</p>
</div>
```

**With:**
```html
<div class="section-header">
    <h3>Messages</h3>
    <button class="btn btn-primary btn-small" onclick="showNewMessageModal()">
        <i class="fas fa-plus"></i>
        New Message
    </button>
</div>
<div id="messages-container">
    <div class="empty-state">
        <div class="empty-icon">
            <i class="fas fa-comments"></i>
        </div>
        <h4>No messages yet</h4>
        <p>Start a conversation with an office or view messages from office managers.</p>
    </div>
</div>
```

### 3. Add New Message Modal (after Messages Tab, before Account Tab)

**Add this before `<!-- Account Tab -->`:**
```html
<!-- New Message Modal -->
<div id="new-message-modal" class="modal" style="display: none;">
    <div class="modal-content modal-large">
        <div class="modal-header">
            <h2>New Message</h2>
            <span class="close" onclick="closeModal('new-message-modal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="new-message-form">
                <div class="form-group">
                    <label for="message-to">To (Office)</label>
                    <select id="message-to" required>
                        <option value="">Select an office...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="message-subject">Subject</label>
                    <input type="text" id="message-subject" placeholder="Enter message subject" required>
                </div>
                <div class="form-group">
                    <label for="message-body">Message</label>
                    <textarea id="message-body" rows="6" placeholder="Enter your message here..." required></textarea>
                </div>
                <div id="message-error" class="error-message" style="display: none; margin-bottom: 1rem; padding: 0.75rem; background: #fee2e2; color: #dc2626; border-radius: 6px;"></div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal('new-message-modal')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
```

### 4. Update DOMContentLoaded (around line 531)

**Find:**
```javascript
loadSnackProfile();
loadPaymentMethods();
});
```

**Add after:**
```javascript
loadSnackProfile();
loadPaymentMethods();
loadOffices();
loadMessages();
});
```

### 5. Update showTab function (around line 990)

**Find:**
```javascript
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}
```

**Replace with:**
```javascript
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Reload data when switching tabs
    if (tabName === 'discover') {
        loadOffices();
    } else if (tabName === 'messages') {
        loadMessages();
    }
}
```

### 6. Add messaging functions (before closing </script> tag)

**Add before the last `</script>` tag:**
```javascript
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
                    <div class="office-card" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1f2937;">${escapeHtml(office.companyName || office.name)}</h4>
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
    }
}

// Show new message modal
async function showNewMessageModal(officeId = null, officeName = null) {
    const modal = document.getElementById('new-message-modal');
    const toSelect = document.getElementById('message-to');
    const form = document.getElementById('new-message-form');
    
    if (!modal || !toSelect || !form) return;
    
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

// Handle new message form submission
document.addEventListener('DOMContentLoaded', function() {
    const newMessageForm = document.getElementById('new-message-form');
    if (newMessageForm) {
        newMessageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const toUserId = document.getElementById('message-to').value;
            const subject = document.getElementById('message-subject').value;
            const message = document.getElementById('message-body').value;
            const errorDiv = document.getElementById('message-error');
            
            errorDiv.style.display = 'none';
            
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
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const response = await fetch(`${API_BASE_URL}/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ toUserId, subject, message })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    closeModal('new-message-modal');
                    loadMessages();
                    alert('Message sent successfully!');
                } else {
                    errorDiv.textContent = data.error || 'Failed to send message';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                console.error('Error sending message:', error);
                errorDiv.textContent = 'Failed to send message. Please try again.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});
```

## Summary

The backend messaging API is complete and ready. You need to update the snack-dashboard.html file with the changes above to enable:
1. **Discover Offices Tab** - Shows list of offices with "Message" buttons
2. **Messages Tab** - Shows sent/received messages with "New Message" button
3. **New Message Modal** - Form to compose and send messages to offices

All backend endpoints are ready:
- `GET /api/offices` - List offices (startup only)
- `POST /api/messages` - Send message
- `GET /api/messages` - Get all messages
- `PUT /api/messages/:id/read` - Mark as read

