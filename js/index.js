document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();

    const user = Utils.getCurrentUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.photo) {
        window.location.href = 'vote.html';
    } else {
        window.location.href = 'profile.html';
    }
});
