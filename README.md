webcomponents.snap-view.com — Component downloads

This repository contains small, reusable front-end components packaged as ZIP files in the `Parts/` directory. The site `index.html` lists available packages and provides guidance for local use and remote download.

What you'll find
- ZIP packages for components (in `Parts/`)
- A simple browser UI (`index.html`) showing local and remote download links
- A Node helper to generate `filelist.json` from the `Parts/` directory

Quick start (local)
1. Open the project folder in your editor (for example, VS Code).
2. Open `index.html` in a browser or run a simple local server from the project root:

```powershell
python -m http.server 8000
# then open http://localhost:8000/
```

Remote downloads
The files are expected to be hosted at the public base:

https://webcomponents.snap-view.com/Parts/<filename.zip>

Replace `<filename.zip>` with the filename listed on the page. Examples:

PowerShell (Windows PowerShell 5.1)

```powershell
Invoke-WebRequest -Uri "https://webcomponents.snap-view.com/Parts/<filename.zip>" -OutFile "<filename.zip>"
# Example
Invoke-WebRequest -Uri "https://webcomponents.snap-view.com/Parts/badgeloader.zip" -OutFile "badgeloader.zip"
```

curl (Linux / macOS / Windows with curl)

```bash
curl -L -o <filename.zip> "https://webcomponents.snap-view.com/Parts/<filename.zip>"
# Example
curl -L -o badgeloader.zip "https://webcomponents.snap-view.com/Parts/badgeloader.zip"
```

wget (POSIX shell)

```bash
wget -O <filename.zip> "https://webcomponents.snap-view.com/Parts/<filename.zip>"
# Example
wget -O badgeloader.zip "https://webcomponents.snap-view.com/Parts/badgeloader.zip"
```

Automation: regenerate `filelist.json`
Use the Node script to scan `Parts/` and write `filelist.json` (used by `index.html` at runtime):

```powershell
node ./scripts/generate-filelist.js
# or: npm run gen
```

Notes
- Ensure filenames and casing in `Parts/` match what you reference remotely.
- The site will try to load `filelist.json` at runtime; if it's not present it falls back to a built-in list.

Contributing
- Add new component ZIPs to the `Parts/` directory. Run the generator to update `filelist.json`.
- If you add a component, include a short README inside the ZIP explaining usage and license.

License
This project is provided under the MIT License.
