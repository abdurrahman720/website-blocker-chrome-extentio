# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# Website Blocker Chrome Extension

A simple Chrome extension that allows you to block distracting websites to help you stay focused and productive.

## Features

- Block any website by adding its domain to the blocklist
- Simple and intuitive user interface
- Automatically redirects when you try to access a blocked site
- Stores your blocklist in Chrome sync storage (syncs across devices)

## Installation

### Development Mode

1. Clone this repository:

   ```
   git clone <repository-url>
   cd website-blocker
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the extension:

   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` folder from this project

### Using the Extension

1. Click on the Website Blocker icon in your Chrome toolbar
2. Enter a website URL or domain you want to block (e.g., facebook.com)
3. Click "Block Website" to add it to your blocklist
4. Try visiting the blocked site - you'll be redirected to a block page

### Unblocking Websites

1. Click on the Website Blocker icon in your Chrome toolbar
2. Find the website in your blocklist
3. Click "Unblock" to remove it from the list

## Development

### Running locally

```
npm run dev
```

Note: When running locally, the Chrome API won't be available, so the extension will use localStorage instead of Chrome's storage API.

### Building for production

```
npm run build
```

## Technology Stack

- React
- TypeScript
- Vite
- Chrome Extension APIs

## License

MIT
