// ===== AUTH MODULE =====
const Auth = {
    register(name, email, password) {
        const students = StorageManager.get('students') || [];

        // email déjà utilisé
        if (students.some(s => s.email === email)) {
            Utils.showAlert('Cet email est déjà utilisé.', 'error', 'alert-login');
            return false;
        }

        const newUser = {
            id: `u_${Date.now()}`,
            name,
            email,
            password,
            photo: null,
            votes: { likes: 0, dislikes: 0 }
        };

        students.push(newUser);
        StorageManager.set('students', students);
        Utils.setCurrentUser(newUser);
        Utils.showAlert('Inscription réussie !', 'success', 'alert-login');
        return true;
    },

    login(email, password) {
        const students = StorageManager.get('students') || [];
        const user = students.find(s => s.email === email && s.password === password);

        if (!user) {
            Utils.showAlert('Email ou mot de passe incorrect.', 'error', 'alert-login');
            return false;
        }

        // on garde la photo et tout le reste
        Utils.setCurrentUser(user);
        Utils.showAlert('Connexion réussie !', 'success', 'alert-login');
        return true;
    }
};

// ===== INITIALISATION PAGE LOGIN =====
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();

    const toggleLoginBtn = document.getElementById('toggle-login-btn');
    const toggleRegisterBtn = document.getElementById('toggle-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');

    let isLoginMode = false; // inscription affichée par défaut

    function setMode(showLogin) {
        isLoginMode = showLogin;

        loginForm.classList.toggle('hidden', !showLogin);
        registerForm.classList.toggle('hidden', showLogin);

        toggleLoginBtn.classList.toggle('btn-primary', showLogin);
        toggleLoginBtn.classList.toggle('btn-outline', !showLogin);
        toggleRegisterBtn.classList.toggle('btn-primary', !showLogin);
        toggleRegisterBtn.classList.toggle('btn-outline', showLogin);

        if (showLogin) {
            toggleText.textContent = 'Pas encore inscrit ?';
            toggleLink.textContent = 'S\'inscrire';
        } else {
            toggleText.textContent = 'Déjà inscrit ?';
            toggleLink.textContent = 'Connecte-toi';
        }
    }

    toggleLoginBtn.addEventListener('click', () => setMode(true));
    toggleRegisterBtn.addEventListener('click', () => setMode(false));
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        setMode(!isLoginMode);
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (Auth.login(email, password)) {
            setTimeout(() => {
                const current = Utils.getCurrentUser();
                if (current && current.photo) {
                    window.location.href = 'vote.html';
                } else {
                    window.location.href = 'profile.html';
                }
            }, 800);
        }
    });

    // Register
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (Auth.register(name, email, password)) {
            setTimeout(() => window.location.href = 'profile.html', 800);
        }
    });

    // état initial : inscription
    setMode(false);
});
