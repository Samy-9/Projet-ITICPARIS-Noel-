// ===== STORAGE MODULE =====
const StorageManager = {
    init() {
        // Créer les étudiants de démo une seule fois
        if (!this.get('students')) {
            const demoStudents = [
                {
                    id: 's_001',
                    name: 'Mini Pekka',
                    email: 'Minipekka@ypareo.fr',
                    password: 'pass123',
                    photo: 'https://confortparadis.com/wp-content/uploads/2024/09/Pull-moche-de-Noel-Decorations-1.png',
                    votes: { likes: 0, dislikes: 0 }
                },
                {
                    id: 's_002',
                    name: 'Poseur 2 Fitna',
                    email: 'DZ@ypareo.fr',
                    password: 'pass123',
                    photo: 'https://m.media-amazon.com/images/I/71pcd4bjsRL._AC_UY1000_.jpg',
                    votes: { likes: 0, dislikes: 0 }
                },
                {
                    id: 's_003',
                    name: 'JJB',
                    email: 'JJB@ypareo.fr',
                    password: 'pass123',
                    photo: 'https://m.media-amazon.com/images/I/71qlr4i4SgL._AC_UY1000_.jpg',
                    votes: { likes: 0, dislikes: 0 }
                },
                {
                    id: 's_004',
                    name: 'Le Bracq',
                    email: 'Braquage@ypareo.fr',
                    password: 'pass123',
                    photo: 'https://pyjama-calin.fr/cdn/shop/files/pull-moche-de-noel-pas-cher_1.jpg?v=1708858764',
                    votes: { likes: 0, dislikes: 0 }
                },
                {
                    id: 's_005',
                    name: 'Mamba Mentality',
                    email: 'KOBE@ypareo.fr',
                    password: 'pass123',
                    photo: 'https://cadeauplus.com/cdn/shop/files/5712WFR1-pull-moche-personnalise-avec-photo-mon-pull-moche-de-noel-5712w6vza.jpg',
                    votes: { likes: 0, dislikes: 0 }
                }
            ];

            this.set('students', demoStudents);
        }

        // Structure vide pour les votes
        if (!this.get('votes')) {
            this.set('votes', {});
        }
    },

    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    addVote(voterId, targetId, type) {
        // Mettre à jour la matrice de votes
        const votes = this.get('votes') || {};
        if (!votes[voterId]) votes[voterId] = {};
        votes[voterId][targetId] = type;
        this.set('votes', votes);

        // Mettre à jour les compteurs du student
        const students = this.get('students') || [];
        const student = students.find(s => s.id === targetId);
        if (student) {
            if (type === 'like') student.votes.likes++;
            else if (type === 'dislike') student.votes.dislikes++;
            this.set('students', students);
        }
    },

    getUserVotes(userId) {
        const votes = this.get('votes') || {};
        return votes[userId] ? Object.keys(votes[userId]) : [];
    }
};
