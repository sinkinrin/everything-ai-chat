# Everything AI Chat - Intelligent File Search Client

English | [**中文**](./README.md)

A modern Everything search client that perfectly combines AI intelligence with ultra-fast local search. Supports natural language queries, automatically converts to Everything precise search syntax, making file searching simpler and more efficient than ever before.

## 🌟 Star History
**Development is not easy, please give us a little star✨**

[![Star History Chart](https://api.star-history.com/svg?repos=MaskerPRC/everything-ai-chat&type=Date)](https://star-history.com/#MaskerPRC/everything-ai-chat&Date)


## 👣Examples
<img width="1500" height="1000" alt="image" src="https://github.com/user-attachments/assets/731dcaf7-9b13-4d71-900d-de8572ea9b12" />

<img width="1799" height="1200" alt="image" src="https://github.com/user-attachments/assets/f54f4ddd-0e6d-443c-ac35-73c1dc064d80" />

<img width="1799" height="1200" alt="image" src="https://github.com/user-attachments/assets/79d34f0d-ad0a-46a4-9456-4049209e8252" />

## 👀Welcome to join WeChat group
https://100.agitao.net/

![100 AI Products Exchange Group](https://proxy.agitao.me/img)


## ✨ Core Features

### 🔧 Intelligent Automated Connection (Technical Highlight)
- **One-click Everything Connection**: Automatically searches for Everything installation location, no manual configuration required
- **Multi-strategy Search Algorithm**: Locates installation location through multiple strategies including registry, common paths, desktop shortcuts, etc.
- **Intelligent Process Management**: Uses three-level process management strategy: graceful shutdown → force termination → advanced termination
- **Automatic Port Discovery**: Intelligently finds available ports to avoid port conflicts
- **Configuration File Automation**: Automatically modifies Everything configuration, supports configuration backup and recovery
- **Secure Credential Generation**: Automatically generates random username and password to ensure connection security

### 🧠 AI Intelligent Search
- **Natural Language Understanding**: Input natural language like "today's PDF files", "videos larger than 10MB", AI automatically converts to precise search syntax
- **OpenAI Integration**: Supports GPT-3.5/GPT-4 models, intelligently understands complex search intentions
- **Local Optimization**: Even without AI configuration, search queries can be optimized through local rules

### ⚡ Ultra-fast Search Experience
- **Everything Engine**: Based on the world's fastest file search engine Everything
- **Real-time Results**: Millisecond-level search response, supports large capacity hard drives
- **Smart Suggestions**: Provides search suggestions and quick access to search history

### 🎯 Precise Result Display
- **Multi-dimensional Sorting**: Sort by file name, path, size, modification time, creation time, and other dimensions
- **File Type Recognition**: Automatically recognizes file types and displays corresponding icons (documents📄, images🖼️, videos🎬, etc.)
- **Detailed Information**: Displays complete information including file size, modification time, creation time, access time, attributes, etc.

### 🎨 Modern Interface
- **Custom Title Bar**: Borderless design with integrated window control buttons
- **Real-time Status Display**: Real-time monitoring of Everything connection status
- **Search History**: Automatically saves and intelligently manages search history (up to 50 entries)
- **Responsive Layout**: Adapts to window size, supports minimum size of 800x600

## Tech Stack

- **Frontend**: Vue 3 + Vite
- **Backend**: Electron + Node.js
- **Database**: SQLite (search history storage)
- **AI Service**: OpenAI GPT API
- **Search Engine**: Everything HTTP API

## System Requirements

- Windows 7/8/10/11
- Everything software (1.4.1+)
- Node.js 16+

## Installation Steps

### 1. Install Everything

1. Download and install [Everything](https://www.voidtools.com/)
2. Launch Everything software
3. Go to `Tools` → `Options` → `General`
4. Check `Enable HTTP Server`
5. Confirm port is 80 (default)

### 2. Clone Project

```bash
git clone https://github.com/your-repo/everything-ai-chat.git
cd everything-ai-chat
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure OpenAI

If you want to use AI natural language conversion function, you need to configure OpenAI API:

1. After launching the app, click the settings button in the bottom right corner
2. Enter your OpenAI API Key
3. Select an appropriate model (GPT-3.5 Turbo recommended)

## Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Start development environment
npm run dev
```

### Production Build

```bash
npm run build
npm run build:electron
```

## 🚀 User Guide

### Quick Start
1. After launching the app, it will automatically detect Everything connection status
2. Enter query content in the search box
3. Supports three search methods:

### 💬 Natural Language Search (Recommended)
After configuring OpenAI API, you can use natural language search:
```
PDF files modified today
Videos larger than 10MB
Images created this week
Word documents on desktop
Compressed files downloaded yesterday
Excel files containing "report"
```

### 🔧 Everything Syntax Search
Directly use Everything's powerful search syntax:
```
*.pdf dm:today                    # PDFs modified today
size:>10mb *.mp4;*.avi           # Video files larger than 10MB
dc:thisweek *.jpg;*.png          # Images created this week
path:desktop *.docx              # Word documents on desktop
*.zip;*.rar dm:yesterday         # Compressed files modified yesterday
*report* *.xlsx                  # Excel files containing "report"
```

### 🔍 Simple Keyword Search
Directly enter file name or keywords:
```
report.docx                      # Find Word documents containing "report"
*.pdf                           # Find all PDF files
photoshop                       # Find files containing "photoshop"
```

### 🎯 Advanced Search Features

#### File Size Filtering
- `size:>100mb` - Files larger than 100MB
- `size:<1kb` - Files smaller than 1KB
- `size:1mb..100mb` - Files between 1MB and 100MB

#### Time Filtering
- `dm:today` - Files modified today
- `dc:yesterday` - Files created yesterday
- `da:thisweek` - Files accessed this week

#### Path Filtering
- `path:desktop` - Files in desktop path
- `!path:temp` - Exclude files in temp folder

#### File Type Combinations
- `*.jpg;*.png;*.gif` - Common image formats
- `*.mp4;*.avi;*.mkv` - Common video formats
- `*.doc;*.docx;*.pdf` - Common document formats

## ⌨️ Shortcuts and Operations

### Search Operations
- `Enter` - Execute search
- `↑/↓` - Browse search history
- `Esc` - Clear search box
- Click search suggestions - Quickly use preset searches

### File Operations
- `Double-click file` - Open file with default program
- `Right-click file` - Show file context menu
- Click file path - Show file in File Explorer

### Interface Operations
- Click column header - Sort by that column (click again to toggle ascending/descending)
- `⚙️` Settings button - Configure OpenAI API and display options
- Title bar `−` `□` `×` - Minimize, maximize, close window

### Result Management
- `📤 Export Results` - Export search results to file
- `🗑️ Clear Results` - Clear current search results
- Search history dropdown - Quickly repeat previous searches

## Search Syntax Examples

| Natural Language | Everything Syntax | Description |
|---------|----------------|------|
| Today's PDFs | `*.pdf dm:today` | PDF files modified today |
| Videos larger than 10MB | `*.mp4;*.avi size:>10mb` | Video files larger than 10MB |
| Images on desktop | `*.jpg;*.png path:desktop` | Images in desktop directory |
| This week's documents | `*.doc;*.docx dm:thisweek` | Documents modified this week |

## 🔧 Troubleshooting

### Application Launch Issues

#### Application Fails to Start
**Symptoms**: Application cannot start after running `npm run dev`
**Solution Steps**:
1. Ensure port 5173 is not occupied
2. Terminate possible existing processes: `taskkill /f /im node.exe`
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

#### Electron Window Blank
**Symptoms**: Application starts but shows blank window
**Solutions**:
1. Wait for Vue development server to fully start (usually takes 10-30 seconds)
2. Check console for error messages
3. Try refreshing window or restarting application

### Everything Connection Issues

#### Status Shows "Disconnected"
**Solution Steps**:
1. **Check if Everything is running**: Ensure Everything software is running in background
2. **Enable HTTP Server**:
   - Open Everything → Tools → Options → HTTP
   - Check "Enable HTTP Server"
   - Confirm port is 80 (default)
   - Click "OK" and restart Everything
3. **Check port occupation**: Confirm port 80 is not occupied by other programs
4. **Use one-click connection**: Click "One-click Connect Everything" in application settings

#### Everything HTTP Service Cannot Start
**Solutions**:
1. Run Everything as administrator
2. Change HTTP port (e.g., to 8080)
3. Check Windows firewall settings
4. Ensure Everything version is 1.4.1 or higher

### OpenAI API Issues

#### API Request Failed
**Common Errors and Solutions**:
- **401 Unauthorized**: Incorrect API Key, please check and re-enter
- **429 Too Many Requests**: Request frequency too high, please try again later
- **403 Forbidden**: Insufficient account balance or invalid API Key
- **Network Error**: Check network connection, or try changing API endpoint

#### Poor Natural Language Conversion
**Optimization Suggestions**:
1. Use more specific descriptive words
2. Try different expressions
3. Check if appropriate AI model is selected (GPT-3.5-turbo recommended)

### Search Function Issues

#### Empty Search Results
**Troubleshooting Steps**:
1. **Check Everything Index**: Ensure Everything has completed file indexing
2. **Verify Search Syntax**: Try using simpler keywords (e.g., `*.txt`)
3. **Check File Permissions**: Ensure you have permission to access target folders
4. **Rebuild Index**: Select "Tools → Rebuild Database" in Everything

#### Slow Search Speed
**Optimization Methods**:
1. Reduce search result quantity limit
2. Use more precise search conditions
3. Ensure sufficient hard disk space
4. Close unnecessary background programs

### Interface Display Issues

#### File Icons Display Abnormally
**Solution**: Restart application, icon mapping will automatically fix

#### Window Size Abnormal
**Solutions**: 
1. Double-click title bar to restore window
2. Right-click title bar to select window control options
3. Restart application to restore default size

## 👨‍💻 Development Notes

### Project Architecture

This project uses modern Electron + Vue 3 architecture with clear frontend-backend separation:

```
everything-ai-chat/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.js             # Main process entry, handles window management and IPC
│   │   ├── preload.js          # Preload script, safely exposes APIs
│   │   ├── everything-search.js # Everything HTTP API wrapper
│   │   └── everything-manager.js # Everything auto-connection management
│   ├── renderer/               # Vue 3 renderer process
│   │   ├── components/         # Vue components
│   │   │   └── ConfigDialog.vue # Configuration dialog component
│   │   ├── App.vue            # Main application component
│   │   ├── main.js            # Vue application entry
│   │   ├── index.html         # HTML template
│   │   └── style.css          # Global styles
│   └── database/              # Data storage (electron-store)
├── package.json               # Project configuration and dependencies
├── vite.config.js            # Vite build configuration
├── UI_DESIGN_SPEC_2.0.md     # UI design specification document
└── README.md                 # Project documentation
```

### Core Technical Components

#### 🎨 Frontend Tech Stack
- **Vue 3 Composition API**: Modern reactive development
- **Vite**: Ultra-fast development server and build tool
- **Custom CSS**: Carefully designed modern interface

#### ⚙️ Backend Tech Stack
- **Electron 37.x**: Cross-platform desktop application framework
- **Node.js**: Backend logic processing
- **electron-store**: Configuration and data persistence
- **OpenAI API**: AI intelligent search conversion

#### 🔍 Search Engine Integration
- **Everything HTTP API**: High-performance local file search
- **Intelligent Query Optimization**: Local and AI dual query optimization

### Development Environment Setup

#### Required Tools
- Node.js 16+ 
- npm or yarn
- Everything 1.4.1+
- VS Code (recommended)

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "vue.volar",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

### Adding New Features

#### 1. Adding New Search Features
```javascript
// Add new search method in src/main/everything-search.js
async customSearch(query, options) {
  // Implement new search logic
}
```

#### 2. Adding New UI Components
```vue
<!-- Create new component in src/renderer/components/ -->
<template>
  <!-- Component template -->
</template>

<script>
export default {
  name: 'NewComponent'
}
</script>
```

#### 3. Adding New IPC Communication
```javascript
// Add IPC handler in src/main/main.js
ipcMain.handle('new-feature', async (event, data) => {
  // Handle new feature
});

// Expose API in src/main/preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  newFeature: (data) => ipcRenderer.invoke('new-feature', data)
});
```

### Build and Release

#### Development Build
```bash
npm run dev          # Start development environment
npm run build        # Build Vue frontend
```

#### Production Build
```bash
npm run build:all    # Complete build (frontend + Electron)
npm run dist         # Package as installer
```

#### Build Artifacts
- `dist-vue/` - Vue frontend build files
- `release/` - Electron application installer

### Project Features

#### 🔐 Security Design
- Disable Node.js integration
- Enable context isolation
- Use preload scripts for secure communication

#### 📊 Performance Optimization
- Vue 3 Composition API improves performance
- Vite fast development and build
- Virtual scrolling for search results (planned)

#### 🎨 Interface Design
- Custom title bar
- Modern UI design
- Responsive layout
- Dark/light theme support (planned)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing Guide

We welcome all forms of contributions!

### Ways to Contribute
- 🐛 **Report Issues**: Submit Issues when you find bugs
- 💡 **Feature Suggestions**: Discuss good ideas in Discussions  
- 🔧 **Code Contributions**: Fork the project and submit Pull Requests
- 📚 **Documentation Improvements**: Help improve documentation and examples

### Submitting Pull Requests
1. Fork this repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Development Standards
- Follow existing code style
- Add necessary comments
- Update related documentation
- Ensure tests pass

## 🆘 Support and Feedback

### Getting Help
- 📖 **Read Documentation**: First check this README and related documents
- 🔍 **Search Issues**: Search for similar issues in Issues
- 💬 **Submit Issues**: Describe the problem in detail and provide necessary information

### Contact Methods
- **GitHub Issues**: Report bugs and feature requests
- **GitHub Discussions**: Technical discussions and Q&A
- **Email**: Contact developers for urgent issues

### Issue Report Template
When submitting issues, please include:
- Operating system version
- Everything version
- Application version
- Detailed problem description
- Steps to reproduce
- Error screenshots (if any)

---

⭐ If this project helps you, please consider giving it a Star!

💝 Thanks to all contributors for their efforts!
