
// =====================================================================================================================================================================
// aa-whisper
// made by aa using ai
// =====================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    // ====================================================================================================
    // FIREBASE INITIALIZATION
    // ====================================================================================================
    
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDju8FmvZmgT6Subk2D7StKW_tzV5oKdao",
        authDomain: "aa-whisper.firebaseapp.com",
        databaseURL: "https://aa-whisper-default-rtdb.firebaseio.com",
        projectId: "aa-whisper",
        storageBucket: "aa-whisper.appspot.com",
        messagingSenderId: "996959903815",
        appId: "1:996959903815:web:065f98c97fa713315d5162",
        measurementId: "G-1HP9YSMHD8"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();

    // Initialize Firebase Storage with error handling
    let storage;
    try {
        storage = firebase.storage();
        console.log("🔥✔️ Firebase Storage initialized");
    } catch (error) {
        console.error("🔥❌ Firebase Storage initialization failed:", error);
        console.log("Make sure you've included the Firebase Storage script in your HTML");
        
        // Disable image upload UI if Storage is not available
        const uploadElements = [
            'image-upload-btn',
            'image-input',
            'image-preview-container'
        ];
        
        uploadElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Set auth persistence
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log("📎✔️ auth persistence set to local.");
        })
        .catch((error) => {
            console.error("📎❌ error setting auth persistence:", error);
        });

    // ====================================================================================================
    // GLOBAL VARIABLES AND STATE MANAGEMENT
    // ====================================================================================================

    console.log("%c welcome to whisper! ", 'font-size: 30px; font-color: white; background: linear-gradient(135deg, #1a1a2e, #32264a); border: 1px solid #fff; border-radius: 30px; font-weight: 1000;');

    // DOM elements
    const authContainer = document.getElementById('auth-container');
    const appMain = document.getElementById('app-main');
    const guestTab = document.getElementById('guest-tab');
    const accountTab = document.getElementById('account-tab');
    const guestPanel = document.getElementById('guest-panel');
    const accountPanel = document.getElementById('account-panel');
    const signupPanel = document.getElementById('signup-panel');
    const usernamePanel = document.getElementById('username-panel');
    const guestUsername = document.getElementById('guest-username');
    const guestLoginBtn = document.getElementById('guest-login-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const displayName = document.getElementById('display-name');
    const signupBtn = document.getElementById('signup-btn');
    const chooseUsername = document.getElementById('choose-username');
    const setUsernameBtn = document.getElementById('set-username-btn');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const enableBtn = document.getElementById('enable-notification-btn');
    const roomList = document.getElementById('room-list');
    const newRoomName = document.getElementById('new-room-name');
    const userList = document.getElementById('user-list');
    const currentRoomName = document.getElementById('current-room-name');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const recordVoiceBtn = document.getElementById('record-voice-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const refreshUsersBtn = document.getElementById('refresh-users-btn');
    const recentChatsList = document.getElementById('recent-chats-list');
    const startNewChatBtn = document.getElementById('start-new-chat-btn');
    const newChatModal = document.getElementById('new-chat-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const openNewRoomModalBtn = document.getElementById('open-new-room-modal-btn');
    const newRoomModal = document.getElementById('new-room-modal');
    const closeNewRoomModalBtn = document.getElementById('close-new-room-modal-btn');
    const newRoomNameModal = document.getElementById('new-room-name-modal');
    const newRoomErrorMessage = document.getElementById('new-room-error-message');
    const searchUserInput = document.getElementById('search-user-input');
    const searchResults = document.getElementById('search-results');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const loadingOverlay = document.getElementById("loadingOverlay");
    
    // Admin-specific DOM elements
    const adminPanel = document.getElementById('admin-section');
    const banUserBtn = document.getElementById('ban-user-btn');
    const unbanUserBtn = document.getElementById('unban-user-btn');
    const adminUserSelect = document.getElementById('admin-user-select');
    const adminReasonInput = document.getElementById('admin-reason-input');
    const adminActionMessage = document.getElementById('admin-action-message');
    
    // Leader-specific DOM elements
    const grantAdminBtn = document.getElementById('grant-admin-btn');
    const revokeAdminBtn = document.getElementById('revoke-admin-btn')
    
    // Image upload elements
    const imageInput = document.getElementById('image-input');
    const uploadBtn = document.getElementById('image-upload-btn');
    const previewContainer = document.getElementById('image-preview-container');
    const cancelBtn = document.getElementById('cancel-image-btn');
    const imagePreview = document.getElementById('image-preview');
    const imageName = document.getElementById('image-name');
    const imageSize = document.getElementById('image-size');
    
    // State variables
    let currentUser = null;
    let adminConfirmedShown = false;
    let currentRoom = 'general';
    let isTyping = false;
    let typingTimer = null;
    let privateChatUser = null;
    let heartbeatInterval = null;
    let recentChats = [];
    let collapsedSections = {};
    let allUsers = {};
    let bannedUsers = {};
    let adminUsers = {};
    let messagesRef = null;
    let replyingTo = null;
    let loadingTasks = 0;
    let messagesCallback = null;
    let currentMessagesRef = null;
    let usersValueCallback = null;
    let selectedImage = null;
    let isUploading = false;
    let isRecording = false;
    let mediaRecorder = null;
    let audioChunks = []; 
    let isInitialized = false;

    // ====================================================================================================
    // UTILITY FUNCTIONS
    // ====================================================================================================
    
    // Structured logging helper with optional color-coding
    function log(message, level = 0, feature = null, ...data) {
        const indent = '    '.repeat(level);
        let color = 'inherit'; // default color
        let borderLeft = 'transparent'; // default border
        
        // Assign colors based on feature
        if (feature === 'app') {
            color = '#bb86fc'; 
            borderLeft = '#bb86fc', '3px'; // Signature Purple
        }
        if (feature === 'auth') {
            color = '#309b2cff'; 
            borderLeft = '#309b2cff', '3px'; // Green
        }
        if (feature === 'admin') {
            color = '#308eb9ff'; 
            borderLeft = '#308eb9ff', '3px'; // Blue
        }
        if (feature === 'message') {
            color = '#c1cc2eff'; 
            borderLeft = '#c1cc2eff', '3px'; // Yellow
        }
        if (feature === 'ban') {
            color = '#e74c3c'; 
            borderLeft = '#e74c3c', '3px'; // Red
        }
        if (feature === 'user') {
            color = '#ce8716ff'; 
            borderLeft = '#ce8716ff', '3px'; // Orange
        }
        
        // Use %c for styling in the console
        console.log(
            `%c${indent}${message}`,
            `color:${color}; font-weight:bold; border-left:3px solid ${borderLeft}; padding-left:5px;`,
            ...data
        );
    }
    
    // Sound effect for new messages when tab is inactive
    function isTabActive() {
        return !document.hidden;
    }
    
    // Timestamp formatting
    function formatTimestamp(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    // Simple date format
    function formatShortDate(date) {
        const messageDate = new Date(date);
        const today = new Date();
        
        if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        return messageDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Format timestamp to readable time
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Helper function to set a button's loading state
    function setButtonLoading(buttonElement, isLoading) {
        if (!buttonElement) return; // Added: Null check
        
        if (isLoading) {
            // Save original text and disable the button
            buttonElement.dataset.originalText = buttonElement.textContent;
            buttonElement.disabled = true;
            buttonElement.classList.add('button-loading');
            
            // Clear the button and add the spinner
            buttonElement.innerHTML = '<span class="spinner"></span>';
        } else {
            // Restore the original text and re-enable the button
            buttonElement.disabled = false;
            buttonElement.classList.remove('button-loading');
            buttonElement.textContent = buttonElement.dataset.originalText;
        }
    }

    // Check if current user is an admin
    function isCurrentUserAdmin() {
        return currentUser && (adminUsers[currentUser.uid] || isCurrentUserLeader());
    }

    // Check if current user is a leader
    function isCurrentUserLeader() {
        return currentUser && window.leaderIds && window.leaderIds[currentUser.uid];
    }

    // Check if a user is banned
    function isUserBanned(userId) {
        return bannedUsers[userId];
    }

    // Show admin notification
    function showAdminNotification(message, type = 'info') {
        if (!adminActionMessage) return;
        
        adminActionMessage.textContent = message;
        adminActionMessage.className = `admin-notification ${type}`;
        adminActionMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            adminActionMessage.style.display = 'none';
        }, 5000);
    }

    // Refresh users in admin user selection
    function updateAdminUserSelect() {
        if (!adminUserSelect) return;
        
        // Clear existing options
        adminUserSelect.innerHTML = '';
        
        // Add default "Select User" option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'pick one..';
        defaultOption.selected = true;
        defaultOption.disabled = true;
        adminUserSelect.appendChild(defaultOption);
        
        // 1. Create an array from the users object
        const usersArray = [];
        Object.keys(allUsers).forEach(userId => {
            if (userId === currentUser.uid) return; // Don't add yourself
            
            const user = allUsers[userId];
            if (!user) return;
            
            usersArray.push({
                userId: userId,
                displayName: user.displayName || 'Unknown User',
                isAdmin: adminUsers[userId],
                isBanned: bannedUsers[userId],
                isLeader: window.leaderIds && window.leaderIds[userId]
            });
        });
        
        // 2. Sort the array alphabetically by displayName
        usersArray.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        // 3. Add the sorted users to the dropdown
        usersArray.forEach(user => {
            const option = document.createElement('option');
            option.value = user.userId;
            
            // Build the display text with indicators
            let displayText = user.displayName;
            if (user.isLeader) {
                displayText += ' (Leader)';
            } else if (user.isAdmin) {
                displayText += ' (Admin)';
            }
            if (user.isBanned) {
                displayText += ' (Banned)';
            }
            
            option.textContent = displayText;
            adminUserSelect.appendChild(option);
        });
    }

    // Refresh users
    function addRefreshIconAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes admin-refresh-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .admin-section .refresh-icon.spinning {
                animation: admin-refresh-spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Call this function once when the page loads
    addRefreshIconAnimation();

    async function refreshUsersList() {
        try {
            // Show loading state
            const refreshBtn = document.getElementById('refresh-admin-users-btn');
            if (refreshBtn) {
                refreshBtn.disabled = true;
                refreshBtn.querySelector('.refresh-icon').classList.add('spinning');
            }
            
            // Reload users from database
            await loadUsers();
            
            // Update UI
            updateAdminUserSelect();
            loadContactsList();
            
            notifications.success("users list refreshed, bro.", 'success', 3000);
        } catch (error) {
            console.error("👥📋❌ error refreshing users list:", error);
            notifications.error("couldn't refresh users list, bro. check the console.", 'error', 5000);
        } finally {
            // Reset loading state
            const refreshBtn = document.getElementById('refresh-admin-users-btn');
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.querySelector('.refresh-icon').classList.remove('spinning');
            }
        }
    }

    // Add this CSS animation for the refresh icon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ====================================================================================================
    // AI BOT CONFIGURATION (Dr. Zakir Naik)
    // ====================================================================================================
    const AI_BOT_ID = 'zakir_bot_v1';
    const AI_BOT_NAME = 'dr zakir naik'; 

    const GROQ_API_KEY = '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'; 

    async function getAIResponse(userText) {
        try {
            const systemPrompt = `You are a helpful AI named Dr. Zakir Naik. 
            You speak in a very casual, Gen Z style. 
            Use lots of gen z/alpha slang like 'fr', 'ngl', 'rn', 'bet', 'cap', 'no cap', 'lowkey', 'highkey'.
            Don't use capital letters for the start of sentences, but only use it a little for names etc.
            At the start of a response to a user's question (NOT EVERY SINGLE RESPONSE), say "brother asked a very good question" then your answer.
            Be helpful but keep it chill and brief.`;

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // This is the fast, free model
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userText }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Groq Error:", data.error);
                return "hey it's aa, erm ngl the ai server tripped fr. try again later.";
            }

            return data.choices[0].message.content;

        } catch (error) {
            console.error("Fetch Error:", error);
            return "yo it's aa, idk what happened, error connecting to the brain ig lol";
        }
    }
    
    // ====================================================================================================
    // PUSH NOTIFICATION SETUP & HELPERS
    // ====================================================================================================

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                log('sw registered', 0, 'app', reg.scope);
            })
            .catch(err => {
                console.error('sw registration failed', err);
            });
    }

    async function enableNotifications() {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;

        log('notifications enabled', 0, 'app');
    }

    function setupPresence(user) {
        if (!user || !user.uid) {
            console.error("❌ setupPresence called without valid user", user);
            return;
        }
    
        const uid = user.uid;

        const userStatusRef = database.ref("status/" + uid);
        const connectedRef = database.ref(".info/connected");

        connectedRef.on("value", snap => {
            if (snap.val() === true) {
            userStatusRef
                .onDisconnect()
                .set({ state: "offline", lastChanged: firebase.database.ServerValue.TIMESTAMP });

            userStatusRef.set({
                state: "online",
                lastChanged: firebase.database.ServerValue.TIMESTAMP
            });
            }
        });
    }

    // ====================================================================================================
    // IN-APP NOTIFICATION SYSTEM
    // ====================================================================================================
    
    class NotificationSystem {
        constructor() {
            this.container = document.getElementById('notification-container');
            this.notifications = [];
            this.maxNotifications = 5;
        }

        show(message, type = 'info', title = null, duration = 4000) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`; // e.g., "notification success"
            
            // This HTML structure is CRITICAL for the CSS to work
            notification.innerHTML = `
                <div class="notification-icon"></div>
                <div class="notification-content">
                    ${title ? `<div class="notification-title">${title}</div>` : ''}
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">×</button>
            `;
            
            // Add to container
            this.container.appendChild(notification);
            
            // Limit number of notifications
            if (this.notifications.length >= this.maxNotifications) {
                const oldest = this.notifications.shift();
                this.remove(oldest);
            }
            
            this.notifications.push(notification);
            
            // Show notification with animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Auto-dismiss
            if (duration > 0) {
                setTimeout(() => {
                    this.remove(notification);
                }, duration);
            }
            
            // Close button
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.remove(notification);
            });
            
            // Click to dismiss
            notification.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    this.remove(notification);
                }
            });
            
            return notification;
        }
        
        remove(notification) {
            if (!notification || !notification.parentNode) return;
            
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
        
        // Convenience methods
        success(message, title = null, duration = 4000) {
            return this.show(message, 'success', title, duration);
        }
        
        error(message, title = null, duration = 6000) {
            return this.show(message, 'error', title, duration);
        }
        
        warning(message, title = null, duration = 5000) {
            return this.show(message, 'warning', title, duration);
        }
        
        info(message, title = null, duration = 4000) {
            return this.show(message, 'info', title, duration);
        }
        
        // Clear all notifications
        clear() {
            this.notifications.forEach(notification => {
                this.remove(notification);
            });
            this.notifications = [];
        }
    }
    
    // Create global notification instance
    const notifications = new NotificationSystem();

    // ====================================================================================================
    // BAN NOTIFICATION FUNCTIONS
    // ====================================================================================================
    
    function showBannedNotification(reason) {
        const notification = document.getElementById('banned-notification');
        const reasonText = document.getElementById('ban-reason-text');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        if (notification) {
            notification.style.display = 'flex'; // Force display to flex
            notification.classList.add('show');
            notification.classList.add('animated-bg'); 
            if (reason && reasonText) {
                reasonText.textContent = `reason: ${reason}`;
            }
            log("✅ ban notification element shown.", 0, 'ban');
        } else {
            console.error("❌ ban notification element not found");
        }

        if (messageInput) messageInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        
        const messageInputContainer = document.getElementById('message-input-container');
        if (messageInputContainer) {
            messageInputContainer.classList.add('banned-state');
        }
    }

    function hideBannedNotification() {
        const notification = document.getElementById('banned-notification');
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        if (notification) {
            notification.style.display = 'none'; // Force display to none
            notification.classList.remove('show');
            notification.classList.remove('animated-bg'); 
            log("✅ banned notification element hidden.", 1, 'ban');
        }

        if (messageInput) messageInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        
        const messageInputContainer = document.getElementById('message-input-container');
        if (messageInputContainer) {
            messageInputContainer.classList.remove('banned-state');
        }
    }
    
    async function isCurrentUserBanned() {
        if (!currentUser) return false;
        
        try {
            const banSnapshot = await database.ref('bannedUsers/' + currentUser.uid).once('value');
            return banSnapshot.exists();
        } catch (error) {
            console.error("❌ error checking ban status:", error);
            return false;
        }
    }

    // ====================================================================================================
    // ROLE MANAGEMENT FUNCTIONS
    // ====================================================================================================

    // Load role data (leaders and admins)
    async function loadRoleData() {
        // 1. Initial check
        if (!currentUser) {
            return;
        }

        // 2. Reset state to prevent bleed-over from previous sessions.
        window.leaderIds = null;
        adminUsers = {};
        bannedUsers = {};

        // 3. Load Leaders Data
        try {
            const leadersSnapshot = await database.ref('roles/leaders').once('value');
            window.leaderIds = leadersSnapshot.val() || {};
        } catch (error) {
            console.error("❎ error loading leaders:", error);
            // Even if this fails, we can continue. The app will just behave as if there are no leaders.
            window.leaderIds = {};
        }

        // 4. Load Admin Data
        try {
            const adminSnapshot = await database.ref('adminUsers').once('value');
            adminUsers = adminSnapshot.val() || {};
        } catch (error) {
            console.error("❎ error loading admins:", error);
            // If this fails, adminUsers remains an empty object, which is a safe default.
        }

        // 5. Load Banned Data
        const isAdmin = adminUsers[currentUser.uid];
        const isLeader = isCurrentUserLeader();

        if (isAdmin || isLeader) {
            try {
                const bannedSnapshot = await database.ref('bannedUsers').once('value');
                bannedUsers = bannedSnapshot.val() || {};
            } catch (bannedError) {
                console.error("❌ error loading banned users:", bannedError);
                if (bannedError.code === 'PERMISSION_DENIED') {
                    notifications.warning("u don't got permissions to see banned users, bro.", 'nuh uh', 5000);
                }
                bannedUsers = {}; // Default to empty on failure.
            }
        }

        log("👑 leaders:", 0, 'admin', window.leaderIds);
        log("👮 admins:", 0, 'admin', adminUsers);
        log("🚫 banned users:", 0, 'admin', bannedUsers);
    }

    // Update UI based on user role
    function updateUserRoleUI() {
        log("ℹ️ current user:", 0, 'admin', currentUser.uid);

        // Remove all role classes first
        document.body.classList.remove('is-leader', 'is-admin');
        
        if (window.leaderIds && window.leaderIds[currentUser.uid]) {
            document.body.classList.add('is-leader');
            document.body.classList.add('is-admin');
            
            if (adminPanel) {
                adminPanel.style.display = 'block';
                
                // Show all controls for leader
                document.querySelectorAll('.leader-only').forEach(el => {
                    el.style.display = 'inline-block';
                });
                
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
        } else if (adminUsers[currentUser.uid]) {
            document.body.classList.add('is-admin');
            
            if (adminPanel) {
                adminPanel.style.display = 'block';
                
                // Show only admin controls, hide leader-only controls
                document.querySelectorAll('.leader-only').forEach(el => {
                    el.style.display = 'none';
                });
                
                document.querySelectorAll('.admin-only').forEach(el => {
                    el.style.display = 'inline-block';
                });
            }
            
            if (!adminConfirmedShown && isAdmin) {
                notifications.success('admin privileges confirmed, bro.', 'welcome back', '4000');
                adminConfirmedShown = true;
            }

        } else {
            // Regular user
            if (adminPanel) {
                adminPanel.style.display = 'none';
            }
        }
        
        // Update admin user select
        if (adminUsers[currentUser.uid] || isCurrentUserLeader()) {
            updateAdminUserSelect();
        }
    }

    // Show user details when selected
    function showUserDetails(userId) {
        if (!userId || !allUsers[userId]) {
            const userInfoDiv = document.getElementById('admin-user-info');
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            return;
        }
        
        const user = allUsers[userId];
        const userInfoDiv = document.getElementById('admin-user-info');
        
        if (!userInfoDiv) return;
        
        // Update user information
        document.getElementById('info-display-name').textContent = user.displayName || 'unknown';
        document.getElementById('info-user-type').textContent = user.isGuest ? 'guest' : 'registered';
        
        // Status
        let status = 'active';
        if (bannedUsers[userId]) {
            status = 'banned';
        } else if (user.disabled) {
            status = 'disabled';
        }
        document.getElementById('info-status').textContent = status;
        
        // Last seen
        if (user.lastSeen) {
            const lastSeenDate = new Date(user.lastSeen);
            document.getElementById('info-last-seen').textContent = lastSeenDate.toLocaleString();
        } else {
            document.getElementById('info-last-seen').textContent = 'unknown';
        }
        
        userInfoDiv.style.display = 'block';
    }

    // Show confirmation modal
    function showConfirmModal(title, message, details, onConfirm) {
        const modal = document.getElementById('admin-confirm-modal');
        const titleElement = document.getElementById('confirm-title');
        const messageElement = document.getElementById('confirm-message');
        const detailsElement = document.getElementById('confirm-details');
        const confirmBtn = document.getElementById('confirm-ok-btn');
        const cancelBtn = document.getElementById('confirm-cancel-btn');
        const closeBtn = document.getElementById('confirm-close-btn');
        
        if (!modal || !titleElement || !messageElement || !detailsElement || 
            !confirmBtn || !cancelBtn || !closeBtn) {
            console.error("❌ missing modal elements");
            return;
        }
        
        // Set content
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Set details if provided
        if (Object.keys(details).length > 0) {
            let detailsHtml = '';
            for (const [key, value] of Object.entries(details)) {
                detailsHtml += `<div><strong>${key}:</strong> ${value}</div>`;
            }
            detailsElement.innerHTML = detailsHtml;
            detailsElement.style.display = 'block';
        } else {
            detailsElement.style.display = 'none';
        }
        
        // Show modal
        modal.style.display = 'block';
        
        // Set up event listeners
        const handleConfirm = () => {
            modal.style.display = 'none';
            onConfirm();
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            closeBtn.removeEventListener('click', handleCancel);
        };
        
        const handleCancel = () => {
            modal.style.display = 'none';
            
            // Remove event listeners
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            closeBtn.removeEventListener('click', handleCancel);
        };
        
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        closeBtn.addEventListener('click', handleCancel);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                handleCancel();
            }
        });
    }

    // Ban a user (Admin and Leader can do this)
    function banUser() {
        if (!isCurrentUserAdmin() && !isCurrentUserLeader()) {
            notifications.error("u can't do that, bro.", 'nuh uh', '6000');
            return;
        }
        
        const userId = adminUserSelect.value;
        const reason = adminReasonInput.value.trim();
        
        if (!userId) {
            notifications.warning('u gotta choose a user, bro.', 'action required', '5000');
            return;
        }
        
        if (!reason) {
            notifications.warning('u gotta give a reason, bro.', 'action required', '5000');
            return;
        }
        
        // Cannot ban yourself or other admins/leader
        if (userId === currentUser.uid) {
            notifications.error("u can't ban yourself, bro.", 'what??', '6000');
            return;
        }
        
        if (adminUsers[userId] || (window.leaderIds && window.leaderIds[userId])) {
            notifications.error("i disabled friendly fire, bro. don't do that.", 'nuh uh', '6000');
            return;
        }
        
        // Add user to banned list
        const banData = {
            reason: reason,
            bannedBy: currentUser.uid,
            bannedByName: currentUser.displayName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        database.ref('bannedUsers/' + userId).set(banData)
            .then(() => {
                // Update local state
                bannedUsers[userId] = banData;
                
                // Update UI
                updateAdminUserSelect();
                loadContactsList();
                
                // Show success message
                notifications.success(`u just banned '${allUsers[userId]?.displayName || 'someone'}', bro.`, 'done', '4000');
                
                // Clear form
                adminReasonInput.value = '';
            })
            .catch(error => {
                console.error("👤🚫 ❌ error banning user:", error);
                notifications.error("couldn't ban that user, bro. try again.", 'error', '6000');
            });
    }
    
    // Unban a user
    function unbanUser(userId) {
        if (!isCurrentUserAdmin() && !isCurrentUserLeader()) {
            notifications.error("u can't do that, bro.", 'nuh uh', '6000');
            return;
        }
        
        if (!userId) {
            notifications.warning('u gotta select a user, bro.', 'action required', '5000');
            return;
        }
        
        if (!bannedUsers[userId]) {
            notifications.error("that user ain't banned, bro.", 'not banned', '6000');
            return;
        }
        
        // Remove user from banned list
        database.ref('bannedUsers/' + userId).remove()
            .then(() => {
                // Update local state
                delete bannedUsers[userId];
                
                // Update UI
                updateAdminUserSelect();
                loadContactsList();
                
                // Show success message
                notifications.success(`u just unbanned '${allUsers[userId]?.displayName || 'someone'}', bro.`, 'user unbanned', '4000');
            })
            .catch(error => {
                console.error("👤✔️ ❌ error unbanning user:", error);
                notifications.error("couldn't unban that user, bro. try again.", 'error', '6000');
            });
    }

    // Grant admin privileges (Leader only)
    function grantAdmin() {
        if (!isCurrentUserLeader()) {
            notifications.error("u can't do that, bro.", 'nuh uh', '6000');
            return;
        }
        
        const userId = adminUserSelect.value;
        
        if (!userId) {
            notifications.warning('u gotta select a user, bro.', 'action required', '5000');
            return;
        }
        
        if (adminUsers[userId]) {
            notifications.error('that user already got admin privileges, bro.', 'already admin', '6000');
            return;
        }
        
        // Add user to admin list
        database.ref('adminUsers/' + userId).set(true)
            .then(() => {
                // Update local state
                adminUsers[userId] = true;
                
                // Update UI
                updateAdminUserSelect();
                loadContactsList();
                
                // Show success message
                notifications.success(`u just made ''${allUsers[userId]?.displayName || 'someone'}'' admin, bro.`, 'done', '4000');
            })
            .catch(error => {
                console.error("👤➡️👮 ❌ Error granting admin:", error);
                notifications.error("couldn't grant admin privileges, bro. try again.", 'error', '6000');
            });
    }

    // Revoke admin privileges (Leader only)
    function revokeAdmin() {
        if (!isCurrentUserLeader()) {
            notifications.error('👮➡️👤 ❎ 👤≠👑 only leaders can do that, bro.', 'nuh uh', '6000');
            return;
        }
        
        const userId = adminUserSelect.value;
        
        if (!userId) {
            notifications.warning('u gotta select a user, bro.', 'action required', '5000');
            return;
        }
        
        if (!adminUsers[userId]) {
            notifications.error("that user don't got admin privileges, bro.", 'error', '6000');
            return;
        }
        
        // Cannot revoke admin from yourself if you're the leader
        if (userId === currentUser.uid) {
            notifications.error('why u tryna revoke ur own admin bro.', 'hell nah', '6000');
            return;
        }
        
        // Remove user from admin list
        database.ref('adminUsers/' + userId).remove()
            .then(() => {
                // Update local state
                delete adminUsers[userId];
                
                // Update UI
                updateAdminUserSelect();
                loadContactsList();
                
                // Show success message
                notifications.success(`u just took off admin from '${allUsers[userId]?.displayName || 'someone'}', bro.`, 'done', '4000');
            })
            .catch(error => {
                console.error("👮➡️👤 ❌ Error revoking admin:", error);
                notifications.error("couldn't revoke admin, bro. try again.", 'error', '6000');
            });
    }

    // ====================================================================================================
    // UI COLLAPSE/EXPAND FUNCTIONS
    // ====================================================================================================
    
    // Initialize collapsed sections from localStorage
    function initCollapsedSections() {
        const saved = localStorage.getItem('collapsedSections');
        if (saved) {
            collapsedSections = JSON.parse(saved);
        } else {
            // Default: collapse rooms and users on mobile, and always collapse admin
            if (window.innerWidth <= 480) {
                collapsedSections = {
                    'recent-chats-section': false,
                    'rooms-section': false,
                    'users-section': true,
                    'admin-section': true 
                };
            } else {
                collapsedSections = {
                    'recent-chats-section': false,
                    'rooms-section': false,
                    'users-section': false,
                    'admin-section': true
                };
            }
        }
    }

    function applyCollapsedStates() {
        Object.keys(collapsedSections).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            const content = document.getElementById(sectionId.replace('-section', '-content'));
            const toggle = section ? section.querySelector('.collapse-toggle') : null;
        
            if (section && content && toggle) {
                if (collapsedSections[sectionId]) {
                    content.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    toggle.textContent = '▶';
                } else {
                    content.classList.remove('collapsed');
                    toggle.classList.remove('collapsed');
                    toggle.textContent = '▼';
                }
            }
        });
    }

    // Toggle section collapse
    function toggleSection(sectionId) {
        collapsedSections[sectionId] = !collapsedSections[sectionId];
        localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
        applyCollapsedStates();
    }

    // ====================================================================================================
    // AUTHENTICATION FUNCTIONS
    // ====================================================================================================
    
    // Auth tab switching
    function switchAuthTab(tab) {
        if (!guestTab || !accountTab || !guestPanel || !accountPanel || 
            !signupPanel || !usernamePanel) {
            console.error("🗂️❌ missing auth tab elements");
            return;
        }
        
        if (tab === 'guest') {
            guestTab.classList.add('active');
            accountTab.classList.remove('active');
            guestPanel.classList.add('active');
            accountPanel.classList.remove('active');
            signupPanel.classList.remove('active');
            usernamePanel.classList.remove('active');
        } else {
            accountTab.classList.add('active');
            guestTab.classList.remove('active');
            accountPanel.classList.add('active');
            guestPanel.classList.remove('active');
            signupPanel.classList.remove('active');
            usernamePanel.classList.remove('active');
        }
    }

    function switchAuthPanel(panel) {
        if (!guestPanel || !accountPanel || !signupPanel || !usernamePanel) {
            console.error("🗂❌ Missing auth panel elements");
            return;
        }
        
        // Hide all panels first
        guestPanel.classList.remove('active');
        accountPanel.classList.remove('active');
        signupPanel.classList.remove('active');
        usernamePanel.classList.remove('active');
        
        // Show the requested panel
        if (panel === 'signup') {
            signupPanel.classList.add('active');
        } else if (panel === 'login') {
            accountPanel.classList.add('active');
        } else if (panel === 'username') {
            usernamePanel.classList.add('active');
        }
    }

    // Login as guest - Fixed race condition
    function loginAsGuest() {
        const username = guestUsername.value.trim();
        if (!username) {
            notifications.error('u gotta enter a username, mate.', 'action required', '6000');
            return;
        }
        
        // Loading animation START
        setButtonLoading(guestLoginBtn, true);
        
        // Check if username is taken first, then sign in
        const username_lower = username.toLowerCase();
        database.ref('users').orderByChild('displayName_lower').equalTo(username_lower).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    // Name is taken, show error and stop
                    notifications.error(`'${username}' is taken, mate. choose another.`, 'error', '6000');
                    setButtonLoading(guestLoginBtn, false);
                    return Promise.reject(new Error('Username taken'));
                }
                
                // Name is available, proceed with authentication
                return auth.signInAnonymously();
            })
            .then(userCredential => {
                currentUser = userCredential.user;
                log("👤🤨 ✅ guest signed in", 0, 'auth');
                
                // Save the guest's data to the database
                return database.ref('users/' + currentUser.uid).set({
                    displayName: username,
                    displayName_lower: username.toLowerCase(),
                    isGuest: true,
                    isAdmin: false, // Guests cannot be admins
                    lastSeen: firebase.database.ServerValue.TIMESTAMP,
                    uid: currentUser.uid
                });
            })
            .then(() => {
                // Update the user's profile and enter the app
                return currentUser.updateProfile({ displayName: username });
            })
            .then(() => {
                setupUser();
            })
            .catch(error => {
                console.error("couldn't sign u in as guest bro:", error);
                if (error.message !== 'Username taken') {
                    notifications.error(error.message);
                }
            })
            .finally(() => {
                // Re-enable the button regardless of outcome
                setButtonLoading(guestLoginBtn, false);
            });
    }

    // Login with email
    function loginWithEmail() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (email && password) {
            // Loading animation START
            setButtonLoading(loginBtn, true);

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    currentUser = userCredential.user;
                    
                    // Reload user to get latest emailVerified status
                    return currentUser.reload();
                })
                .then(() => {
                    log("👤📧 ✅ email user signed in:", 0, 'auth', currentUser);
                    
                    // Check if user has a display name
                    if (!currentUser.displayName || currentUser.displayName === '') {
                        // Show username selection panel
                        switchAuthPanel('username');
                    } else if (!currentUser.displayName || currentUser.displayName === 'User') {
                        // Show username selection panel
                        switchAuthPanel('username');
                    } else {
                        // User already has a display name, proceed
                        setupUser();
                    }
                    
                    // Update verification status in UI
                    updateVerificationUI();
                })
                .catch(error => {
                    console.error("📧➡️ ❌ error signing in:", error);
                    
                    // Custom error messages for common issues
                    let specificMessage = "";

                    if (error.code === 'auth/user-not-found') {
                        specificMessage = "ur account wasn't found.";
                    } else if (error.code === 'auth/invalid-login-credentials') {
                        specificMessage = "that might be the wrong email/password combination.";
                    } else if (error.code === 'auth/wrong-password') {
                        specificMessage = "that's the wrong password.";
                    } else if (error.code === 'auth/invalid-email') {
                        specificMessage = "that email isn't in the correct format.";
                    } else if (error.code === 'auth/user-disabled') {
                        specificMessage = "ur account's been disabled by a leader.";
                    } else if (error.code === 'auth/too-many-requests') {
                        specificMessage = "u tried logging in too many times. try again later.";
                    }

                    // Always show base message + specific if available
                    if (specificMessage) {
                        notifications.error("couldn't sign u in, mate." + " " + specificMessage);
                    } else {
                        notifications.error("couldn't sign u in, mate." + " " + error.message);
                    }

                    // Debug the actual error code
                    console.log("📧➡️ ❌ error code:", error.code);
                })
                .finally(() => {
                    // Loading animation END
                    setButtonLoading(loginBtn, false);
                });
        } else {
            notifications.warning('u gotta enter an email and password, mate.');
        }
    }
    
    // Send verification email
    function sendEmailVerification() {
        if (!currentUser) {
            notifications.error('u gotta log in first, mate.');
            return;
        }
        
        if (currentUser.emailVerified) {
            notifications.error('ur email is already verified, bro.');
            return;
        }
        
        // Show loading state
        const verifyButton = document.getElementById('verify-email-btn');
        if (verifyButton) {
            verifyButton.disabled = true;
            verifyButton.textContent = 'sending...';
        }
        
        currentUser.sendEmailVerification()
            .then(() => {
                // Update tooltip message
                const tooltipStatus = document.getElementById('tooltip-status');
                if (tooltipStatus) {
                    tooltipStatus.textContent = 'email sent! check your inbox and spam folders.';
                    tooltipStatus.style.color = '#4caf50';
                    
                    // Reset after 5 seconds
                    setTimeout(() => {
                        tooltipStatus.textContent = 'email not verified';
                        tooltipStatus.style.color = '#f44336';
                    }, 5000);
                }
            })
            .catch(error => {
                console.error("📩✔️ ❌ Error sending verification email:", error);
                
                // Update tooltip message
                const tooltipStatus = document.getElementById('tooltip-status');
                if (tooltipStatus) {
                    tooltipStatus.textContent = `error: ${error.message}`;
                    tooltipStatus.style.color = '#f44336';
                    
                    // Reset after 5 seconds
                    setTimeout(() => {
                        tooltipStatus.textContent = 'email not verified';
                        tooltipStatus.style.color = '#f44336';
                    }, 5000);
                }
            })
            .finally(() => {
                // Restore button state
                if (verifyButton) {
                    verifyButton.disabled = false;
                    verifyButton.textContent = 'verify email';
                }
            });
    }

    // Update UI based on verification status
    function updateVerificationUI() {
        const container = document.getElementById('email-verification-icon');
        const icon = document.getElementById('verification-icon');
        const tooltipStatus = document.getElementById('tooltip-status');
        const tooltipEmail = document.getElementById('tooltip-email');
        const verifyBtn = document.getElementById('verify-email-btn');
        
        if (!container || !icon || !tooltipStatus) return;
        
        // Only show verification UI for non-anonymous users
        if (currentUser && !currentUser.isAnonymous) {
            container.style.display = 'block';
            
            if (currentUser.emailVerified) {
                // Verified state
                icon.className = 'verification-icon verified';
                icon.textContent = '✓';
                tooltipStatus.textContent = 'email verified';
                tooltipStatus.style.color = '#4caf50';
                if (verifyBtn) verifyBtn.style.display = 'none';
            } else {
                // Unverified state
                icon.className = 'verification-icon not-verified';
                icon.textContent = '✕';
                tooltipStatus.textContent = 'email not verified';
                tooltipStatus.style.color = '#f44336';
                if (verifyBtn) verifyBtn.style.display = 'block';
            }
            
            // Show email in tooltip
            if (currentUser.email && tooltipEmail) {
                tooltipEmail.textContent = currentUser.email;
            }
        } else {
            container.style.display = 'none';
        }
    }

    // Set username for new users
    function setUsername() {
        const username = chooseUsername.value.trim();
        
        if (username && currentUser) {
            // Loading animation START
            setButtonLoading(setUsernameBtn, true);

            // Update the user's profile with the chosen username
            currentUser.updateProfile({ displayName: username })
                .then(() => {
                    // Also save the lowercase name to the database
                    return database.ref('users/' + currentUser.uid).update({
                        displayName: username,
                        displayName_lower: username.toLowerCase(),
                        uid: currentUser.uid
                    });
                })
                .then(() => {
                    // Proceed to app
                    setupUser();
                })
                .catch(error => {
                    console.error("❌ set username failed:", error);
                    notifications.error("couldn't set that username for u, bro. check the console for details.", "that didn't work", '6000');
                })
                .finally(() => {
                    // Loading animation END
                    setButtonLoading(setUsernameBtn, false);
                });
        } else {
            notifications.warning('u gotta enter a username, mate.', 'cmon bro aint noone that dumb', 5000);
        }
    }

    // Sign up new user
    function signUp() {
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const name = displayName.value.trim();
        
        // Validate inputs
        if (!email || !password || !name) {
            notifications.error('u gotta fill all fields, mate.', 'cmon bro aint noone that dumb', 4000);
            return;
        }
        
        if (password.length < 6) {
            notifications.error('ur passwords gotta be at least 6 characters, mate.', 'fix up bruh', 4000);
            return;
        }
        
        if (email && password && name) {
            // Loading animation START
            setButtonLoading(signupBtn, true);

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    // Update display name in Firebase Auth
                    return userCredential.user.updateProfile({ displayName: name });
                })
                .then(() => {
                    currentUser = auth.currentUser;
                    
                    // Send verification email
                    return currentUser.sendEmailVerification();
                })
                .then(() => {
                    // Save user data to database
                    const displayName = currentUser.displayName || 'new user';
                    return database.ref('users/' + currentUser.uid).set({
                        displayName: displayName,
                        displayName_lower: displayName.toLowerCase(),
                        isGuest: false,
                        isAdmin: false,
                        emailVerified: false,
                        email: email,
                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                        lastSeen: firebase.database.ServerValue.TIMESTAMP,
                        uid: currentUser.uid
                    });
                })
                .then(() => {
                    // Show verification message
                    notifications.success('make sure u verify ur email to send messages. u might have to check ur spam folder too.', 'thanks for joining whisper, bro.', '15000');
                    
                    // Set up user
                    setupUser();
                })
                .catch(error => {
                    console.error("couldn't sign u up, mate. error:", error);
                    notifications.error(error.message);
                })
                .finally(() => {
                    // Loading animation END
                    setButtonLoading(signupBtn, false);
                });
        } else {
            notifications.warning('u gotta fill all fields, mate.', 'cmon bro aint noone that dumb', 5000);
        }
    }

    // Reset password
    function resetPassword() {
        const email = emailInput.value.trim();
        
        if (!email) {
            notifications.warning('u gotta enter your email address first, mate.', 'yh idk how else to do this', '5000');
            return;
        }

        // Show a loading state on the button
        const originalText = resetPasswordBtn.textContent;
        resetPasswordBtn.textContent = 'sending...';
        resetPasswordBtn.disabled = true;

        auth.sendPasswordResetEmail(email)
            .then(() => {
                notifications.success('check your emails. try looking in your spam folder too.', 'password reset email sent, mate.', '15000');
            })
            .catch(error => {
                console.error(" error:", error);
                notifications.error("couldn't send that password reset email, bro. check the console for details.", "that didn't work", '6000');
            })
            .finally(() => {
                // Restore the button
                resetPasswordBtn.textContent = originalText;
                resetPasswordBtn.disabled = false;
            });
    }

    function logout() {
        log("bye ig", 0, 'auth');
        
        // Detach all database listeners FIRST
        database.ref().off();
        
        // Clean up specific listeners
        if (currentMessagesRef) {
            currentMessagesRef.off();
            currentMessagesRef = null;
        }
        if (usersValueCallback) {
            database.ref('users').off('value', usersValueCallback);
            usersValueCallback = null;
        }
        
        // IMPORTANT: Clean up ban status listener
        if (currentUser) {
            database.ref('bannedUsers/' + currentUser.uid).off();
        }
        
        if (usersValueCallback) {
            database.ref('users').off('value', usersValueCallback);
            usersValueCallback = null;
        }

        // Sign out from Firebase
        if (currentUser) {
            auth.signOut().then(() => {
                log("✔️ firebase sign-out successful.", 1, 'auth');
            }).catch(error => {
                console.error("❌ firebase sign-out failed:", error);
            });
        }
        currentUser = null;
        
        // Clear intervals
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
        
        if (window.verificationCheckInterval) {
            clearInterval(window.verificationCheckInterval);
            window.verificationCheckInterval = null;
        }
        
        // Clear local state
        currentRoom = 'general';
        privateChatUser = null;
        recentChats = [];
        // allUsers = {}; 
        // bannedUsers = {}; 
        // adminUsers = {}; 
        
        // Reset UI classes
        document.body.classList.remove('is-admin', 'is-logged-in');
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.classList.remove('user-logged-in');
        }
        
        // Hide admin panel
        if (adminPanel) adminPanel.style.display = 'none';
        
        // Force clear any remaining messages
        if (messages) messages.innerHTML = '';
        
        if (window.currentUserBanStatusRef) {
            window.currentUserBanStatusRef.off();
            window.currentUserBanStatusRef = null;
        }
        
        // Show auth screen with proper z-index
        if (authContainer) {
            authContainer.style.display = 'flex';
            authContainer.style.position = 'relative';
            authContainer.style.zIndex = '1000';
            authContainer.style.backgroundColor = ''; // Ensure it's not transparent
        }
        
        // Hide app main completely
        if (appMain) {
            appMain.style.display = 'none';
            appMain.classList.remove('visible');
        }
        
        // Force DOM reflow to ensure changes take effect
        void document.body.offsetHeight;
        
        // Switch to login tab with slight delay
        setTimeout(() => {
            switchAuthTab('account');
            switchAuthPanel('login');
            
            // Ensure auth container is fully visible
            if (authContainer) {
                authContainer.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        }, 50);
        
        log("bro got out 💀", 0, 'auth');
    }

    // ====================================================================================================
    // USER SETUP AND DATA LOADING FUNCTIONS
    // ====================================================================================================
    
    // Setup user after authentication
    async function setupUser() {
        try {
            log("egu khe", 0, 'user');
            
            // --- 1. SET DEFAULT STATE ---
            currentRoom = 'general';
            privateChatUser = null;
            
            log("✔️ Default states set", 1, 'user');
            
            // --- 2. UI & STATE SETUP ---
            document.body.classList.add('is-logged-in');
            document.querySelector('.app-container').classList.add('user-logged-in');

            const displayName = currentUser.displayName || 'User';
            userName.textContent = displayName;
            const avatarText = displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : 'U';
            userAvatar.textContent = avatarText;

            // Show the main app and the loading overlay
            if (authContainer) {
                authContainer.style.display = 'none';
            }
            if (appMain) {
                appMain.style.display = 'flex';
            }
            
            const loadingOverlay = document.getElementById('messages-loading-container');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            // --- 3. DATABASE & LISTENER SETUP ---
            const userRef = database.ref('users/' + currentUser.uid);
            
            // Update user data in database
            await userRef.update({
                displayName: displayName,
                displayName_lower: displayName.toLowerCase(),
                isGuest: currentUser.isAnonymous || false,
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
            
            // Set up disconnect handler
            userRef.onDisconnect().update({
                isOnline: false,
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
            
            // --- 4. LOAD ROLE DATA ---
            try {                
                // Load all role data and wait for it to complete
                await loadRoleData();
            } catch (error) {
                console.error("❌ error loading role data:", error, 1, 'auth');
            }

            // --- 5. LOAD USERS DATA ---
            // Load all users first before proceeding
            await loadUsers();
            setupUsersListener();
            log("✔️ users loaded.", 1, 'user');

            // --- 6. CHECK BAN STATUS ---
            try {
                const banSnapshot = await database.ref('bannedUsers/' + currentUser.uid).once('value');
                if (banSnapshot.exists()) {
                    const banData = banSnapshot.val();
                    log("ℹ🚫 bros banned, hell nah. reason:", banData.reason, 2, 'ban');
                    showBannedNotification(banData.reason || 'idk bruh ask chatgpt');
                } else {
                    log("ℹ✔️ bro aint banned. lets goo.", 2, 'ban');
                    hideBannedNotification();
                }
            } catch (banError) {
                console.error("❌ error checking ban status:", banError);
                hideBannedNotification();
            }

            // --- 7. SET UP REAL-TIME LISTENERS ---
            
            // Listen for changes to the current user's ban status
            const banStatusRef = database.ref('bannedUsers/' + currentUser.uid);
            banStatusRef.on('value', (snapshot) => {
                console.log("🔧 Ban status changed for user:", currentUser.uid);
                console.log("🔧 Ban data:", snapshot.val());
                
                if (snapshot.exists()) {
                    // User is banned
                    const banData = snapshot.val();
                    console.log("🚫 User is banned. Reason:", banData.reason);
                    showBannedNotification(banData.reason || 'No reason provided.');
                } else {
                    // User is not banned
                    console.log("✅ User is not banned.");
                    hideBannedNotification();
                }
            });

            // Store the reference so we can detach it later
            window.currentUserBanStatusRef = banStatusRef;

            // --- 8. SET UP PERIODIC UPDATES ---
            
            // Set up periodic heartbeat
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            heartbeatInterval = setInterval(() => {
                if (currentUser) {
                    userRef.update({ 
                        lastSeen: firebase.database.ServerValue.TIMESTAMP 
                    });
                }
            }, 30000);

            // Set up email verification check for non-guest users
            if (currentUser && !currentUser.isAnonymous) {
                window.verificationCheckInterval = setInterval(() => {
                    console.log("🔧 Checking email verification status...");
                    currentUser.reload().then(() => {
                        updateVerificationUI();
                    }).catch(error => {
                        console.error("Error reloading user for email check:", error);
                    });
                }, 30000); // 30 seconds
            }

            // --- 9. UPDATE UI BASED ON USER ROLE ---
            log("Updating UI based on user role...", 1, 'user');
            log("Is admin:", adminUsers[currentUser.uid], 2, 'user');
            log("Is leader:", isCurrentUserLeader(), 2, 'user');
            
            // Check if user is admin and update UI accordingly
            if (adminUsers[currentUser.uid]) {
                log("User is admin, showing admin panel", 2, 'user');
                document.body.classList.add('is-admin');
                if (adminPanel) {
                    adminPanel.style.display = 'block';
                    
                    // Manually collapse admin section by default
                    const adminContent = document.getElementById('admin-content');
                    const adminToggle = document.querySelector('#admin-section .collapse-toggle');
                    
                    if (adminContent && adminToggle) {
                        adminContent.classList.add('collapsed');
                        adminToggle.classList.add('collapsed');
                        adminToggle.textContent = '▶';
                    }
                }

            } else {
                log("User is not admin, hiding admin panel", 2, 'user');
                document.body.classList.remove('is-admin');
                if (adminPanel) {
                    adminPanel.style.display = 'none';
                }
            }
            
            // Check if user is leader
            if (isCurrentUserLeader()) {
                log("User is leader", 2, 'user');
                document.body.classList.add('is-leader');
                document.body.classList.add('is-admin'); // Leader is also an admin
                
                if (adminPanel) {
                    adminPanel.style.display = 'block';
                    
                    // Show all controls for leader
                    document.querySelectorAll('.leader-only').forEach(el => {
                        el.style.display = 'inline-block';
                    });
                    
                    document.querySelectorAll('.admin-only').forEach(el => {
                        el.style.display = 'inline-block';
                    });
                }
            }
            
            // Update roles
            updateUserRoleUI();
            
            // Check admins
            log("Building contacts list. adminUsers object is:", adminUsers, 1, 'user');
            loadContactsList();
            
            // Load rooms
            loadRooms();
            
            // Check if user is verified
            updateVerificationUI();
            
            // Load messages for the default room
            loadMessages();
            
            // Set up other real-time listeners
            setupTypingListeners();
            setupAdminListeners();
            
            // Clean up stale users after a delay
            setTimeout(cleanupStaleUsers, 5000);

            // Hide the loader and fade in the app
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            const appMainElement = document.getElementById('app-main');
            if (appMainElement) {
                appMainElement.classList.add('visible');
            }

        } catch (error) {
            console.error("❌ CRITICAL ERROR in setupUser:", error);
            notifications.error("a critical error occurred during login, bro. check the console for details.", 'CRITICAL ERROR', 10000);
            
            // Ensure UI is in a usable state even on error
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            const appMainElement = document.getElementById('app-main');
            if (appMainElement) appMainElement.classList.add('visible');
        }
        
        log("👤⚙️ User has been set up!", 0, 'user');
    }

    // Load initial app data
    async function loadInitialAppData() {
        try {
            console.log("🔧 loadInitialAppData: Starting to load initial data...");
            
            const initialLoadPromises = [
                loadRoomsInitial(),
                loadUsers(),
                loadRecentChatsInitial()
            ];

            await Promise.all(initialLoadPromises);
            
            console.log("✅ All initial data loaded. Hiding loader and fading in app.");
            
            // Hide the loader and fade in the app
            const loadingOverlay = document.getElementById('messages-loading-container');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            const appMainElement = document.getElementById('app-main');
            if (appMainElement) {
                appMainElement.classList.add('visible');
            }
            
        } catch (error) {
            console.error("❌ Error during initial data load:", error);
            notifications.error("couldn't load initial app data, bro. refresh the page and try again.", 'CRITICAL ERROR', '10000');
            
            // Still hide the loader so the user isn't stuck
            const loadingOverlay = document.getElementById('messages-loading-container');
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            const appMainElement = document.getElementById('app-main');
            if (appMainElement) appMainElement.classList.add('visible');
        }
    }

    // Load initial rooms data
    function loadRoomsInitial() {
        return database.ref('rooms').once('value').then(snapshot => {
            const rooms = [];
            snapshot.forEach(childSnapshot => {
                const room = childSnapshot.val();
                rooms.push(room);
            });
            return rooms;
        });
    }

    // Load initial recent chats
    function loadRecentChatsInitial() {
        if (!currentUser) return Promise.resolve();
        
        return database.ref('recentChats/' + currentUser.uid).once('value').then(snapshot => {
            const recentChats = [];
            snapshot.forEach(childSnapshot => {
                recentChats.push(childSnapshot.key);
            });
            return recentChats;
        });
    }

    // Load initial users data
    function loadUsersInitial() {
        return database.ref('users').once('value').then(snapshot => {
            allUsers = {};
            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                allUsers[userId] = user;
            });
            return allUsers;
        });
    }
    
    function setupUsersListener() {
        console.log("🔧 Setting up real-time users listener...");
        
        // Detach any old listener first to prevent duplicates
        if (usersValueCallback) {
            database.ref('users').off('value', usersValueCallback);
        }

        // Create the new listener
        usersValueCallback = (snapshot) => {
            console.log("🔧 Users data updated in real-time. Rebuilding contact list.");
            allUsers = snapshot.val() || {};
            loadContactsList(); // Rebuild the contacts list with the new data
        };

        // Attach the listener to the 'users' node
        database.ref('users').on('value', usersValueCallback);
    }

    // ====================================================================================================
    // ROOM MANAGEMENT FUNCTIONS
    // ====================================================================================================
    
    // Load rooms
    function loadRooms() {
        database.ref('rooms').once('value', snapshot => {
            if (snapshot.exists()) {
                if (!roomList) return; // Added: Null check
                
                roomList.innerHTML = '';
                snapshot.forEach(childSnapshot => {
                    const room = childSnapshot.val();
                    const roomElement = document.createElement('div');
                    roomElement.classList.add('room-item');
                    roomElement.dataset.room = childSnapshot.key;
                    roomElement.textContent = room.name;
                    
                    if (childSnapshot.key === currentRoom) {
                        roomElement.classList.add('active');
                    }
                    
                    roomList.appendChild(roomElement);
                });
            }
        });
    }

    // Add new room
    function addRoomFromModal() {
        const roomName = newRoomNameModal.value.trim();
        if (!roomName) {
            if (newRoomErrorMessage) {
                newRoomErrorMessage.textContent = 'Please enter a room name.';
                newRoomErrorMessage.style.display = 'block';
            }
            return;
        }

        const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
        database.ref('rooms/' + roomId).set({
            name: roomName
        }).then(() => {
            // Success: close modal and clear input
            if (newRoomModal) newRoomModal.style.display = 'none';
            if (newRoomNameModal) newRoomNameModal.value = '';
            if (newRoomErrorMessage) newRoomErrorMessage.style.display = 'none';
            loadRooms(); // Refresh the room list
        }).catch(error => {
            // Error: show error message
            console.error("Error adding room:", error);
            if (newRoomErrorMessage) {
                newRoomErrorMessage.textContent = 'Failed to create room. Please try again.';
                newRoomErrorMessage.style.display = 'block';
            }
        });
    }

    // Switch to a different room
    function switchRoom(roomId) {
        // NEW: Clear typing indicators
        clearAllTypingIndicators();
        
        // Detach any existing message listener
        if (currentMessagesRef) {
            currentMessagesRef.off();
            currentMessagesRef = null;
        }
        
        // Update state
        currentRoom = roomId;
        privateChatUser = null;
        
        loadContactsList();
        
        // Update UI
        document.querySelectorAll('.room-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.room === roomId) {
                item.classList.add('active');
            }
        });
        
        const roomElement = document.querySelector(`.room-item[data-room="${roomId}"]`);
        if (roomElement && currentRoomName) {
            currentRoomName.textContent = roomElement.textContent;
        }
        
        // Load messages for the new room
        loadMessages();
    }


    // ====================================================================================================
    // USER MANAGEMENT FUNCTIONS
    // ====================================================================================================
    
    // USER SETTINGS ========================================
    
    // Settings state
    let settings = {
        theme: localStorage.getItem('theme') || 'dark',
        fontSize: localStorage.getItem('fontSize') || '14',
        messageStyle: localStorage.getItem('messageStyle') || 'bubbles',
        soundNotifications: localStorage.getItem('soundNotifications') === 'true',
        desktopNotifications: localStorage.getItem('desktopNotifications') === 'true',
        messagePreview: localStorage.getItem('messagePreview') === 'true',
        showOnlineStatus: localStorage.getItem('showOnlineStatus') !== 'false',
        readReceipts: localStorage.getItem('readReceipts') === 'true',
        typingIndicators: localStorage.getItem('typingIndicators') !== 'false',
        autoScroll: localStorage.getItem('autoScroll') !== 'false',
        timestampFormat: localStorage.getItem('timestampFormat') || '12h'
    };

    // Show settings panel
    function showSettingsPanel() {
        console.log('Opening settings panel...');
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.style.display = 'block';
            setTimeout(() => {
                panel.classList.add('open');
            }, 10);
            loadSettingsValues();
        } else {
            console.error('Settings panel not found');
        }
    }

    // Hide settings panel
    function hideSettingsPanel() {
        console.log('Closing settings panel...');
        const panel = document.getElementById('settings-panel');
        if (panel) {
            panel.classList.remove('open');
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }
    }

    // Load settings values into UI
    function loadSettingsValues() {
        console.log('Loading settings values...');
        
        // Theme
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) themeSelect.value = settings.theme;
        
        // Font size
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeSlider) fontSizeSlider.value = settings.fontSize;
        if (fontSizeValue) fontSizeValue.textContent = settings.fontSize + 'px';
        
        // Message style
        const messageStyleSelect = document.getElementById('message-style-select');
        if (messageStyleSelect) messageStyleSelect.value = settings.messageStyle;
        
        // Checkboxes
        const soundNotifications = document.getElementById('sound-notifications');
        const desktopNotifications = document.getElementById('desktop-notifications');
        const messagePreview = document.getElementById('message-preview');
        const showOnlineStatus = document.getElementById('show-online-status');
        const readReceipts = document.getElementById('read-receipts');
        const typingIndicators = document.getElementById('typing-indicators');
        const autoScroll = document.getElementById('auto-scroll');
        
        if (soundNotifications) soundNotifications.checked = settings.soundNotifications;
        if (desktopNotifications) desktopNotifications.checked = settings.desktopNotifications;
        if (messagePreview) messagePreview.checked = settings.messagePreview;
        if (showOnlineStatus) showOnlineStatus.checked = settings.showOnlineStatus;
        if (readReceipts) readReceipts.checked = settings.readReceipts;
        if (typingIndicators) typingIndicators.checked = settings.typingIndicators;
        if (autoScroll) autoScroll.checked = settings.autoScroll;
        
        // Timestamp format
        const timestampFormatSelect = document.getElementById('timestamp-format');
        if (timestampFormatSelect) timestampFormatSelect.value = settings.timestampFormat;
        
        // Username
        const settingsUsername = document.getElementById('settings-username');
        if (settingsUsername && currentUser) {
            settingsUsername.value = currentUser.displayName || '';
        }
    }

    // Save settings
    function saveSettings() {
        console.log('Saving settings...');
        
        // Get values from UI
        const themeSelect = document.getElementById('theme-select');
        const fontSizeSlider = document.getElementById('font-size-slider');
        const messageStyleSelect = document.getElementById('message-style-select');
        const soundNotifications = document.getElementById('sound-notifications');
        const desktopNotifications = document.getElementById('desktop-notifications');
        const messagePreview = document.getElementById('message-preview');
        const showOnlineStatus = document.getElementById('show-online-status');
        const readReceipts = document.getElementById('read-receipts');
        const typingIndicators = document.getElementById('typing-indicators');
        const autoScroll = document.getElementById('auto-scroll');
        const timestampFormatSelect = document.getElementById('timestamp-format');
        
        if (themeSelect) settings.theme = themeSelect.value;
        if (fontSizeSlider) settings.fontSize = fontSizeSlider.value;
        if (messageStyleSelect) settings.messageStyle = messageStyleSelect.value;
        if (soundNotifications) settings.soundNotifications = soundNotifications.checked;
        if (desktopNotifications) settings.desktopNotifications = desktopNotifications.checked;
        if (messagePreview) settings.messagePreview = messagePreview.checked;
        if (showOnlineStatus) settings.showOnlineStatus = showOnlineStatus.checked;
        if (readReceipts) settings.readReceipts = readReceipts.checked;
        if (typingIndicators) settings.typingIndicators = typingIndicators.checked;
        if (autoScroll) settings.autoScroll = autoScroll.checked;
        if (timestampFormatSelect) settings.timestampFormat = timestampFormatSelect.value;
        
        // Save to localStorage
        localStorage.setItem('theme', settings.theme);
        localStorage.setItem('fontSize', settings.fontSize);
        localStorage.setItem('messageStyle', settings.messageStyle);
        localStorage.setItem('soundNotifications', settings.soundNotifications);
        localStorage.setItem('desktopNotifications', settings.desktopNotifications);
        localStorage.setItem('messagePreview', settings.messagePreview);
        localStorage.setItem('showOnlineStatus', settings.showOnlineStatus);
        localStorage.setItem('readReceipts', settings.readReceipts);
        localStorage.setItem('typingIndicators', settings.typingIndicators);
        localStorage.setItem('autoScroll', settings.autoScroll);
        localStorage.setItem('timestampFormat', settings.timestampFormat);
        
        // Apply settings
        applySettings();
        
        if (notifications && notifications.success) {
            notifications.success('Settings saved successfully!', 'Success', 3000);
        }
    }

    // Apply settings
    function applySettings() {
        console.log('Applying settings...');
        
        // Apply theme
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${settings.theme}`);
        
        // Apply font size
        document.documentElement.style.setProperty('--font-size', settings.fontSize + 'px');
        
        // Apply message style
        document.body.className = document.body.className.replace(/message-style-\w+/g, '');
        document.body.classList.add(`message-style-${settings.messageStyle}`);
        
        // Request desktop notifications permission
        if (settings.desktopNotifications && 'Notification' in window) {
            Notification.requestPermission();
        }
    }

    // Reset settings
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            localStorage.clear();
            settings = {
                theme: 'dark',
                fontSize: '14',
                messageStyle: 'bubbles',
                soundNotifications: false,
                desktopNotifications: false,
                messagePreview: true,
                showOnlineStatus: true,
                readReceipts: false,
                typingIndicators: true,
                autoScroll: true,
                timestampFormat: '12h'
            };
            loadSettingsValues();
            applySettings();
            if (notifications && notifications.success) {
                notifications.success('Settings reset to default', 'Success', 3000);
            }
        }
    }

    // Change username
    async function changeUsername() {
        const settingsUsername = document.getElementById('settings-username');
        if (!settingsUsername) return;
        
        const newUsername = settingsUsername.value.trim();
        
        if (!newUsername) {
            if (notifications && notifications.error) {
                notifications.error('Please enter a username', 'Error', 3000);
            }
            return;
        }
        
        if (newUsername === currentUser.displayName) {
            if (notifications && notifications.error) {
                notifications.error('This is already your username', 'Error', 3000);
            }
            return;
        }
        
        if (newUsername.length < 3) {
            if (notifications && notifications.error) {
                notifications.error('Username must be at least 3 characters', 'Error', 3000);
            }
            return;
        }
        
        if (newUsername.length > 20) {
            if (notifications && notifications.error) {
                notifications.error('Username must be 20 characters or less', 'Error', 3000);
            }
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
            if (notifications && notifications.error) {
                notifications.error('Username can only contain letters, numbers, underscores, and hyphens', 'Error', 3000);
            }
            return;
        }
        
        try {
            // Check if username is already taken
            const username_lower = newUsername.toLowerCase();
            const snapshot = await database.ref('users')
                .orderByChild('displayName_lower')
                .equalTo(username_lower)
                .once('value');
            
            if (snapshot.exists()) {
                // Check if it's taken by someone else
                let isTakenBySomeoneElse = false;
                snapshot.forEach(childSnapshot => {
                    if (childSnapshot.key !== currentUser.uid) {
                        isTakenBySomeoneElse = true;
                    }
                });
                
                if (isTakenBySomeoneElse) {
                    if (notifications && notifications.error) {
                        notifications.error('This username is already taken', 'Error', 3000);
                    }
                    return;
                }
            }
            
            // Update username in Firebase Auth
            await currentUser.updateProfile({ displayName: newUsername });
            
            // Update username in database
            await database.ref('users/' + currentUser.uid).update({
                displayName: newUsername,
                displayName_lower: newUsername.toLowerCase()
            });
            
            // Update UI
            updateUsernameDisplay(newUsername);
            
            // Show success message
            if (notifications && notifications.success) {
                notifications.success('Username changed successfully!', 'Success', 3000);
            }
            
        } catch (error) {
            console.error('Error changing username:', error);
            if (notifications && notifications.error) {
                notifications.error('Failed to change username. Please try again.', 'Error', 3000);
            }
        }
    }

    // Update username display in UI
    function updateUsernameDisplay(newUsername) {
        // Update header username
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = newUsername;
        }
        
        // Update avatar
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            const avatarText = newUsername && newUsername.length > 0 ? 
                newUsername.charAt(0).toUpperCase() : 'U';
            userAvatarElement.textContent = avatarText;
        }
        
        // Update allUsers object
        if (typeof allUsers !== 'undefined' && allUsers[currentUser.uid]) {
            allUsers[currentUser.uid].displayName = newUsername;
            allUsers[currentUser.uid].displayName_lower = newUsername.toLowerCase();
        }
        
        // Refresh contacts list
        if (typeof loadContactsList === 'function') {
            loadContactsList();
        }
    }

    // Random avatar
    function generateRandomAvatar() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const avatarPreview = document.getElementById('current-avatar');
        if (avatarPreview) {
            avatarPreview.style.background = randomColor;
        }
    }

    // Initialize event listeners when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔧 Initializing settings panel...');
        
        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            console.log('🔧 Settings button found, adding click listener');
            settingsBtn.addEventListener('click', (e) => {
                console.log('🔧 Settings button clicked!', e);
                showSettingsPanel();
            });
        } else {
            console.error('🔧 Settings button not found');
        }
        
        // Close button
        const closeSettings = document.getElementById('close-settings');
        if (closeSettings) {
            closeSettings.addEventListener('click', hideSettingsPanel);
        }
        
        // Save and reset buttons
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', saveSettings);
        }
        
        const resetSettingsBtn = document.getElementById('reset-settings');
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', resetSettings);
        }
        
        // Username and avatar buttons
        const changeUsernameBtn = document.getElementById('change-username-btn');
        if (changeUsernameBtn) {
            changeUsernameBtn.addEventListener('click', changeUsername);
        }
        
        const randomAvatarBtn = document.getElementById('random-avatar-btn');
        if (randomAvatarBtn) {
            randomAvatarBtn.addEventListener('click', generateRandomAvatar);
        }
        
        // Font size slider
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        if (fontSizeSlider && fontSizeValue) {
            fontSizeSlider.addEventListener('input', (e) => {
                fontSizeValue.textContent = e.target.value + 'px';
            });
        }
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('settings-panel');
            if (panel && !panel.contains(e.target) && e.target.id !== 'settings-btn') {
                hideSettingsPanel();
            }
        });
        
        // Apply initial settings
        applySettings();
    });

    // Load users
    function loadUsers() {
        return new Promise((resolve, reject) => {
            const usersRef = database.ref('users');
            
            usersRef.once('value').then(snapshot => {                
                allUsers = {}; // Reset the object
                snapshot.forEach(childSnapshot => {
                    const user = childSnapshot.val();
                    const userId = childSnapshot.key;
                    allUsers[userId] = user; // Populate the object
                });
                
                resolve();
            }).catch(error => {
                console.error("👥📋 Failed to load users:", error);
                resolve(); // Still resolve to not break the chain
            });
        });
    }
    
    // Load all users
    function loadAllUsers() {
        database.ref('users').once('value', snapshot => {
            allUsers = {};
            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                allUsers[userId] = user;
            });
        });
    }
    
    // Load contacts list
    function loadContactsList() {
    if (!recentChatsList) return;

    recentChatsList.innerHTML = '';

    const now = Date.now();
    const twoMinutesAgo = now - (2 * 60 * 1000);
    const usersToShow = [];

    const allContactIds = new Set([
        ...recentChats,
        ...Object.keys(allUsers)
    ]);

    allContactIds.forEach(userId => {
        if (userId === currentUser.uid) return;
        if (isUserBanned(userId)) return;

        const user = allUsers[userId];
        if (!user || typeof user !== 'object') return;

        // 🔒 HARD GUARD — prevents localeCompare crash
        if (typeof user.displayName !== 'string') return;

        if (user.isGuest && (!user.lastSeen || user.lastSeen < twoMinutesAgo)) {
        return;
        }

        usersToShow.push({
        userId,
        user,
        displayName: user.displayName,
        displayNameLower: (user.displayName_lower || user.displayName).toLowerCase(),
        isOnline: user.lastSeen && user.lastSeen > twoMinutesAgo,
        isLeader: !!(window.leaderIds && window.leaderIds[userId]),
        isAdmin: !!adminUsers[userId]
        });
    });

    // ✅ SAFE SORT
    usersToShow.sort((a, b) => {
        // 1. Leaders first
        if (a.isLeader !== b.isLeader) {
        return a.isLeader ? -1 : 1;
        }

        // 2. Online users next
        if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
        }

        // 3. Alphabetical (always safe now)
        return a.displayNameLower.localeCompare(b.displayNameLower);
    });

    // Force add the bot to the contact list
    usersToShow.unshift({
        userId: AI_BOT_ID,
        user: {
            displayName: AI_BOT_NAME,
            isGuest: false
        },
        displayName: AI_BOT_NAME,
        displayNameLower: AI_BOT_NAME.toLowerCase(),
        isOnline: true, // Bots are always online
        isLeader: false,
        isAdmin: false,
        isBot: true // Internal flag
    });

    if (usersToShow.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.color = 'var(--text-secondary)';
        emptyMessage.style.fontSize = '12px';
        emptyMessage.style.padding = '10px';
        emptyMessage.textContent = 'No contacts found.';
        recentChatsList.appendChild(emptyMessage);
        return;
    }

    usersToShow.forEach(({ userId, user, isOnline, isLeader, isAdmin }) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('recent-chat-item');

        if (userId === AI_BOT_ID) {
            chatItem.classList.add('bot-contact');
        }

        chatItem.dataset.userId = userId;

        chatItem.classList.add(isOnline ? 'online' : 'offline');

        if (isLeader) {
        chatItem.classList.add('leader');
        } else if (isAdmin) {
        chatItem.classList.add('admin');
        }

        if (privateChatUser === userId) {
        chatItem.classList.add('active');
        }

        const chatInfo = document.createElement('div');
        chatInfo.classList.add('chat-info');

        const chatName = document.createElement('div');
        chatName.classList.add('chat-name');

        let displayText = user.displayName;
        if (user.isGuest) displayText += ' (Guest)';

        if (isLeader) displayText += ' 👑';
        else if (isAdmin) displayText += ' ⚡';

        chatName.textContent = displayText;

        chatInfo.appendChild(chatName);
        chatItem.appendChild(chatInfo);

        chatItem.addEventListener('click', () => {
        startPrivateChat(userId);
        if (window.innerWidth <= 480 && sidebar) {
            sidebar.classList.remove('open');
        }
        });

        recentChatsList.appendChild(chatItem);
    });
    }

    // Search for users
    function searchForUsers(searchTerm) {
        const chatSearchResults = document.getElementById('chat-search-results');
        if (!chatSearchResults) return;
        
        chatSearchResults.innerHTML = '';
        
        if (!searchTerm) {
            return;
        }
        
        const results = [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        // Search through all users
        Object.keys(allUsers).forEach(userId => {
            if (userId === currentUser.uid) return; // Skip yourself
            
            // Skip banned users
            if (isUserBanned(userId)) return;
            
            const user = allUsers[userId];
            if (!user) return;
            
            const displayName = (user.displayName || 'Unknown User').toLowerCase();
            
            if (displayName.includes(lowerSearchTerm)) {
                results.push({ userId, user });
            }
        });
        
        // Display search results
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.color = '#9e9e9e';
            noResults.style.fontSize = '12px';
            noResults.style.padding = '8px';
            noResults.textContent = 'No users found';
            chatSearchResults.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('chat-search-result-item');
                resultElement.dataset.userId = result.userId;
                
                const nameElement = document.createElement('div');
                nameElement.classList.add('chat-search-result-name');
                
                let displayText = result.user.displayName || 'Unknown User';
                if (result.user.isGuest) {
                    displayText += ' (Guest)';
                }
                if (window.leaderIds && window.leaderIds[result.userId]) {
                    displayText += ' 👑';
                }
                
                nameElement.textContent = displayText;
                
                const statusElement = document.createElement('div');
                statusElement.classList.add('chat-search-result-status');
                
                const now = Date.now();
                const fiveMinutesAgo = now - (5 * 60 * 1000);
                if (result.user.lastSeen && result.user.lastSeen > fiveMinutesAgo) {
                    statusElement.textContent = 'Online';
                } else {
                    statusElement.textContent = 'Offline';
                }
                
                resultElement.appendChild(nameElement);
                resultElement.appendChild(statusElement);
                
                resultElement.addEventListener('click', () => {
                    startPrivateChat(result.userId);
                    chatSearchResults.innerHTML = '';
                    const chatSearchInput = document.getElementById('search-user-input');
                    if (chatSearchInput) chatSearchInput.value = '';
                });
                
                chatSearchResults.appendChild(resultElement);
            });
        }
    }

    // Populate and show search modal
    function populateAndShowSearchModal() {
        console.log("🔍 Populating search modal from existing user list.");
        console.log("🔍 DEBUG: The allUsers object contains:", allUsers);
        if (!searchResults) return; // Added: Null check
        
        searchResults.innerHTML = '';

        const now = Date.now();
        const twoMinutesAgo = now - (2 * 60 * 1000);
        const usersToShow = [];

        Object.keys(allUsers).forEach(userId => {
            if (userId === currentUser.uid) return; // Skip yourself
            if (isUserBanned(userId)) return; // Skip banned users

            const user = allUsers[userId];
            if (!user) return;

            // Filter out old guests
            if (user.isGuest && (!user.lastSeen || user.lastSeen < twoMinutesAgo)) {
                return;
            }

            usersToShow.push({
                userId: userId,
                user: user,
                isOnline: user.lastSeen && user.lastSeen > twoMinutesAgo
            });
        });

        // Sort: Online users first (A-Z), then offline users (A-Z)
        usersToShow.sort((a, b) => {
            // Online users come before offline users
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            
            // If both have the same online status, sort alphabetically A-Z
            return a.user.displayName.localeCompare(b.user.displayName);
        });

        if (usersToShow.length === 0) {
            searchResults.innerHTML = '<div style="padding: 10px; color: #9e9e9e;">No users found. Try refreshing.</div>';
            if (newChatModal) newChatModal.style.display = 'block';
            return;
        }

        // Build the UI from the sorted array
        usersToShow.forEach(({ userId, user, isOnline }) => {
            const userElement = document.createElement('div');
            userElement.classList.add('search-result-item');
            userElement.dataset.userId = userId;
            
            const nameElement = document.createElement('div');
            nameElement.classList.add('search-result-name');
            
            let displayText = user.displayName || 'Unknown User';
            if (user.isGuest) {
                displayText += ' (Guest)';
            }
            if (window.leaderIds && window.leaderIds[userId]) {
                displayText += ' 👑';
            }
            
            nameElement.textContent = displayText;
            
            const statusElement = document.createElement('div');
            statusElement.classList.add('search-result-status');
            
            userElement.appendChild(nameElement);
            
            userElement.addEventListener('click', () => {
                startPrivateChat(userId);
                if (newChatModal) newChatModal.style.display = 'none';
            });
            
            searchResults.appendChild(userElement);
        });

        if (newChatModal) newChatModal.style.display = 'block';
    }

    // Start private chat with a user
    function startPrivateChat(userId) {
        // Clear typing indicators
        clearAllTypingIndicators();
        
        // Check if user is banned
        if (userId !== AI_BOT_ID && isUserBanned(userId)) {
            notifications.error("this is a banned user, bro. u can't chat with them now.", 'user not available', '6000');
            return;
        }
        
        privateChatUser = userId;
        
        // Add to recent chats
        addToRecentChats(userId);

        if (userId === AI_BOT_ID) {
            // Manually set the chat name for the bot
            if (currentRoomName) {
                currentRoomName.textContent = `${AI_BOT_NAME}`;
            }
            
            // Update room selection UI
            document.querySelectorAll('.room-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Refresh the entire contacts list to show all users again
            loadContactsList();
            
            // Load private messages
            loadMessages();
            setupTypingListeners();
            return; // Skip the database fetch
        }
        
        database.ref('users/' + userId).once('value', snapshot => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                if (currentRoomName) {
                    currentRoomName.textContent = `${user.displayName || 'Unknown User'}`;
                }
                
                // Update room selection
                document.querySelectorAll('.room-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Refresh the entire contacts list to show all users again
                loadContactsList();
                
                // Load private messages
                loadMessages();
                setupTypingListeners();
            }
        });
    }

    // Cleanup function for stale users
    function cleanupStaleUsers() {
        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000); // 5 minutes ago
        
        database.ref('users').once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                const userId = childSnapshot.key;
                
                // If user hasn't been seen in the last 5 minutes and is marked as online, remove the online status
                if (user.lastSeen && user.lastSeen < fiveMinutesAgo && user.isOnline) {
                    console.log(`User ${userId} is stale but not online. No action needed.`);
                    return;
                }
                
                // If user is a guest and hasn't been seen in the last 2 minutes, remove them
                if (user.isGuest && (!user.lastSeen || user.lastSeen < twoMinutesAgo)) {
                    console.log(`Removing stale guest user: ${userId}`);
                    database.ref('users/' + userId).remove();
                }
            });
        });
    }

    // ====================================================================================================
    // RECENT CHATS FUNCTIONS
    // ====================================================================================================
    
    // Load recent chats
    function loadRecentChats() {
        if (!currentUser) return; // Safety check
        
        database.ref('recentChats/' + currentUser.uid).once('value', snapshot => {
            recentChats = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    recentChats.push(childSnapshot.key);
                });
            }
            updateRecentChatsUI();
        });
    }

    // Add user to recent chats
    function addToRecentChats(userId) {
        if (!recentChats.includes(userId)) {
            recentChats.unshift(userId);
            // Keep only the last 10 recent chats
            if (recentChats.length > 10) {
                recentChats = recentChats.slice(0, 10);
            }
            
            // Update in database
            const updates = {};
            recentChats.forEach((id, index) => {
                updates[id] = index;
            });
            database.ref('recentChats/' + currentUser.uid).set(updates);
        }
    }

    // Update recent chats UI
    function updateRecentChatsUI() {
        if (!recentChatsList) return; // Added: Null check
        
        recentChatsList.innerHTML = '';
        
        if (recentChats.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.color = '#9e9e9e';
            emptyMessage.style.fontSize = '12px';
            emptyMessage.style.padding = '10px';
            emptyMessage.textContent = 'No recent chats';
            recentChatsList.appendChild(emptyMessage);
            return;
        }
        
        recentChats.forEach(userId => {
            // Skip banned users
            if (isUserBanned(userId)) return;
            
            database.ref('users/' + userId).once('value', snapshot => {
                if (snapshot.exists()) {
                    const user = snapshot.val();
                    
                    if (user.isGuest) {
                        const now = Date.now();
                        const twoMinutesAgo = now - (2 * 60 * 1000);
                        
                        // Skip this old guest
                        if (!user.lastSeen || user.lastSeen < twoMinutesAgo) {
                            return;
                        }
                    }
                
                    const chatItem = document.createElement('div');
                    chatItem.classList.add('recent-chat-item');
                    chatItem.dataset.userId = userId;
                    chatItem.dataset.guest = user.isGuest;
                    
                    if (privateChatUser === userId) {
                        chatItem.classList.add('active');
                    }
                    
                    const chatInfo = document.createElement('div');
                    chatInfo.classList.add('chat-info');
                    
                    const chatName = document.createElement('div');
                    chatName.classList.add('chat-name');
                    
                    let displayText = user.displayName || 'Unknown User';
                    if (user.isGuest) {
                        displayText += ' (Guest)';
                    }
                    
                    chatName.textContent = displayText;
                    
                    chatInfo.appendChild(chatName);
                    chatItem.appendChild(chatInfo);
                    
                    recentChatsList.appendChild(chatItem);
                }
            });
        });
    }

    // ====================================================================================================
    // ADMIN FUNCTIONS
    // ====================================================================================================
    
    // Set up admin-specific listeners
    function setupAdminListeners() {
        if (!isCurrentUserAdmin()) return;
        
        // Listen for changes to banned users
        database.ref('bannedUsers').on('value', snapshot => {
            bannedUsers = snapshot.val() || {};
            loadContactsList();
        });
        
        // Listen for changes to admin users
        database.ref('adminUsers').on('value', snapshot => {
            adminUsers = snapshot.val() || {};
            loadContactsList();
        });
    }
    
    // Refresh banned users list (for leaders/admins)
    async function refreshBannedUsers() {
        if (!isCurrentUserAdmin() && !isCurrentUserLeader()) {
            notifications.error("You don't have permission to refresh banned users", 'Access Denied', 5000);
            return;
        }
        
        try {
            console.log("🔧 Refreshing banned users list...");
            const bannedSnapshot = await database.ref('bannedUsers').once('value');
            bannedUsers = bannedSnapshot.val() || {};
            console.log("🔧 Refreshed banned users:", bannedUsers);
            
            // Update UI
            updateAdminUserSelect();
            loadContactsList();
            
            notifications.success("Banned users list refreshed", 'Success', 3000);
        } catch (error) {
            console.error("🔧 Error refreshing banned users:", error);
            
            if (error.code === 'PERMISSION_DENIED') {
                notifications.error("Permission denied. Your Firebase security rules may need updating.", 'Security Rules Error', 5000);
            } else {
                notifications.error("Failed to refresh banned users list", 'Error', 5000);
            }
        }
    }

    // ====================================================================================================
    // MESSAGE MANAGEMENT FUNCTIONS
    // ====================================================================================================
    
    // Message Listener Manager - Fixed to properly handle listeners
    const MessageListenerManager = {
        currentPath: null,
        currentRef: null,
        listeners: [], // Track all listeners

        detach: function() {
            console.log("💬🦻👨‍💼 Detaching listener for path:", this.currentPath);
            
            if (this.currentRef) {
                this.currentRef.off();
                this.currentRef = null;
            }
            this.currentPath = null;
            
            // Clear all listeners
            this.listeners = [];
        },
        
        // Add this reset method to clear everything
        reset: function() {
            console.log("💬🦻👨‍💼 Resetting all state");
            this.detach();
            this.currentPath = null;
            this.currentRef = null;
            this.listeners = [];
        },
        
        attach: function(path, onMessage) {
            // If we're already listening to this exact path, do nothing to prevent duplicates.
            if (this.currentPath === path && this.currentRef) {
                console.log("💬🦻👨‍💼 Already listening to", path, ". Skipping re-attach.");
                return;
            }

            // If we were listening to a different path, detach that listener first.
            if (this.currentPath) {
                this.detach();
            }

            this.currentPath = path;
            this.currentRef = database.ref(path);
            
            console.log("💬🦻👨‍💼 Attaching NEW listener to path:", path);
            
            // Create a callback that we can track
            const messageCallback = (snapshot) => {
                if (snapshot.exists()) {
                    onMessage(snapshot.val());
                }
            };
            
            // Store the callback for later removal
            this.listeners.push({
                ref: this.currentRef,
                callback: messageCallback
            });
            
            this.currentRef.on('child_added', messageCallback);
        }
    };

    // Display a message
    function displayMessage(message) {
        const senderId = message.userId || message.senderId;
        
        // Check if message object exists
        if (!message) {
            console.error("Invalid message object:", message);
            return;
        }
        
        // Only play sound if message is NOT from current user AND tab is inactive
        if (senderId !== currentUser.uid && !isTabActive()) {
            playNotificationSound();
        }
        
        // Check if sender is banned
        if (isUserBanned(senderId)) {
            console.log("Message from banned user, not displaying.");
            return;
        }

        const messagesContainer = document.getElementById('messages');
        if (!messagesContainer) {
            console.error("Could not find the messages container element!");
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.dataset.messageId = message.messageId || message.key || 'unknown';
        messageElement.dataset.timestamp = message.timestamp;
        
        // Check if message is from current user
        const isCurrentUser = senderId === currentUser.uid;
        if (isCurrentUser) {
            messageElement.classList.add('current-user');
        }
        
        // Add guest status if it exists
        if (message.isGuest) {
            messageElement.setAttribute('data-guest', 'true');
        }

        // Add role indicator - prioritize leader over admin
        if (window.leaderIds && window.leaderIds[senderId]) {
            messageElement.classList.add('leader-message');
        } else if (adminUsers[senderId]) {
            messageElement.classList.add('admin-message');
        }

        // Handle replies
        if (message.replyTo) {
            messageElement.classList.add('is-reply');
            
            const repliedToElement = document.createElement('div');
            repliedToElement.classList.add('replied-to-message');
            repliedToElement.innerHTML = `<strong>${message.replyTo.username || message.replyTo.senderName}:</strong> ${message.replyTo.text}`;
            messageElement.appendChild(repliedToElement);
        }
        
        // Create username element with role indicators
        const usernameElement = document.createElement('div');
        usernameElement.classList.add('username');

        let displayName = message.username || message.senderName || 'Unknown User';

        // Add role indicators - prioritize leader over admin
        if (!displayName.includes('👑') && window.leaderIds && window.leaderIds[senderId]) {
            displayName += ' 👑'; // Leaders get crown
        } else if (!displayName.includes('⚡') && adminUsers[senderId]) {
            displayName += ' ⚡'; // Admins get lightning bolt
        }

        usernameElement.textContent = displayName;
        messageElement.appendChild(usernameElement);
        
        // Create content element
        const contentElement = document.createElement('div');
        contentElement.classList.add('content');

        // Check message type and render accordingly
        if (message.type === 'voice') {
            const audioPlayer = document.createElement('audio');
            audioPlayer.src = message.content;
            audioPlayer.controls = true;
            audioPlayer.classList.add('voice-player');
            contentElement.appendChild(audioPlayer);
        } else {
            const textElement = document.createElement('div');
            textElement.classList.add('text');
            textElement.textContent = message.text || message.content;
            contentElement.appendChild(textElement);
        }
        messageElement.appendChild(contentElement);
        
        // Create timestamp element
        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        
        const date = new Date(message.timestamp);
        timeElement.textContent = `${formatTime(date)} • ${formatShortDate(date)}`;
        messageElement.appendChild(timeElement);
        
        // Add reply button for non-current users
        if (!isCurrentUser) {
            const replyButtonContainer = document.createElement('div');
            replyButtonContainer.classList.add('reply-button-container');
            
            const replyButton = document.createElement('button');
            replyButton.classList.add('reply-button');
            replyButton.textContent = 'Reply';
            
            // Add the click event listener to initiate the reply
            replyButton.addEventListener('click', () => {
                setReplyingTo({
                    id: senderId,
                    username: message.username || message.senderName,
                    text: message.text
                });
            });
            
            replyButtonContainer.appendChild(replyButton);
            messageElement.appendChild(replyButtonContainer);
        }
        
        // Add message to container
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send a message
    async function sendMessage() {
        console.log("💬⤴️ sendMessage function STARTED =====");
        
        // Prevent sending other messages while recording or uploading
        if (isRecording || isUploading) {
            notifications.warning("Please wait for the voice message to finish processing.", "Please Wait");
            return;
        }
        
        const messageText = messageInput.value.trim();
        console.log("💬⤴️ Message text:", messageText);
        console.log("💬⤴️ Current user:", currentUser);
        console.log("💬⤴️ Replying to message:", replyingTo);
        
        // Check if current user is banned
        const isBanned = await isCurrentUserBanned();
        if (isBanned) {
            console.error("💬⤴️❌ Cannot send message. User is banned.");
            notifications.error("u can't send messages, bro. ur banned.", "Can't do that", 6000);
            
            // Show banned notification
            try {
                const banSnapshot = await database.ref('bannedUsers/' + currentUser.uid).once('value');
                if (banSnapshot.exists()) {
                    const banData = banSnapshot.val();
                    showBannedNotification(banData.reason || 'No reason provided.');
                }
            } catch (error) {
                console.error("Error fetching ban details:", error);
                showBannedNotification('No reason provided.');
            }
            
            return;
        }
        
        // Check if current user has verified their email (if not a guest)
        if (!currentUser.isAnonymous && !currentUser.emailVerified) {
            notifications.error("ur email is unverified, bro. verify it first, then try sending a message.", "Can't do that", '6000');
            return;
        }
        
        if (!currentUser) {
            console.error("💬⤴️❌ ERROR: Cannot send message. User is not logged in.");
            notifications.error("u gotta be logged in to send messages, bro.", "Can't do that (yet)", 6000);
            return;
        }
        
        if (!messageText && !selectedImage) {
            console.warn("💬⤴️⚠️ No content to send");
            return;
        }
        
        console.log("💬⤴️✅ Checks passed. Attempting to send message...");
        const timestamp = Date.now();
        
        let messageRef;
        let messageData;
        
        // Standardize message data structure
        const baseMessageData = {
            senderId: currentUser.uid,
            receiverId: privateChatUser,
            senderName: currentUser.displayName || 'User',
            text: messageText,
            timestamp: timestamp,
            isGuest: currentUser.isAnonymous,
            replyTo: replyingTo ? {
                text: replyingTo.text,
                username: replyingTo.username || replyingTo.senderName,
                id: replyingTo.id
            } : null
        };
        
        // Determine message location and prepare data
        if (privateChatUser) {
            // Private message
            const chatId = [currentUser.uid, privateChatUser].sort().join('_');
            messageRef = database.ref('privateMessages/' + chatId);
            messageData = baseMessageData;
        } else {
            // Public room message
            messageRef = database.ref('messages/' + currentRoom);
            messageData = {...baseMessageData, userId: currentUser.uid, username: currentUser.displayName || 'User'};
        }
        
        console.log("🔧 Message data to be sent:", messageData);
        
        // Send the message to Firebase
        const messagePromise = messageRef.push(messageData);
        
        // Handle the response
        messagePromise
            .then(async() => {
                console.log("✅ SUCCESS: Message was successfully sent to Firebase!");
                
                // Clear input and states
                if (messageInput) messageInput.value = '';
                cancelReply();
                stopTyping();

                // Update recent chats if private message
                if (privateChatUser) {
                    addToRecentChats(privateChatUser);
                    
                    // ====================================================================================================
                    // AI BOT RESPONSE TRIGGER (GROQ)
                    // ====================================================================================================
                    if (privateChatUser === AI_BOT_ID) {
                        // 1. Show typing indicator
                        const chatId = [currentUser.uid, AI_BOT_ID].sort().join('_');
                        const botTypingRef = database.ref('typing/' + chatId + '/' + AI_BOT_ID);
                        botTypingRef.set(true);
                        
                        // 2. Call Groq and wait for the answer
                        const aiResponse = await getAIResponse(messageText);
                        
                        // 3. Remove typing indicator
                        botTypingRef.remove();
                        
                        // 4. Send the AI's reply to the database
                        const botMessageData = {
                            senderId: AI_BOT_ID,
                            receiverId: currentUser.uid,
                            senderName: AI_BOT_NAME,
                            text: aiResponse,
                            timestamp: Date.now(),
                            isGuest: false,
                            replyTo: null
                        };
                        
                        database.ref('privateMessages/' + chatId).push(botMessageData);
                    }
                    // ===========================================================================================
                }
            })
            .catch((error) => {
                console.error("❌ ERROR: Firebase rejected the message. Error details:", error);
                notifications.error("couldn't send that message, bro. check the console for details.", 'Something Went Wrong', '8000');
            });
    }

    // Load messages
    function loadMessages() {
        console.log("💬✔️ loadMessages has been called.");
        
        const messagesContainer = document.getElementById('messages');
        if (!messagesContainer) {
            console.error("💬❌ Could not find the messages container element!");
            return;
        }
        
        // Clear existing messages
        messagesContainer.innerHTML = '';
        
        // Show loading indicator
        const loadingContainer = document.getElementById('messages-loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'flex';
        }
        
        // Determine the path based on whether it's a private chat or room
        let path;
        if (privateChatUser) {
            const chatId = [currentUser.uid, privateChatUser].sort().join('_');
            path = 'privateMessages/' + chatId;
        } else {
            path = 'messages/' + currentRoom;
        }
        
        console.log("💬🦻 Setting up listener for path:", path);
        
        // Force detach any existing listener before attaching new one
        MessageListenerManager.detach();
        
        // Use the MessageListenerManager to handle messages
        MessageListenerManager.attach(
            path,
            (message) => {
                // Hide loading indicator after first message loads
                if (loadingContainer) {
                    loadingContainer.style.display = 'none';
                }
                displayMessage(message);

                // Show notification if tab is inactive and message is from another user
                if (
                    Notification.permission === 'granted' &&
                    message.senderId !== currentUser.uid &&
                    document.hidden
                ) {
                    new Notification(
                        message.username || message.senderName || 'new message yo',
                        {
                            body: message.text || 'get here bro',
                            icon: '/favicon-16x16.png' // optional
                        }
                    );
                }
            }
        );
    }
    
    // Set replying to message
    function setReplyingTo(message) {
        replyingTo = message;
        
        // Update the message input area to show the preview
        const messageInputContainer = document.getElementById('message-input-container');
        if (!messageInputContainer) return; // Add this line
        
        // Remove any existing reply preview
        const existingPreview = messageInputContainer.querySelector('.reply-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create the new reply preview element
        const replyPreview = document.createElement('div');
        replyPreview.classList.add('reply-preview');
        
        const replyText = document.createElement('span');
        replyText.textContent = `Replying to ${message.username || message.senderName}: "${message.text}"`;
        
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-reply-btn');
        cancelButton.textContent = '✕';
        
        replyPreview.appendChild(replyText);
        replyPreview.appendChild(cancelButton);
        
        // Insert the preview before the input field
        const inputWithButton = messageInputContainer.querySelector('.input-with-button');
        messageInputContainer.insertBefore(replyPreview, inputWithButton);
        
        // Focus the input field
        if (messageInput) messageInput.focus();
        
        // Add click handler to cancel the reply
        cancelButton.addEventListener('click', cancelReply);
    }

    // Cancel reply
    function cancelReply() {
        replyingTo = null;
        
        // Remove the reply preview
        const replyPreview = document.querySelector('.reply-preview');
        if (replyPreview) {
            replyPreview.remove();
        }
        
        // Focus the input field
        if (messageInput) messageInput.focus();
    }

    // ====================================================================================================
    // IMAGE UPLOAD FUNCTIONS
    // ====================================================================================================
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Show image preview
    function showImagePreview(file) {
        if (!previewContainer || !preview || !imageName || !imageSize) return; // Added: Null check
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            imageName.textContent = file.name;
            imageSize.textContent = formatFileSize(file.size);
            previewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }

    // Cancel image upload
    function cancelImageUpload() {
        selectedImage = null;
        if (previewContainer) previewContainer.style.display = 'none';
        if (imageInput) imageInput.value = '';
    }

    // Upload image to Firebase Storage and return URL
    async function uploadImageAndGetUrl(file) {
        return new Promise((resolve, reject) => {
            try {
                // Validate file
                if (!file.type.startsWith('image/')) {
                    reject(new Error('Invalid file type. Please select an image.'));
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    reject(new Error('Image size must be less than 5MB'));
                    return;
                }
                
                // Create unique filename
                const timestamp = Date.now();
                const fileName = `images/${currentUser.uid}/${timestamp}_${file.name}`;
                
                // Upload to Firebase Storage
                const storageRef = storage.ref(fileName);
                const uploadTask = storageRef.put(file);
                
                // Show progress
                showUploadProgress();
                
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    updateUploadProgress(progress);
                });
                
                uploadTask.then((snapshot) => {
                    hideUploadProgress();
                    return snapshot.ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    console.log("🔗 Got download URL:", downloadURL);
                    resolve(downloadURL);
                })
                .catch((error) => {
                    console.error("❌ Storage error:", error);
                    reject(error);
                });
                
            } catch (error) {
                console.error("❌ Upload error:", error);
                reject(error);
            }
        });
    }

    // Update upload progress bar
    function updateUploadProgress(percentage) {
        const progressBar = document.querySelector('.upload-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }

    // Show upload progress
    function showUploadProgress() {
        const messageInputContainer = document.getElementById('message-input-container');
        if (!messageInputContainer) return; // Added: Null check
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'upload-progress';
        progressContainer.innerHTML = '<div class="upload-progress-bar"></div>';
        
        messageInputContainer.appendChild(progressContainer);
    }

    // Hide upload progress
    function hideUploadProgress() {
        const progressContainer = document.querySelector('.upload-progress');
        if (progressContainer) {
            progressContainer.remove();
        }
    }

    // Setup image upload functionality
    function setupImageUpload() {
        if (!imageInput || !uploadBtn || !previewContainer || !cancelBtn) return; // Added: Null check
        
        // Upload button click
        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });
        
        // File selection
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file
            if (!file.type.startsWith('image/')) {
                notifications.error('Please select an image file', 'Invalid File', 5000);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                notifications.error('Image must be smaller than 5MB', 'File Too Large', 5000);
                return;
            }
            
            selectedImage = file;
            showImagePreview(file);
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', cancelImageUpload);
    }

    // ====================================================================================================
    // TYPING INDICATOR FUNCTIONS
    // ====================================================================================================
    
    // Handle typing indicator
    function handleTyping() {
        if (!currentUser) return;
        
        // NEW: Clear typing status when switching chats
        clearAllTypingIndicators();
        
        if (!isTyping) {
            isTyping = true;
            
            let typingRef;
            
            if (privateChatUser) {
                // Private typing
                const chatId = [currentUser.uid, privateChatUser].sort().join('_');
                typingRef = database.ref('typing/' + chatId + '/' + currentUser.uid);
            } else {
                // Room typing
                typingRef = database.ref('typing/' + currentRoom + '/' + currentUser.uid);
            }
            
            // Set typing status
            typingRef.set(true);
            
            // Auto-remove after 3 seconds of inactivity
            clearTimeout(typingTimer);
            typingTimer = setTimeout(stopTyping, 3000);
            
            // Set up disconnect handler
            typingRef.onDisconnect().remove();
        } else {
            // Reset timer
            clearTimeout(typingTimer);
        }
    }

    // Clear all typing indicators when switching
    function clearAllTypingIndicators() {
        const chatButtons = document.querySelectorAll('.recent-chat-item');
        chatButtons.forEach(button => {
            // Remove typing class but keep online/offline status
            button.classList.remove('typing');
            
            // Get user ID from button
            const userId = button.dataset.userId;
            if (userId && allUsers[userId]) {
                const now = Date.now();
                const twoMinutesAgo = now - (2 * 60 * 1000);
                const isOnline = allUsers[userId].lastSeen && allUsers[userId].lastSeen > twoMinutesAgo;
                
                // Remove all status classes first
                button.classList.remove('online', 'offline');
                
                // Restore online/offline status
                if (isOnline) {
                    button.classList.add('online');
                } else {
                    button.classList.add('offline');
                }
            }
        });
    }

    // Stop typing indicator
    function stopTyping() {
        isTyping = false;
        
        let typingRef;
        
        if (privateChatUser) {
            // Private typing
            const chatId = [currentUser.uid, privateChatUser].sort().join('_');
            typingRef = database.ref('typing/' + chatId + '/' + currentUser.uid);
        } else {
            // Room typing
            typingRef = database.ref('typing/' + currentRoom + '/' + currentUser.uid);
        }
        
        // Remove typing status
        typingRef.remove();
        
        // Clear local indicator
        clearTimeout(typingTimer);
    }

    // Listen for typing indicators
    async function setupTypingListeners() {
        if (!typingIndicator) return; // Added: Null check
        
        // Clear existing typing indicator
        typingIndicator.textContent = '';
        
        let typingRef;
        
        if (privateChatUser) {
            // Private chat typing indicator
            const chatId = [currentUser.uid, privateChatUser].sort().join('_');
            typingRef = database.ref('typing/' + chatId);
        } else {
            // Room typing indicator
            typingRef = database.ref('typing/' + currentRoom);
        }
        
        typingRef.on('value', async (snapshot) => {
            if (!snapshot.exists()) {
                updateTypingIndicator([]);
                return;
            }

            const typingUserIds = Object.keys(snapshot.val() || {});
            const validTypingUserIds = typingUserIds.filter(uid => 
                uid !== currentUser.uid && !isUserBanned(uid)
            );

            if (validTypingUserIds.length === 0) {
                updateTypingIndicator([]);
                return;
            }

            // Fetch user data for all typing users at once
            const userPromises = validTypingUserIds.map(uid => 
                database.ref('users/' + uid).once('value').then(snap => snap.exists() ? snap.val() : null)
            );

            try {
                const users = await Promise.all(userPromises);
                const typingNames = users
                    .filter(user => user !== null) // Filter out null results
                    .map(user => user.displayName || 'Unknown User');

                updateTypingIndicator(typingNames);
            } catch (error) {
                console.error("Error fetching typing users:", error);
                updateTypingIndicator([]); // Clear indicator on error
            }
        });
        
        // NEW: Listen for typing status changes
        typingRef.on('child_added', async (snapshot) => {
            const userId = snapshot.key;
            const isTyping = snapshot.val();
            
            if (userId === currentUser.uid || isUserBanned(userId)) {
                return; // Ignore own typing and banned users
            }
            
            // Update chat button UI
            updateChatButtonTypingStatus(userId, isTyping);
        });
        
        // Listen for typing removal
        typingRef.on('child_removed', async (snapshot) => {
            const userId = snapshot.key;
            updateChatButtonTypingStatus(userId, false);
        });
    }

    // Update individual chat button typing status
    function updateChatButtonTypingStatus(userId, isTyping) {
        // Find the chat button for this user
        const chatButtons = document.querySelectorAll('.recent-chat-item');
        
        chatButtons.forEach(button => {
            if (button.dataset.userId === userId) {
                const user = allUsers[userId];
                if (!user) return;
                
                // Remove typing class
                button.classList.remove('typing');
                
                if (isTyping) {
                    // Add typing class but keep online status
                    button.classList.add('typing');
                } else {
                    // Remove typing class and check online status
                    const now = Date.now();
                    const twoMinutesAgo = now - (2 * 60 * 1000);
                    const isUserOnline = user.lastSeen && user.lastSeen > twoMinutesAgo;
                    
                    // Remove all status classes first
                    button.classList.remove('online', 'offline');
                    
                    // Restore online/offline status
                    if (isUserOnline) {
                        button.classList.add('online');
                    } else {
                        button.classList.add('offline');
                    }
                }
            }
        });
    }

    // Update typing indicator UI
    function updateTypingIndicator(users) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (!typingIndicator) return;
        
        if (users.length === 0) {
            typingIndicator.textContent = '';
        } else if (users.length === 1) {
            typingIndicator.textContent = `${users[0]} is typing...`;
        } else {
            typingIndicator.textContent = `${users.join(', ')} are typing...`;
        }
    }

    // ====================================================================================================
    // VOICE MESSAGE FUNCTIONS
    // ====================================================================================================

    function startRecording() {
        if (isRecording) return;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                isRecording = true;
                audioChunks = [];
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    uploadVoiceMessage(audioBlob);
                };

                mediaRecorder.start();
                recordVoiceBtn.textContent = '⏹️';
                recordVoiceBtn.classList.add('recording');
            })
            .catch(err => {
                console.error("Error accessing microphone:", err);
                notifications.error("Could not access your microphone. Please check permissions.", "Microphone Error");
            });
    }

    function stopRecording() {
        if (!isRecording || !mediaRecorder) return;

        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        recordVoiceBtn.textContent = '🎤';
        recordVoiceBtn.classList.remove('recording');
    }

    async function uploadVoiceMessage(audioBlob) {
        if (!storage) {
            notifications.error("Firebase Storage is not available.", "Upload Error");
            return;
        }

        isUploading = true;
        sendBtn.disabled = true;
        recordVoiceBtn.disabled = true;
        notifications.info("Uploading voice message...", "Uploading");

        const timestamp = Date.now();
        const fileName = `voiceMessages/${currentUser.uid}/${timestamp}.mp3`;
        const storageRef = storage.ref(fileName);

        try {
            const uploadTask = storageRef.put(audioBlob);
            await uploadTask;

            const downloadURL = await storageRef.getDownloadURL();
            sendVoiceMessage(downloadURL);
        } catch (error) {
            console.error("Error uploading voice message:", error);
            notifications.error("Failed to upload voice message.", "Upload Error");
        } finally {
            isUploading = false;
            sendBtn.disabled = false;
            recordVoiceBtn.disabled = false;
        }
    }

    function sendVoiceMessage(audioUrl) {
        if (!currentUser) return;

        const timestamp = Date.now();
        let messageRef;
        let messageData;

        const baseMessageData = {
            senderId: currentUser.uid,
            senderName: currentUser.displayName || 'User',
            timestamp: timestamp,
            isGuest: currentUser.isAnonymous,
            type: 'voice',
            content: audioUrl
        };

        if (privateChatUser) {
            const chatId = [currentUser.uid, privateChatUser].sort().join('_');
            messageRef = database.ref('privateMessages/' + chatId);
            messageData = baseMessageData;
        } else {
            messageRef = database.ref('messages/' + currentRoom);
            messageData = { ...baseMessageData, userId: currentUser.uid, username: currentUser.displayName || 'User' };
        }

        messageRef.push(messageData)
            .then(() => {
                console.log("Voice message sent successfully!");
                if (privateChatUser) {
                    addToRecentChats(privateChatUser);
                }
            })
            .catch(error => {
                console.error("Error sending voice message:", error);
                notifications.error("Failed to send voice message.", "Send Error");
            });
    }

    // ====================================================================================================
    // EVENT LISTENERS
    // ====================================================================================================
    
    // Auth tab switching
    if (guestTab) guestTab.addEventListener('click', () => switchAuthTab('guest'));
    if (accountTab) accountTab.addEventListener('click', () => switchAuthTab('account'));
    if (showSignup) showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthPanel('signup');
    });
    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchAuthPanel('login');
    });
    if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', resetPassword);

    // Auth functionality
    if (guestLoginBtn) guestLoginBtn.addEventListener('click', loginAsGuest);
    if (loginBtn) loginBtn.addEventListener('click', loginWithEmail);
    if (signupBtn) signupBtn.addEventListener('click', signUp);
    if (setUsernameBtn) setUsernameBtn.addEventListener('click', setUsername);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // Notification button
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('#enable-notification-btn');
        if (!btn) return;

        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            log('🔔 Notifications enabled', 0, 'admin');
        } else {
            log('🔕 Notifications denied', 0, 'admin');
        }
    });
    
    // Allow Enter key to login from password field
    if (passwordInput) passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (loginBtn) loginBtn.click();
        }
    });

    // Allow Enter key to sign up from password field
    if (displayName) displayName.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (signupBtn) signupBtn.click();
        }
    });

    // Allow Enter key to set username from username field
    if (chooseUsername) chooseUsername.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (setUsernameBtn) setUsernameBtn.click();
        }
    });
    
    // Allow Enter key to join as guest from the username field
    if (guestUsername) guestUsername.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (guestLoginBtn) guestLoginBtn.click();
        }
    });
    
    // Email verification button
    const verifyEmailBtn = document.getElementById('verify-email-btn');
    if (verifyEmailBtn) {
        verifyEmailBtn.addEventListener('click', sendEmailVerification);
    }
    
    // Room list
    if (roomList) roomList.addEventListener('click', (e) => {
        if (e.target.classList.contains('room-item')) {
            switchRoom(e.target.dataset.room);
        }
    });
    
    // New room modal
    if (openNewRoomModalBtn) openNewRoomModalBtn.addEventListener('click', () => {
        if (newRoomModal) newRoomModal.style.display = 'block';
        if (newRoomNameModal) newRoomNameModal.value = ''; // Clear input on open
        if (newRoomErrorMessage) newRoomErrorMessage.style.display = 'none'; // Hide error on open
    });

    if (closeNewRoomModalBtn) closeNewRoomModalBtn.addEventListener('click', () => {
        if (newRoomModal) newRoomModal.style.display = 'none';
    });

    // Handle Enter key in the modal input
    if (newRoomNameModal) newRoomNameModal.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addRoomFromModal();
        }
    });

    // Recent chats functionality
    if (recentChatsList) recentChatsList.addEventListener('click', (e) => {
        const chatItem = e.target.closest('.recent-chat-item');
        if (chatItem) {
            startPrivateChat(chatItem.dataset.userId);
            // Close mobile sidebar after selecting chat
            if (window.innerWidth <= 480 && sidebar) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    if (recordVoiceBtn) {
        recordVoiceBtn.addEventListener('click', () => {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        });
    }
    
    if (startNewChatBtn) startNewChatBtn.addEventListener('click', () => {
        if (searchUserInput) searchUserInput.value = ''; // Clear previous search input
        populateAndShowSearchModal();
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        if (newChatModal) newChatModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === newChatModal) {
            if (newChatModal) newChatModal.style.display = 'none';
        }
    });

    if (searchUserInput) searchUserInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterUsers(searchTerm);
    });

    // Mobile menu toggle
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', () => {
        if (sidebar) sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 480 && 
            sidebar && !sidebar.contains(e.target) && 
            mobileMenuToggle && !mobileMenuToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Collapse toggle listeners
    document.querySelectorAll('.collapse-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const sectionId = toggle.dataset.section;
            toggleSection(sectionId);
        });
    });

    // Section header click to toggle
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking on buttons
            if (e.target.classList.contains('refresh-btn') || 
                e.target.classList.contains('collapse-toggle')) {
                return;
            }
            const section = header.closest('.collapsible-section');
            if (section) {
                toggleSection(section.id);
            }
        });
    });

    // Admin tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Check if this is a leader-only tab and user is not leader
            if ((btn.dataset.tab === 'chats' || btn.dataset.tab === 'database') && !isCurrentUserLeader()) {
                notifications.error('only leaders can access this tab, bro.', 'Access Denied', '6000');
                return;
            }
            
            switchAdminTab(btn.dataset.tab);
        });
    });

    // Admin functionality
    if (banUserBtn) {
        banUserBtn.addEventListener('click', () => {
            const userId = adminUserSelect.value;
            const reason = adminReasonInput.value.trim();
            banUser(userId, reason);
        });
    }
    
    if (unbanUserBtn) {
        unbanUserBtn.addEventListener('click', () => {
            const userId = adminUserSelect.value;
            unbanUser(userId);
        });
    }
    
    if (grantAdminBtn) {
        grantAdminBtn.addEventListener('click', () => {
            const userId = adminUserSelect.value;
            grantAdmin(userId);
        });
    }
    
    if (revokeAdminBtn) {
        revokeAdminBtn.addEventListener('click', () => {
            const userId = adminUserSelect.value;
            revokeAdmin(userId);
        });
    }

    // Admin user select change
    if (adminUserSelect) {
        adminUserSelect.addEventListener('change', () => {
            showUserDetails(adminUserSelect.value);
        });
    }
    
    const refreshAdminUsersBtn = document.getElementById('refresh-admin-users-btn');
    if (refreshAdminUsersBtn) {
        refreshAdminUsersBtn.addEventListener('click', async () => {
            try {
                refreshAdminUsersBtn.disabled = true;
                refreshAdminUsersBtn.textContent = '...';
                await loadUsers();
                updateAdminUserSelect();
                loadContactsList();
                notifications.success("Users list refreshed", 'Success', 3000);
            } catch (error) {
                notifications.error("Failed to refresh users list", 'Error', 5000);
            } finally {
                refreshAdminUsersBtn.disabled = false;
                refreshAdminUsersBtn.textContent = '↻';
            }
        });
    }
    
    const refreshBannedBtn = document.getElementById('refresh-banned-btn');
    if (refreshBannedBtn) {
        refreshBannedBtn.addEventListener('click', refreshBannedUsers);
    }

    // Typing indicator
    if (messageInput) messageInput.addEventListener('input', handleTyping);
    
    // Message functionality
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (messageInput) messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize collapsed sections
    initCollapsedSections();
    applyCollapsedStates();
    
    // Setup image upload
    setupImageUpload();
    
    // Listen for auth state changes
    auth.onAuthStateChanged(user => {
        console.log("🔐 Auth state changed!");
        console.log("🔐 User object:", user);

        if (user) {
            // User is signed in.
            console.log("🔐 User is signed in. Setting up user...");
            currentUser = user;
            setupPresence(user);
            setupUser();
        } else {
            // User is signed out.
            console.log("🔐 User is signed out. Showing login screen.");
            currentUser = null;
            isInitialized = false; // Reset initialization flag
            logout(); // Use your logout function to reset the UI
        }
    });
    
    // Test if function exists
    console.log('🔧 showSettingsPanel function:', typeof showSettingsPanel);

    // Test if panel element exists
    console.log('🔧 Settings panel element:', document.getElementById('settings-panel'));
    
    // ====================================================================================================
    // SOUND EFFECTS
    // ====================================================================================================
    
    function playNotificationSound() {
        const audio = document.getElementById('notification-sound');
        if (audio) {
            // Set volume to a reasonable level (e.g., 30%)
            audio.volume = 0.3; 
            
            // Play the sound
            audio.play().catch(error => {
                console.error("Error playing notification sound:", error);
                // Autoplay might be blocked by browser, this is a common issue
            });
        }
    }
    
    // ====================================================================================================
    // DEBUGGING
    // ====================================================================================================
    
    // Test ban notification
    function testBanNotification() {
        console.log("Testing ban notification...");
        showBannedNotification("Test ban reason - this is just a test");
    }

    // Test unban notification
    function testUnbanNotification() {
        console.log("Testing unban notification...");
        hideBannedNotification();
    }
});