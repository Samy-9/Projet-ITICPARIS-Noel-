document.addEventListener('DOMContentLoaded', () => {
    const user = Utils.getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const preview = document.getElementById('preview');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');

    usernameEl.textContent = user.name;
    emailEl.textContent = user.email;

    if (user.photo) {
        preview.innerHTML = `<img src="${user.photo}" alt="Preview">`;
    }

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const [file] = e.dataTransfer.files;
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const [file] = e.target.files;
        if (file) handleFile(file);
    });

    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            Utils.showAlert('Le fichier dépasse 5 Mo.', 'error', 'alert-profile');
            return;
        }
        if (!file.type.startsWith('image/')) {
            Utils.showAlert('Veuillez sélectionner une image.', 'error', 'alert-profile');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = canvas.height = 300;

                const ctx = canvas.getContext('2d');
                const x = (img.width - size) / 2;
                const y = (img.height - size) / 2;
                ctx.drawImage(img, x, y, size, size, 0, 0, 300, 300);

                const processedImage = canvas.toDataURL('image/jpeg', 0.8);
                preview.innerHTML = `<img src="${processedImage}" alt="Preview">`;

                const current = Utils.getCurrentUser();
                current.photo = processedImage;
                Utils.setCurrentUser(current);

                let students = StorageManager.get('students') || [];
                const index = students.findIndex(s => s.email === current.email);

                if (index !== -1) {
                    students[index].photo = processedImage;
                } else {
                    students.push({
                        id: current.id,
                        name: current.name,
                        email: current.email,
                        password: current.password,
                        photo: processedImage,
                        votes: { likes: 0, dislikes: 0 }
                    });
                }
                StorageManager.set('students', students);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('clear-image-btn').addEventListener('click', () => {
        const current = Utils.getCurrentUser();
        current.photo = null;
        Utils.setCurrentUser(current);

        preview.innerHTML = `
            <div class="image-preview-empty">
                <div class="image-preview-icon">📷</div>
                <p>Pas encore d'image</p>
            </div>`;
    });

    document.getElementById('next-vote-btn').addEventListener('click', () => {
        const current = Utils.getCurrentUser();
        if (!current.photo) {
            Utils.showAlert('Veuillez ajouter une photo.', 'error', 'alert-profile');
            return;
        }
        window.location.href = 'vote.html';
    });

    document.getElementById('logout-profile-btn').addEventListener('click', () => {
        Utils.logout();
        window.location.href = 'login.html';
    });
});
