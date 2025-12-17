// ===== UTILS =====
const Utils = {
    showAlert(message, type = 'error', elementId = 'alert-login') {
        const alert = document.getElementById(elementId);
        if (!alert) return;

        alert.className = `alert show alert-${type}`;
        alert.textContent = message;

        setTimeout(() => {
            alert.classList.remove('show');
        }, 4000);
    },

    getCurrentUser() {
        return StorageManager.get('currentUser');
    },

    setCurrentUser(user) {
        StorageManager.set('currentUser', user);
    },

    logout() {
        StorageManager.set('currentUser', null);
    },

    shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }
};
