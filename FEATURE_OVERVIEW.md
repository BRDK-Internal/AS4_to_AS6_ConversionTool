# AS4 to AS6 Conversion Tool — Feature Overview

> **Purpose:** Automated migration of B&R Automation Studio 4 projects to Automation Studio 6 format.  
> **Deployment:** Browser-based static web app — no installation or build step required.  
> **Upload Methods:** Drag & drop folder, file browser dialog, or ZIP archive.

---

## Project Analysis & Detection

Upon upload, the tool automatically scans and identifies:

| Detection | Details |
|-----------|---------|
| **AS Version** | Reads XML processing instruction from `.apj` to determine AS4.x version |
| **GCC Compiler Version** | Identifies 4.1.2 (AS4) vs 11.3.0 (AS6) |
| **Automation Runtime** | Validates minimum B4.25 requirement |
| **Technology Packages** | Extracts current versions and compares against required AS6 versions |
| **Obsolete Hardware** | 200+ discontinued PLCs tracked (PPC2000, PP, 5PP, 5PC, 5AP, X20CP series, etc.) |
| **File Statistics** | Counts ST, PKG, LBY, TMX, motion, HW, and visualization files |
| **Hierarchical File Tree** | Displays project structure grouped by Logical/Physical/Project |

### Blocking Validations
The tool stops conversion and reports errors when:
- Project is already AS6 format
- Obsolete/unsupported hardware is detected
- AR version is below B4.25
- VC3 visualization components are present (not convertible)

---

## Automated Conversions

These conversions are applied automatically in a prioritized pipeline:

### 1. Project File (.apj) Conversion
- Adds XML declaration and AS6 namespace
- Updates `Version` attribute to AS6
- Converts nested IEC settings to attribute-based format
- Adds required AS6 elements: `Communication`, `ANSIC`, `Variables`
- Updates GCC compiler version (4.1.2 → 11.3.0)

### 2. Library Replacements (60+ libraries)
Deprecated libraries are replaced in both **Package.pkg** (or `.sw`) and all code files (`.st`, `.var`, `.typ`, `.fun`):

| AS4 Library | AS6 Replacement | Function Mappings |
|-------------|-----------------|-------------------|
| AsString | AsBrStr | 13 functions (strlen, strcpy, strcmp, strcat, etc.) |
| AsMath | AsBrMath | 11 functions + 22 constants (pi, e, trig) |
| AsWStr | AsBrWStr | 13 wide string functions |
| CANIO | ArCanOpen | CAN I/O functions |
| MpWebXs | *(removed)* | Technology package discontinued |
| AsSafety | *(none – manual)* | Requires SafeLOGIC or SafeMOTION decision |

**Duplicate handling:** If the replacement library already exists in the project, the deprecated entry is simply removed. If not, it is renamed in place.

### 3. Function Call Replacements
Deprecated function calls are renamed across all ST/VAR/TYP/FUN files:
- `strlen` → `brsstrlen` (with type-wrapper handling)
- `memcpy` → `brsmemcpy`
- `memset` → `brsmemset`
- `memcmp` → `brsmemcmp`
- And 50+ additional function renames across all mapped libraries

### 4. Motion Type Replacements
30+ `McAcpAx*` types are renamed to the `McAxis*` / `Mc*` equivalents used in AS6.

### 5. Technology Package Updates
8 technology packages are tracked and their `.lby` versions updated:

| Package | AS6 Version | Key Libraries |
|---------|-------------|---------------|
| mappServices | 6.2.0 | MpAlarmX, MpAudit, MpBackup, MpCom, MpData, MpFile, MpRecipe, MpServer, MpUserX |
| mappMotion | 6.0.0 | MpAxis, MpCnc, MpRobotics, McAcpAx, McAcpTrak, McAxis, McPathGen + **McDriveLog** (module) |
| mappControl | 6.1.0 | MpTemp, MpHydAxis, MpPump, MTBasics, MTFilter, MTProfile |
| mappView | 6.0.0 | Visualization components |
| mappVision | 6.0.0 | ViAccess, ViBase |
| mappCockpit | 6.2.1 | CoTrace |
| mappSafety | 6.2.0 | SfDomain |
| Acp10Arnc0 | 6.2.0 | Acp10_MC, Acp10man, Acp10par, NcGlobal |

**SubVersions are dynamic** — only libraries actually used in the project are included as subVersions in the output. Modules (like McDriveLog) that don't appear in Package.pkg are always injected.

### 6. OPC UA Conversion
- Renames `OpcUA/` folder to `OpcUaCs/`
- Updates UAD FileVersion (7/9 → 10)
- Applies security hardening settings
- Updates package references

