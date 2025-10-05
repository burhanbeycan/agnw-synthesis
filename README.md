# Autonomous AgNW Synthesis Lab - UI Installation Guide

## System Requirements

- **Node.js:** Version 16.x or higher
- **Package Manager:** pnpm (recommended), npm, or yarn
- **Operating System:** Windows, macOS, or Linux
- **Browser:** Modern browser (Chrome, Firefox, Edge, Safari)

---

## Installation Steps

### Step 1: Extract the ZIP File

Extract `agnw-synthesis-ui.zip` to your desired location:

```bash
# On Windows (PowerShell)
Expand-Archive -Path agnw-synthesis-ui.zip -DestinationPath C:\Projects\

# On macOS/Linux
unzip agnw-synthesis-ui.zip -d ~/Projects/
```

### Step 2: Navigate to the Project Directory

```bash
cd agnw-synthesis-ui
```

### Step 3: Install Dependencies

**Option A: Using pnpm (Recommended)**
```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install project dependencies
pnpm install
```

**Option B: Using npm**
```bash
npm install
```

**Option C: Using yarn**
```bash
yarn install
```

### Step 4: Start the Development Server

```bash
# Using pnpm
pnpm run dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

### Step 5: Open in Browser

The development server will start and display a URL (typically `http://localhost:5173`).

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the **Autonomous AgNW Synthesis Lab** interface!

---

## Project Structure

```
agnw-synthesis-ui/
├── public/                 # Static assets
│   └── favicon.ico
├── src/
│   ├── assets/            # Images and media files
│   ├── components/
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main application component
│   ├── index.css          # Base CSS
│   └── main.jsx           # React entry point
├── index.html             # HTML template
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

---

## Available Features

### 1. Control Panel
- Set synthesis parameters (reagent volumes)
- Configure process parameters (temperature, stirring speed, reaction time)
- Interactive sliders and input fields

### 2. Real-Time Monitoring
- Live temperature profile chart
- Pump status indicators
- Heater control display
- Safety status monitoring

### 3. Spectroscopy
- UV-Vis absorbance spectrum visualization
- NIR transmittance data
- Automated peak analysis
- Diameter estimation

### 4. AI Optimization
- Enable/disable autonomous optimization mode
- Select optimization target (aspect ratio, diameter, yield)
- View experiment statistics
- See AI-suggested next experiments

### 5. Experiment History
- Browse past synthesis results
- View characterization data
- Compare experiment outcomes

---

## Customization

### Changing Colors and Theme

Edit `src/App.css` to modify the color scheme:

```css
:root {
  --primary: oklch(0.205 0 0);        /* Primary color */
  --secondary: oklch(0.97 0 0);       /* Secondary color */
  --accent: oklch(0.97 0 0);          /* Accent color */
  /* ... other variables ... */
}
```

### Modifying Parameters

Edit `src/App.jsx` to change default parameter values:

```javascript
const [params, setParams] = useState({
  eg_volume_ml: 100,        // Ethylene Glycol volume
  agno3_volume_ml: 5.0,     // AgNO3 volume
  pvp_volume_ml: 10.0,      // PVP volume
  nacl_volume_ml: 1.0,      // NaCl volume
  temperature_c: 160,       // Temperature
  stirring_rpm: 500,        // Stirring speed
  reaction_time_min: 60     // Reaction time
})
```

---

## Connecting to Backend (Optional)

To connect the UI to a real backend server:

### 1. Create a Backend API

The UI expects the following endpoints:

- `GET /api/status` - Get system status
- `POST /api/experiment/start` - Start an experiment
- `POST /api/experiment/stop` - Stop an experiment
- WebSocket for real-time updates

### 2. Update API Endpoints

Create a new file `src/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:5000'
export const WS_URL = 'ws://localhost:5000'
```

### 3. Add API Calls to App.jsx

```javascript
import { API_BASE_URL } from './config'

const handleStartExperiment = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiment/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    const data = await response.json()
    console.log('Experiment started:', data)
    setSystemStatus('running')
  } catch (error) {
    console.error('Error starting experiment:', error)
  }
}
```

---

## Building for Production

To create a production build:

```bash
# Using pnpm
pnpm run build

# Using npm
npm run build

# Using yarn
yarn build
```

The production files will be generated in the `dist/` directory.

### Deploying the Production Build

**Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)**

Simply upload the contents of the `dist/` directory to your hosting provider.

**Option 2: Local Web Server**

```bash
# Install a simple HTTP server
npm install -g serve

# Serve the production build
serve -s dist
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
pnpm install
```

### Issue: Port 5173 is already in use

**Solution:** Kill the process using the port or specify a different port:
```bash
pnpm run dev -- --port 3000
```

### Issue: Styles not loading correctly

**Solution:** Clear the browser cache and restart the dev server:
```bash
# Stop the server (Ctrl+C)
# Clear Vite cache
rm -rf node_modules/.vite

# Restart
pnpm run dev
```

### Issue: Components not rendering

**Solution:** Check the browser console for errors. Make sure all dependencies are installed:
```bash
pnpm install
```

---

## Development Tips

### Hot Module Replacement (HMR)

The development server supports HMR, meaning changes to your code will be reflected in the browser without a full page reload.

### React DevTools

Install the React Developer Tools browser extension for debugging:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### VS Code Extensions

Recommended extensions for Visual Studio Code:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**

---

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

---

## License

This project is open source and available for educational and research purposes.

---

## Support

For issues, questions, or contributions, please refer to the main project documentation.

---

## Quick Start Summary

```bash
# 1. Extract the ZIP file
unzip agnw-synthesis-ui.zip

# 2. Navigate to the directory
cd agnw-synthesis-ui

# 3. Install dependencies
pnpm install

# 4. Start the development server
pnpm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

**Enjoy building your autonomous laboratory! 🧪🤖**
