# AS4 to AS6 Conversion Tool - User Guide

## 1. Introduction
This tool is designed to assist in the migration of B&R Automation Studio 4 (AS4) projects to Automation Studio 6 (AS6). It analyzes project files, identifies deprecated libraries and functions, and suggests replacements compatible with AS6.

## 2. Launching the Webserver
The tool runs as a local web application.

### Prerequisites
- Python installed on your Windows machine.
- PowerShell or Command Prompt.

### Steps to Launch
1.  Open **PowerShell**.
2.  Navigate to the project directory:
    ```powershell
    cd c:\Projects\GithibCopilotPlayground
    ```
3.  Start the Python HTTP server:
    ```powershell
    python -m http.server 8000
    ```
4.  Open your web browser and navigate to:
    [http://localhost:8000/as4-to-as6-converter.html](http://localhost:8000/as4-to-as6-converter.html)

---

## 3. Functionality Overview

### Key Features
-   **Structure Analysis**: Parses folder structures to understand the AS4 project layout.
-   **Deprecation Scanning**: Identifies obsolete libraries (e.g., `MpCom`, `MpWebXs`) and suggests AS6 alternatives.
-   **Code Conversion**: Automatically updates syntax for renamed functions or types (e.g., `OpcUA` -> `OpcUaCs`).
-   **Report Generation**: Exports a summary of changes and remaining issues.

---

## 4. User Interface

The application is divided into four main tabs:

### 4.1 Project Selection
This is the starting point.
-   **Upload Area**: Drag & drop your project folder or use the **"Select Project Folder"** button.
-   **Project Summary**: Displays a count of ST files, Packages, Libraries, and Hardware configurations found.
-   **Action**: Click **"Scan for Deprecations"** to proceed.

![Project Selection Screen](https://via.placeholder.com/600x400?text=Project+Selection+Tab)
*(The Project Selection tab showing file upload and summary)*

### 4.2 Analysis Results
Displays the findings from the scan.
-   **Deprecated Libraries**: Lists libraries that need to be replaced.
-   **Function Calls**: Shows specific code lines that require modification.
-   **Issues**: Highlights potential problems like version mismatches.

### 4.3 Preview Changes
Allows you to review the modifications before applying them.
-   **Diff View**: Shows "Before" and "After" views of your code files.
-   **Apply**: Buttons to confirm file conversions.

### 4.4 Report
Generates a final summary.
-   **Export**: capable of saving the migration log for documentation.

---

## 5. Troubleshooting
-   **"File not found"**: Ensure you have selected the root folder of the AS4 project.
-   **Server not responding**: Check if the PowerShell window running Python is still open.
-   **Version Errors**: If you see errors like `MpServer 6.5.0 not valid`, ensure the `as6-libraries-index.json` is correctly configured for version `6.2.0`.