### 7. MpAlarmX Restructuring
Single `.mpalarmxcore` file is split into 4 separate files:
- `*_1` — Core alarm configuration
- `*_L` — List configuration
- `*_C` — Category configuration
- `*_Q` — Query configuration

### 8. MpComGroup Restructuring
- Removes Linking/Subnodes patterns
- Preserves parent relationships

### 9. MpDataRecorder Restructuring
- Reorganizes groups (Memory/Record/File)
- Expands alarm configuration (3 defaults)

### 10. User Configuration
- Clears password hashes (incompatible hashing between AS4/AS6)
- Injects `BR_Engineer` role for access

### 11. mappView Anonymous User Config
- Updates `.mappviewcfg` for AS6 anonymous user handling

---

## Manual Review Items

The tool flags issues that cannot be auto-converted but require engineer attention:

| Category | Example |
|----------|---------|
| **Behavioral Changes** | GetCamPosition falling-edge behavior change, Shift command timing, CmdIndependentActivation semantics |
| **Deprecated Function Blocks** | MC_BR_*, UaConnect, UaRead — commented out with TODO |
| **Obsolete Hardware** | Blocking error with hardware details |
| **Libraries Without Replacement** | AsSafety — requires architectural decision (SafeLOGIC vs SafeMOTION) |
| **Deprecated Struct Members** | MpReportCore.Name, MpAxis offset/phasing/standby renames |

---

## User Interface

### 4-Tab Workflow

1. **📁 Project Selection**  
   Upload area (drag & drop / browse / ZIP), file statistics panel, AS version indicator, hierarchical project browser.

2. **🔍 Analysis Results**  
   Severity cards (Error / Warning / Info / Compatible), 3-part filtering (text search + severity + type with 15 categories), select/deselect actions for batch operations.

3. **👁️ Preview Changes**  
   Side-by-side original vs converted view, expandable/collapsible change blocks, apply or undo individual changes, conversion status tracking.

4. **📊 Report**  
   Executive summary, detailed findings, recommendations — exportable in multiple formats.

### Analysis Filter Categories (15)
Libraries, Library Versions, Functions, Function Blocks, Hardware, Project, Compiler, Runtime, Technology Packages, Packages, Task Config, Motion, Localization, Visualization, All

---

## Export & Download

### Converted Project
- **ZIP archive** containing all converted files
- Technology package replacement libraries automatically bundled from `LibrariesForAS6/`
- Temp/, Binaries/, and Diagnosis/ folders excluded

### Analysis Reports
| Format | Use Case |
|--------|----------|
| **HTML** | Formatted, printable, shareable in browser |
| **JSON** | Machine-readable, integrations, archival |
| **CSV** | Spreadsheet import, per-finding rows |

Report content includes:
- Executive summary (severity breakdown, stats, recommendation count)
- All detected findings with file location and context
- Auto-applied changes log
- Manual review requirements
- Technology package inventory

---

## File Handling

### Path-Based Filtering
| Included | Excluded |
|----------|----------|
| `Logical/` (all contents) | `Temp/` (build artifacts) |
| `Physical/` (all contents) | `Binaries/` (compiled output) |
| `.apj` files (project root) | `Diagnosis/` (diagnostic data) |
| | `.git`, `.svn`, `__MACOSX` |

No extension whitelist is used — all files within included paths are processed regardless of extension.

### Binary File Handling
50+ binary extensions recognized (`.a`, `.o`, `.br`, `.lby`, `.vax`, `.dtm`, `.png`, `.pdf`, etc.). These files are:
- Stored with base64 encoding
- Excluded from text-based analysis
- Passed through unchanged to the output ZIP

### Encoding Support
- UTF-8 with multi-byte sequence validation
- Windows-1252 fallback for legacy B&R character sets

### Name Constraints
- **32-character limit** on element IDs (AS6 requirement) — smart truncation at camelCase/underscore boundaries
- **10-character limit** on mapp component file names — applied to generated suffixed files

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Deprecated libraries tracked | 60+ |
| Function/constant mappings | 100+ |
| Obsolete hardware modules | 200+ |
| Binary formats recognized | 50+ |
| Auto-conversion pipelines | 20+ |
| Bundled AS6 replacement libraries | 100+ |
| Technology packages supported | 8 |
| Export formats | 4 (ZIP + HTML/JSON/CSV reports) |

---

## Running the Tool

```
python -m http.server 8000
```
Then open `http://localhost:8000/as4-to-as6-converter.html` in Chrome (recommended over Edge for large uploads).

No dependencies, no build step, no installation — runs entirely in the browser.
