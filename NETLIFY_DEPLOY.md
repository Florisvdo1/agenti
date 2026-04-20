# Netlify Manual Deploy

1. Run:
   ```bash
   npm run build
   ```
2. In Netlify, choose **Sites > Add new site > Deploy manually**.
3. Drag and drop the **`netlify-drop/`** folder from this repository.
4. Netlify will serve `index.html` and route SPA paths via `_redirects`.
