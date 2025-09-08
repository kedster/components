Component Downloads

This folder contains small front-end components packaged as ZIPs in the `Parts/` directory. The site `index.html` lists available downloads and provides quick "how to" sections.

Quick features

- Local and remote download buttons for each file.
- Expandable usage instructions: VS Code, with AI, manual usage.
- Remote download commands (PowerShell, curl, wget) with copy buttons.
- Runtime remote HEAD checks to show whether a file is available at the remote domain.

Remote hosting

Files are expected to be available at:

https://comopnets.snap-view.com/Parts/<filename.zip>

Replace `<filename.zip>` with the exact filename shown for each item.

PowerShell example

Invoke-WebRequest -Uri "https://comopnets.snap-view.com/Parts/<filename.zip>" -OutFile "<filename.zip>"

curl example

curl -L -o <filename.zip> "https://comopnets.snap-view.com/Parts/<filename.zip>"

wget example

wget -O <filename.zip> "https://comopnets.snap-view.com/Parts/<filename.zip>"

Automation

A small Node script `scripts/generate-filelist.js` can scan the `Parts/` directory and generate `filelist.json`. Use `npm run gen` to run it.

License: MIT
