// script.js
const STORAGE_KEY = 'crud_entries_v1';

const form = document.getElementById('user-form');
const entriesList = document.getElementById('entries-list');
const emptyState = document.getElementById('empty-state');
const imgInput = document.getElementById('image');
const imgPreview = document.getElementById('img-preview');
const clearImageBtn = document.getElementById('clear-image');
const formTitle = document.getElementById('form-title');
const entryIdInput = document.getElementById('entry-id');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const clearAllBtn = document.getElementById('clear-all');

let entries = loadEntries();
renderEntries();

// ---------- Helpers ----------
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadEntries() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to load entries', e);
        return [];
    }
}

function resetFormUI() {
    form.reset();
    entryIdInput.value = '';
    imgPreview.src = '';
    imgPreview.style.display = 'none';
    formTitle.textContent = 'Add New Entry';
    saveBtn.textContent = 'Save';
}

// ---------- Image handling ----------
imgPreview.style.display = 'none';
imgInput.addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const allowed = f.type.startsWith('image/');
    if (!allowed) { alert('Please choose an image file'); imgInput.value = ''; return; }
    const data = await fileToBase64(f);
    imgPreview.src = data;
    imgPreview.style.display = 'block';
});

clearImageBtn.addEventListener('click', () => {
    imgInput.value = '';
    imgPreview.src = '';
    imgPreview.style.display = 'none';
});

function fileToBase64(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = (err) => rej(err);
        reader.readAsDataURL(file);
    });
}

// ---------- Render ----------
function renderEntries() {
    entriesList.innerHTML = '';
    if (!entries.length) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    // newest first
    entries.slice().reverse().forEach(en => {
        const node = document.createElement('div');
        node.className = 'entry';

        const img = document.createElement('img');
        img.className = 'thumb';
        img.src = en.image || placeholderForName(en.name);
        img.alt = en.name;

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.innerHTML = `<h3>${escapeHtml(en.name)} <small style="color:#6b7280;font-weight:600">(${en.age})</small></h3>
                      <p>${escapeHtml(en.gender)} • ${escapeHtml(en.city)}</p>
                      <p style="color:#475569;font-size:13px">${escapeHtml(en.notes || '')}</p>
                      <small style="color:var(--muted);">ID: ${en.id}</small>`;

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'small-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => startEdit(en.id));

        const delBtn = document.createElement('button');
        delBtn.className = 'small-btn';
        delBtn.style.background = '#fee2e2';
        delBtn.style.borderRadius = '8px';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => removeEntry(en.id));

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        node.appendChild(img);
        node.appendChild(meta);
        node.appendChild(actions);

        entriesList.appendChild(node);
    });
}

function placeholderForName(name) {
    // simple colored placeholder as data URI (white background) — but for simplicity return a blank image data URL
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='#f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#64748b' font-size='18'>${escapeHtml(name || 'No Image')}</text></svg>`);
}

function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m] });
}

// ---------- Actions ----------
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = entryIdInput.value || uid();
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const gender = document.getElementById('gender').value;
    const city = document.getElementById('city').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!name || !age || !gender || !city) {
        alert('Please fill required fields: Name, Age, Gender, City.');
        return;
    }

    // if a new image file selected -> convert to base64
    let imageData = imgPreview.src || '';
    if (imgInput.files && imgInput.files[0]) {
        try {
            imageData = await fileToBase64(imgInput.files[0]);
        } catch (err) {
            console.warn('Image conversion failed', err);
        }
    }

    const entry = { id, name, age, gender, city, notes, image: imageData, updatedAt: Date.now() };

    const existingIndex = entries.findIndex(x => x.id === id);
    if (existingIndex >= 0) {
        entries[existingIndex] = { ...entries[existingIndex], ...entry };
    } else {
        entries.push(entry);
    }

    saveEntries();
    renderEntries();
    resetFormUI();
});

function startEdit(id) {
    const en = entries.find(x => x.id === id);
    if (!en) return;
    document.getElementById('name').value = en.name;
    document.getElementById('age').value = en.age;
    document.getElementById('gender').value = en.gender;
    document.getElementById('city').value = en.city;
    document.getElementById('notes').value = en.notes || '';
    entryIdInput.value = en.id;
    formTitle.textContent = 'Edit Entry';
    saveBtn.textContent = 'Update';

    if (en.image) {
        imgPreview.src = en.image;
        imgPreview.style.display = 'block';
        imgInput.value = '';
    } else {
        imgPreview.src = '';
        imgPreview.style.display = 'none';
    }

    // scroll to top of form (user-friendly)
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeEntry(id) {
    if (!confirm('Delete this entry?')) return;
    entries = entries.filter(x => x.id !== id);
    saveEntries();
    renderEntries();
}

clearAllBtn.addEventListener('click', () => {
    if (!entries.length) { alert('No entries to clear.'); return; }
    if (!confirm('Clear ALL entries? This cannot be undone.')) return;
    entries = [];
    saveEntries();
    renderEntries();
});

// Reset resets UI but doesn't remove entries
resetBtn.addEventListener('click', (ev) => {
    setTimeout(resetFormUI, 50);
});

// initial reset for correctness
resetFormUI();