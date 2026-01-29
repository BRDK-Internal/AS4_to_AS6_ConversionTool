# AS4 to AS6 Conversion Tool

A web-based tool for migrating B&R Automation Studio 4 (AS4) projects to Automation Studio 6 (AS6). It analyzes project files, identifies deprecated libraries and functions, and suggests replacements compatible with AS6.

## Features

- **Structure Analysis** – Parses folder structures to understand AS4 project layouts
- **Deprecation Scanning** – Identifies obsolete libraries (e.g., `MpCom`, `MpWebXs`) and suggests AS6 alternatives
- **Code Conversion** – Automatically updates syntax for renamed functions or types
- **Report Generation** – Exports a summary of changes and remaining issues

---

## Getting Started

### Prerequisites

- [Python 3.x](https://www.python.org/downloads/) installed on your machine
- [VS Code](https://code.visualstudio.com/) (recommended) or any web browser
- Git (for cloning the repository)

### Installation

1. **Clone the repository** 
    
    Example:
   ```bash
   git clone https://github.com/BRDK-GitHub/AS4_to_AS6_ConversionTool.git C:\projects\AS4_to_AS6_ConversionTool
   ```

2. **Download the AS6 Library Pack**

   The replacement AS6 library pack is required for the tool to suggest correct library replacements.

   📦 **Download here:** [AS6 Library Pack (SharePoint)](https://abb-my.sharepoint.com/:u:/p/mads-ravn_pedersen_dk/IQD6GnOHao4pQYgsskb2J0ozAZQ3WCFLRfN-QG6DeJNaiME?e=Q6BnRd)

3. **Extract the libraries**

   Unzip the downloaded file and place the contents in the `LibrariesForAS6/` folder so that the structure looks like:

   ```
   AS4_to_AS6_ConversionTool/
   ├── LibrariesForAS6/
   │   ├── Library_2/
   │   └── TechnologyPackages/
   ├── as4-to-as6-converter.html
   ├── as4-converter.js
   └── ...
   ```

---

## Running the Tool

### Option 1: VS Code (Recommended)

1. Open the project folder in VS Code
2. Press **F5** or go to **Run → Start Debugging**
3. The web server will start and Chrome will automatically open to the converter page

Alternatively:
- Press **Ctrl+Shift+D** to open the Run and Debug panel
- Select **"Start AS4 to AS6 Converter"** from the dropdown
- Click the green play button ▶️

### Option 2: Command Palette

1. Press **Ctrl+Shift+P** to open the Command Palette
2. Type `Debug: Select and Start Debugging`
3. Select **"Start AS4 to AS6 Converter"**

### Option 3: Manual (Terminal)

1. Open a terminal in the project directory
2. Run the Python HTTP server:

   ```bash
   python -m http.server 8000
   ```

3. Open your browser and navigate to:

   [http://localhost:8000/as4-to-as6-converter.html](http://localhost:8000/as4-to-as6-converter.html)

---

## Usage

The application is divided into four main tabs:

### Tab 1: Project Selection
This is the starting point for your conversion process.

- **Upload Area** – Drag & drop your AS4 project folder or use the **"Select Project Folder"** button
- **Project Summary** – Displays a count of ST files, Packages, Libraries, and Hardware configurations found
- **Action** – Click **"Scan for Deprecations"** to proceed to analysis

### Tab 2: Analysis Results
Displays the findings from the deprecation scan.

- **Deprecated Libraries** – Lists libraries that need to be replaced (e.g., `MpCom`, `MpWebXs`)
- **Function Calls** – Shows specific code lines that require modification (e.g., `OpcUA` → `OpcUaCs`)
- **Issues** – Highlights potential problems like version mismatches

### Tab 3: Preview Changes
Allows you to review the modifications before applying them.

- **Diff View** – Shows "Before" and "After" views of your code files
- **Apply** – Buttons to confirm individual file conversions

### Tab 4: Report
Generates a final summary of the migration.

- **Export** – Save the migration log for documentation purposes

---

## Project Structure

```
AS4_to_AS6_ConversionTool/
├── .vscode/
│   └── launch.json           # VS Code launch configuration
├── LibrariesForAS6/          # AS6 replacement libraries (download separately)
│   ├── Library_2/            # Standard libraries
│   └── TechnologyPackages/   # mapp packages
├── as4-to-as6-converter.html # Main application entry point
├── as4-converter.js          # Core conversion logic
├── as4-converter-styles.css  # Application styles
├── deprecation-database.js   # Database of deprecated items
├── as6-libraries-index.json  # Index of AS6 libraries
├── jszip.min.js              # ZIP file handling
├── User_Guide.md             # Detailed user documentation
└── README.md                 # This file
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"File not found"** | Ensure you selected the root folder of your AS4 project |
| **Server not responding** | Check that Python is running in the terminal (PowerShell window should still be open) |
| **Browser doesn't open** | Manually navigate to `http://localhost:8000/as4-to-as6-converter.html` |
| **Port 8000 in use** | Change the port: `python -m http.server 8080` and update the URL accordingly |
| **Version errors** (e.g., `MpServer 6.5.0 not valid`) | Verify `as6-libraries-index.json` is correctly configured for version `6.2.0` |
| **Chrome not opening** | Ensure Google Chrome is installed and set as default, or open the URL manually in Chrome |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT License

Copyright (c) 2026 ABB / B&R Industrial Automation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
