# Fruits Vault

## Dev

- Install: `npm run install:all`
- Run both servers: `npm run dev`

The frontend runs on `http://localhost:3000` and proxies `/api/*` to the backend on `http://localhost:5000`.

## Production / Public website (recommended setup)

The most reliable setup (works the same on Windows/Mac/Linux) is **single origin**:

- Build the React app
- Serve that build from the Express backend
- Keep the API under the same host as `/api/*`

This avoids situations where the browser calls `http://<frontend>/api/...` and gets `403` from the wrong server.

Commands:

- Build frontend: `npm run build`
- Start backend (serves API + frontend build): `npm run backend:start`

Then open the backend URL in the browser (example: `http://localhost:5000`).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
