// List of available files - update this array with your actual files in the Parts/ folder.
// NOTE: filenames are the exact files placed inside the Parts/ directory.
const availableFiles = [
    {
        title: "Badge Loader",
        filename: "badgeloader.zip",
        description: "Animated loading badge component"
    },
    {
        title: "Language Selector",
        filename: "langselect.zip",
        description: "Dropdown language selection component"
    }
];

// Remote base domain where Parts are hosted (per your request)
const remoteBase = 'https://comopnets.snap-view.com/Parts/';

// Try to load a generated filelist.json from the repo root (automation) and fall back to `availableFiles`.
async function loadFileList() {
    try {
        const resp = await fetch('filelist.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error('no filelist');
        const list = await resp.json();
        return list;
    } catch (e) {
        return availableFiles; // fallback
    }
}

// Create file list
async function createFileList() {
    const fileList = document.getElementById('fileList');
    const files = await loadFileList();

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const localPath = `Parts/${file.filename}`; // local relative path in the repo
        const remoteUrl = `${remoteBase}${encodeURIComponent(file.filename)}`;

        fileItem.innerHTML = `
            <div class="file-info">
                <h3>${file.title}</h3>
                <p>${file.description || ''}</p>
                <p class="muted">File: <code>${file.filename}</code></p>
            </div>
            <div class="actions">
                <a href="${localPath}" class="download-btn" download aria-label="Download ${file.filename} locally">📥 Local</a>
                <a href="${remoteUrl}" class="download-btn remote" target="_blank" rel="noopener" aria-label="Download ${file.filename} from remote server">🌐 Remote</a>
                <span class="status" aria-hidden="true">Checking...</span>
            </div>
        `;

        fileList.appendChild(fileItem);

        // Run a HEAD request to check remote availability and update status
        checkRemoteStatus(remoteUrl, fileItem.querySelector('.status'));
    });

    // wire copy buttons for the global command examples
    document.querySelectorAll('.copy-cmd').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-command');
            if (!cmd) return;
            navigator.clipboard.writeText(cmd).then(() => {
                const old = btn.textContent;
                btn.textContent = 'Copied ✓';
                setTimeout(() => btn.textContent = old, 1500);
            }).catch(() => {
                btn.textContent = 'Copy failed';
                setTimeout(() => btn.textContent = 'Copy', 1500);
            });
        });
    });
}

// Perform a HEAD request (with fallback to GET if HEAD not allowed) to determine remote file status.
async function checkRemoteStatus(url, statusEl) {
    try {
        const resp = await fetch(url, { method: 'HEAD', mode: 'cors' });
        if (resp.ok) {
            statusEl.textContent = 'Online (200)';
            statusEl.style.color = '#16a34a';
        } else if (resp.status === 404) {
            statusEl.textContent = 'Not found (404)';
            statusEl.style.color = '#dc2626';
        } else {
            statusEl.textContent = `Status: ${resp.status}`;
            statusEl.style.color = '#d97706';
        }
    } catch (e) {
        // Some servers don't allow HEAD or CORS; try a GET with range header
        try {
            const resp2 = await fetch(url, { method: 'GET', mode: 'cors' });
            if (resp2.ok) {
                statusEl.textContent = 'Online (200)';
                statusEl.style.color = '#16a34a';
            } else if (resp2.status === 404) {
                statusEl.textContent = 'Not found (404)';
                statusEl.style.color = '#dc2626';
            } else {
                statusEl.textContent = `Status: ${resp2.status}`;
                statusEl.style.color = '#d97706';
            }
        } catch (e2) {
            statusEl.textContent = 'Unavailable';
            statusEl.style.color = '#6b7280';
        }
    }
}

        // Initialize
        document.addEventListener('DOMContentLoaded', createFileList);