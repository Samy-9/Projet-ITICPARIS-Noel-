document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();

    const user = Utils.getCurrentUser();

    if (!user) {
        // Jamais connecté → login
        window.location.href = 'login.html';
        return;
    }

    // Si l'utilisateur a déjà une photo, on l'envoie sur le vote,
    // sinon il doit d'abord déposer son pull.
    if (user.photo) {
        window.location.href = 'vote.html';
    } else {
        window.location.href = 'profile.html';
    }
});
