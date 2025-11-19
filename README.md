THIS IS AN CHATGPT PAGE!

# Dual-Domain Contextual Search (Vanilla JS)

A simple website that lets users enter two domains and search content within them.
Includes mock mode and GitHub Pages compatibility.

## 📁 Project Structure
- index.html  
- script.js  
- README.md  

## 🚀 Hosting on GitHub Pages
1. Create a GitHub repository.
2. Upload all files from this folder.
3. Go to Settings → Pages.
4. Select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **root**
5. Save.

Your site will be live at:
```
https://YOUR-USERNAME.github.io/REPO-NAME
```

## ⚙️ Mock Mode
Enabled by default. Without a backend, it generates fake results.

## 🔧 Add a real backend
Create `/api/search` returning:
```
{
  "results": [
    { "title": "...", "url": "...", "snippet": "...", "image": "...", "domain": "..." }
  ]
}
```
