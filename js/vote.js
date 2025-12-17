// ===== VOTE MODULE =====
const VoteManager = {
    currentStudents: [],

    init() {
        StorageManager.init();
        const user = Utils.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Charger tous les étudiants sauf l'utilisateur courant
        let students = StorageManager.get('students') || [];
        students = students.filter(s => s.id !== user.id);
        this.currentStudents = Utils.shuffleArray(students);

        this.renderCard();
        this.setupButtons();
    },

    // Étudiants pour lesquels l'utilisateur n'a pas encore voté
    getRemaining() {
        const user = Utils.getCurrentUser();
        const voted = StorageManager.getUserVotes(user.id);
        return this.currentStudents.filter(s => !voted.includes(s.id));
    },

    // Affiche la carte actuelle ou l'écran de fin
    renderCard() {
        const container = document.getElementById('swipe-container');
        const remaining = this.getRemaining();

        if (!remaining.length) {
            document.getElementById('empty-state').style.display = 'block';
            container.innerHTML = '';
            document.getElementById('progress-bar').style.width = '100%';
            return;
        }

        const student = remaining[0];

        container.innerHTML = `
            <div class="card" id="current-card">
                <img src="${student.photo}" alt="${student.name}">
                <div class="card-info">
                    <div class="card-name">${student.name}</div>
                    <div class="card-votes">
                        ❤️ ${student.votes.likes} &nbsp;|&nbsp; ❌ ${student.votes.dislikes}
                    </div>
                </div>
            </div>
        `;

        this.makeDraggable(document.getElementById('current-card'), student);

        const user = Utils.getCurrentUser();
        const voted = StorageManager.getUserVotes(user.id);
        const progress = (voted.length / this.currentStudents.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    },

    // Logique de swipe (souris + tactile)
    makeDraggable(card, student) {
        let startX = 0;
        let offsetX = 0;
        let dragging = false;
        const threshold = 100;
        const indicator = document.getElementById('vote-indicator');

        const start = x => {
            dragging = true;
            startX = x;
            card.classList.add('dragging');
        };

        const move = x => {
            if (!dragging) return;
            offsetX = x - startX;
            card.style.transform = `translateX(${offsetX}px) rotate(${offsetX * 0.08}deg)`;
            card.style.opacity = 1 - Math.min(Math.abs(offsetX) / 350, 0.6);
        };

        const end = () => {
            if (!dragging) return;
            dragging = false;
            card.classList.remove('dragging');

            if (offsetX > threshold) {
                // Like (droite)
                this.vote(student.id, 'like');
                indicator.textContent = '❤️';
                indicator.className = 'vote-indicator show like';
            } else if (offsetX < -threshold) {
                // Dislike (gauche)
                this.vote(student.id, 'dislike');
                indicator.textContent = '❌';
                indicator.className = 'vote-indicator show dislike';
            } else {
                // Retour position initiale
                card.style.transform = '';
                card.style.opacity = 1;
                offsetX = 0;
                return;
            }

            setTimeout(() => {
                indicator.className = 'vote-indicator';
                this.renderCard();
            }, 350);
        };

        // Souris
        card.addEventListener('mousedown', e => start(e.clientX));
        document.addEventListener('mousemove', e => move(e.clientX));
        document.addEventListener('mouseup', end);

        // Tactile
        card.addEventListener('touchstart', e => start(e.touches[0].clientX));
        document.addEventListener('touchmove', e => move(e.touches[0].clientX));
        document.addEventListener('touchend', end);
    },

    // Enregistre un vote dans le stockage
    vote(studentId, type) {
        const user = Utils.getCurrentUser();
        StorageManager.addVote(user.id, studentId, type);
    },

    // Boutons bas de page + navigation
    setupButtons() {
        const leftBtn = document.getElementById('swipe-left-btn');
        const rightBtn = document.getElementById('swipe-right-btn');

        leftBtn.addEventListener('click', () => {
            const [next] = this.getRemaining();
            if (!next) return;
            this.vote(next.id, 'dislike');
            this.renderCard();
        });

        rightBtn.addEventListener('click', () => {
            const [next] = this.getRemaining();
            if (!next) return;
            this.vote(next.id, 'like');
            this.renderCard();
        });

        document.getElementById('back-vote-btn').addEventListener('click', () => {
            window.location.href = 'profile.html';
        });

        document.getElementById('logout-vote-btn').addEventListener('click', () => {
            Utils.logout();
            window.location.href = 'login.html';
        });
    }
};

// Lancer le module au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    VoteManager.init();
});
