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
const remoteBase = 'https://webcomponents.snap-view.com/Parts/';

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

        // ---------- Interactive particle background (stars/lines reactive to mouse) ----------
        (() => {
            const canvas = document.getElementById('interactiveCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let w = 0, h = 0;
            let particles = [];
            const config = {
                count: 60,
                maxVel: 0.6,
                connectDist: 140,
                mouseRadius: 140
            };
            let mouse = { x: -9999, y: -9999 };

            function resize(){
                w = canvas.width = canvas.clientWidth = canvas.parentElement.clientWidth;
                h = canvas.height = canvas.clientHeight = 220; // small decorative band
            }

            function rand(min,max){ return Math.random()*(max-min)+min }

            function init(){
                resize();
                particles = [];
                for(let i=0;i<config.count;i++){
                    particles.push({
                        x: rand(0,w), y: rand(0,h), vx: rand(-config.maxVel,config.maxVel), vy: rand(-config.maxVel,config.maxVel), r: rand(0.8,2.2)
                    });
                }
                attach();
                requestAnimationFrame(loop);
            }

            function attach(){
                window.addEventListener('resize', resize);
                canvas.addEventListener('mousemove', e=>{
                    const rect = canvas.getBoundingClientRect();
                    mouse.x = e.clientX - rect.left;
                    mouse.y = e.clientY - rect.top;
                });
                canvas.addEventListener('mouseleave', ()=>{ mouse.x = -9999; mouse.y = -9999 });
            }

            function loop(){
                ctx.clearRect(0,0,w,h);
                // fade background lightly
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0,0,w,h);

                // update
                for(let p of particles){
                    // simple attraction to mouse
                    const dx = mouse.x - p.x; const dy = mouse.y - p.y;
                    const d = Math.sqrt(dx*dx+dy*dy);
                    if(d < config.mouseRadius){
                        const force = (1 - d/config.mouseRadius) * 0.6;
                        p.vx += (dx/d) * force * 0.15;
                        p.vy += (dy/d) * force * 0.15;
                    }

                    p.x += p.vx; p.y += p.vy;
                    p.vx *= 0.98; p.vy *= 0.98;

                    // bounds
                    if(p.x < -10) p.x = w+10;
                    if(p.x > w+10) p.x = -10;
                    if(p.y < -10) p.y = h+10;
                    if(p.y > h+10) p.y = -10;
                }

                // draw lines
                for(let i=0;i<particles.length;i++){
                    const a = particles[i];
                    for(let j=i+1;j<particles.length;j++){
                        const b = particles[j];
                        const dx = a.x - b.x; const dy = a.y - b.y; const dist = Math.sqrt(dx*dx+dy*dy);
                        if(dist < config.connectDist){
                            const alpha = 1 - (dist / config.connectDist);
                            ctx.strokeStyle = `rgba(255,0,153,${alpha*0.14})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
                        }
                    }
                }

                // draw particles
                for(let p of particles){
                    const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
                    grd.addColorStop(0, 'rgba(255,0,153,0.9)');
                    grd.addColorStop(0.6, 'rgba(255,0,153,0.25)');
                    grd.addColorStop(1, 'rgba(255,0,153,0)');
                    ctx.fillStyle = grd;
                    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
                }

                requestAnimationFrame(loop);
            }

            // init when DOM ready
            if(document.readyState === 'complete' || document.readyState === 'interactive') init(); else window.addEventListener('DOMContentLoaded', init);
        })();