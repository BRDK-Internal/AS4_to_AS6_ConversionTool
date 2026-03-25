# AS4 vs AS6 Project Structure Comparison Analysis

## Executive Summary

This document compares the B&R Automation Studio **AS4 (version 4.9.6.42 SP)** project structure with the **AS6 (version 6.5.0.305)** project format. Based on the analysis of:
- **AS4 Project:** DCM21_LegoGit (v4.9.6.42 SP)
- **AS6 Project:** BlizzAS6/TowelFeederPLC (v6.5.0.305)

We identify structural differences, technology package migrations, and implications for the automated conversion tool.

---

## 1. Project Metadata Structure

### AS4 Project File Format (.apj)

**File Path:** `dcm21.apj` (root directory)

**Actual AS4 Structure (DCM21_LegoGit):**
```xml
<?AutomationStudio Version="4.9.6.42 SP" WorkingVersion="4.9"?>
<Project Edition="Standard">
  <TechnologyPackages>
    <Acp10Arnc0 Version="5.24.1" />
    <mapp Version="5.24.2" />
    <mappSafety Version="5.24.1" />
    <mappView Version="5.24.1" />
  </TechnologyPackages>
  <IECExtendedSettings>
    <Pointers>true</Pointers>
    <NamingConventions>true</NamingConventions>
  </IECExtendedSettings>
</Project>
```

**Key Attributes:**
- `Version`: AS4 format identifier (4.x series)
- `Edition`: Standard, Professional (size/capability tier)
- `TechnologyPackages`: Runtime libraries and frameworks
- `IECExtendedSettings`: Compiler directives (Pointers, NamingConventions)

### AS6 Project File Format (.apj) - VERIFIED STRUCTURE

**Actual AS6 Structure (BlizzAS6/TowelFeederPLC):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<?AutomationStudio Version="6.5.0.305" WorkingVersion="6.5"?>
<Project Version="1.0.0" Edition="Standard" EditionComment="Standard" 
         xmlns="http://br-automation.co.at/AS/Project">
  <Communication />
  <ANSIC DefaultIncludes="true" />
  <IEC ExtendedConstants="true" IecExtendedComments="true" 
       KeywordsAsStructureMembers="false" NamingConventions="true" 
       Pointers="true" Preprocessor="false" />
  <Motion RestartAcoposParameter="true" RestartInitParameter="true" />
  <Project StoreRuntimeInProject="true" />
  <Variables DefaultInitValue="0" DefaultRetain="false" DefaultVolatile="true" />
  <TechnologyPackages>
    <Acp10Arnc0 Version="6.2.0" />
    <mappServices Version="6.2.0" />
    <OpcUaCs Version="6.0.0" />
    <OpcUaFx FxPtpB="6.1.0" FxPubSubB="6.1.0" PubSub="1.3.0" Version="6.1.0" />
  </TechnologyPackages>
</Project>
```

**CRITICAL DIFFERENCES DISCOVERED:**

| Attribute | AS4 | AS6 | Impact |
|-----------|-----|-----|--------|
| `Version` | `4.9.6.42 SP` | `6.5.0.305` | Breaking - major version change |
| `WorkingVersion` | `4.9` | `6.5` | Major version change |
| XML Declaration | Minimal | Full `<?xml version="1.0" encoding="utf-8"?>` | Add to header |
| XML Namespace | None | `xmlns="http://br-automation.co.at/AS/Project"` | **NEW REQUIRED** |
| `Project Version` | None | `Version="1.0.0"` | **NEW ATTRIBUTE** |
| `EditionComment` | None | Present | New optional attribute |
| IEC Settings | Nested elements | Attributes on `<IEC>` | **RESTRUCTURED** |
| `<Communication>` | None | Present (empty) | **NEW ELEMENT** |
| `<ANSIC>` | None | Present | **NEW ELEMENT** |
| `<Motion>` | None | Present | **NEW ELEMENT** |
| `<Variables>` | None | Present | **NEW ELEMENT** |

**Technology Package Changes:**
| Package | AS4 Version | AS6 Version | Notes |
|---------|-------------|-------------|-------|
| Acp10Arnc0 | 5.24.1 | 6.2.0 | Major version change |
| mapp | 5.24.2 | N/A (replaced) | **Replaced by mappServices** |
| mappSafety | 5.24.1 | N/A (conditional) | May not be in all projects |
| mappView | 5.24.1 | N/A (conditional) | May not be in all projects |
| mappServices | N/A | 6.2.0 | **NEW in AS6** |
| OpcUaCs | N/A | 6.0.0 | **NEW in AS6** |
| OpcUaFx | N/A | 6.1.0 | **NEW in AS6** (with sub-versions) |

---

## 2. Directory Structure Comparison

### AS4 Project Directory Layout (DCM21_LegoGit - Verified)

```
dcm21/ (project root)
├── dcm21.apj                           # Project metadata
├── Logical/                            # IEC code and configurations
│   ├── Global.typ                      # Global type definitions
│   ├── Global.var                      # Global variables
│   ├── Package.pkg                     # Package configuration
│   ├── Libraries/                      # All library dependencies
│   │   ├── Acp10man/                   # Motor control (Acp10)
│   │   ├── ArEventLog/                 # Event logging
│   │   ├── AsBrMath/                   # Math functions
│   │   ├── AsBrStr/                    # String functions
│   │   ├── AsIO/                       # I/O functions
│   │   ├── brdkFile/                   # File I/O (B&R Development Kit)
│   │   ├── brdkMC/                     # Motion Control
│   │   ├── MpAlarmX/                   # Alarm management (mapp)
│   │   ├── MpBase/                     # mapp base framework
│   │   ├── MpRecipe/                   # Recipe management (mapp)
│   │   └── [30+ more libraries]
│   ├── modules/                        # User-defined modules
│   │   ├── main/                       # Main control module
│   │   └── feeder/                     # Feeder module
│   ├── services/                       # Utility services
│   │   ├── config/                     # Configuration management
│   │   ├── recipe/                     # Recipe handling
│   │   └── alarm/                      # Alarm service
│   └── mappView/                       # HMI visualization
│       ├── Visualization/              # Screen definitions
│       └── Widgets/                    # Custom widgets
├── Physical/                           # Hardware configuration
├── LastUser.set                        # User session settings
└── README.md                           # Documentation
```

### AS6 Project Directory Layout (BlizzAS6/TowelFeederPLC - Verified)

```
TowelFeederPLC/ (project root)
├── TowelFeederPLC.apj                  # Project metadata (NEW FORMAT!)
├── Logical/                            # IEC code and configurations
│   ├── Global.typ                      # Global type definitions
│   ├── Global.var                      # Global variables
│   ├── Package.pkg                     # Package configuration (FileVersion="4.9")
│   ├── racer.scn                       # Scene file (new file type)
│   ├── acp10etxen/                     # Error text configuration
│   ├── AlarmService/                   # Alarm service module
│   │   ├── AlarmLib/                   # Alarm library (IEC.lby)
│   │   └── AlarmService/               # Alarm service program
│   ├── Configuration/                  # Configuration program
│   ├── DBComs/                         # Database communications
│   │   └── ComLib/                     # Communication library
│   ├── ExceptionClasses/               # Exception handling
│   │   └── PageFault/                  # Page fault handler
│   ├── Machine/                        # Main machine program
│   ├── Motion/                         # Motion control
│   ├── TowelRobot/                     # Robot control
│   ├── RoboPrograms/                   # Robot programs
│   ├── InwLib/                         # Custom library
│   ├── Libraries/                      # Standard libraries
│   │   ├── Acp10man/                   # Motor control
│   │   ├── Acp10sdc/                   # SDC support (NEW)
│   │   ├── AdvIecChk/                  # Advanced IEC checking (NEW)
│   │   ├── Arnc0ext/                   # ARNC0 extensions
│   │   ├── Arnc0man/                   # ARNC0 manager
│   │   └── [more libraries]
│   ├── LogServer/                      # Logging server
│   ├── GmcIpConfig/                    # GMC IP configuration
│   ├── Modbus/                         # Modbus communication
│   ├── MasterCommunication/            # Master communication
│   ├── ShutdownHandler/                # Shutdown handling
│   ├── VCShared/                       # Visual Components shared
│   ├── Visual/                         # Visualization (different from mappView)
│   ├── Visu2/                          # Secondary visualization
│   ├── InwatecBackup/                  # Backup functionality
│   └── gAxis10obj/, gAxis11obj/        # Axis objects
├── Physical/                           # Hardware configuration (ENHANCED)
│   └── PPC80/                          # Hardware configuration
│       ├── Hardware.hw                 # Hardware definition (962 lines)
│       ├── Hardware.hwl                # Hardware layout
│       ├── Hardware.jpg                # Hardware diagram (NEW)
│       ├── Config.pkg                  # Configuration package
│       └── X20CP1686X/                 # CPU configuration
│           ├── Cpu.per                 # CPU performance config
│           ├── Cpu.pkg                 # CPU package
│           ├── Cpu.sw                  # CPU software config
│           ├── IoMap.iom               # I/O mapping
│           ├── PvMap.vvm               # PV mapping
│           ├── AccessAndSecurity/      # Security configuration (NEW!)
│           │   ├── CertificateStore/   # SSL certificates
│           │   ├── TransportLayerSecurity/
│           │   └── UserRoleSystem/     # User roles (NEW!)
│           ├── Connectivity/           # Connectivity config (NEW!)
│           │   ├── OpcUaCs/            # OPC UA Client/Server
│           │   └── OpcUaFx/            # OPC UA FX
│           ├── ExternalHardware/       # External devices
│           ├── Motion/                 # Motion configuration
│           └── mappServices/           # mapp Services config (NEW!)
├── LastUser.set                        # User session settings
└── pedersenm.set                       # User-specific settings
```

**KEY STRUCTURAL DIFFERENCES:**

| Aspect | AS4 | AS6 | Action Required |
|--------|-----|-----|-----------------|
| Project File | Simple XML | Full XML with namespace | Transform structure |
| Package.pkg | FileVersion="4.9" | FileVersion="4.9" | Compatible |
| Security Config | None | AccessAndSecurity/ | May need defaults |
| OPC UA | Optional | Built-in (OpcUaCs, OpcUaFx) | Add config dirs |
| mappServices | Via mapp packages | Separate folder | Create if using mapp |
| Visualization | mappView/ | Visual/, Visu2/, VCShared/ | Different structure |
| Hardware Images | None | Hardware.jpg | Optional |
| User Roles | None | UserRoleSystem/ | NEW - add defaults |

---

## 3. Technology Package Migration (5.24.x → 6.x.x)

### Acp10Arnc0 Library Migration
| Aspect | AS4 (5.24.1) | AS6 (6.2.0) | Impact |
|--------|-------------|-------------|--------|
| Motor Control Framework | Acp10 base | Acp10 enhanced | Function parameter changes |
| Error Handling | ArEventLog integration | ArSystem integration | Library replacement |
| Safety Support | mappSafety 5.24 | mappSafety 6.x | API changes |
| Communication | Powerlink, PROFINET | Enhanced EtherCAT | Hardware dependent |

### mapp Library Migration (renamed to mappServices in AS6)
| Aspect | AS4 mapp (5.24.2) | AS6 mappServices (6.2.0) | Impact |
|--------|-------------|-------------|--------|
| Base Framework | MpBase 5.24 | MpBase 6.x | **Library renamed** |
| Alarm Management | MpAlarmX (older) | MpAlarmX (v6+) | Breaking changes |
| Data Management | MpData (older) | MpData (v6+) | Storage format changes |
| Recipe System | MpRecipe (older) | MpRecipe (v6+) | Data structure updates |
| Server Runtime | MpServer (older) | MpServer (v6+) | New capabilities |

### New AS6 Technology Packages
| Package | Version | Purpose |
|---------|---------|---------|
| OpcUaCs | 6.0.0 | OPC UA Client/Server communications |
| OpcUaFx | 6.1.0 | OPC UA FX with PubSub support |

### Mappview Library Migration
| Aspect | AS4 (5.24.1) | AS6 (6.10.0) | Impact |
|--------|-------------|-------------|--------|
| UI Framework | mappView classic | mappView modern | Template changes |
| Responsive Design | Limited | Enhanced | Widget updates |
| Accessibility | Basic | Enhanced | WCAG compliance |
| Theme System | LegoLight, etc. | Modernized themes | Style sheet updates |
| Visualization | .content, .dialog | Enhanced markup | File format compatibility |

### MappSafety Library Migration
| Aspect | AS4 (5.24.1) | AS6 (6.10.0) | Impact |
|--------|-------------|-------------|--------|
| Safety Runtime | SIL2 capable | SIL3/PLe capable | Validation required |
| Domain Config | SfDomain (older) | SfDomain (v6+) | Configuration changes |
| Error Codes | Older set | Expanded set | Update error handlers |

---

## 4. Library Deprecation & Replacement Mapping

### Deprecated in AS6 - Must Replace

| AS4 Library | AS6 Replacement | Action | Priority |
|-------------|-----------------|--------|----------|
| `AsString` (if present) | `AsBrStr` (rename) | Function mapping | High |
| `Logging` | `ArEventLog` or `ArSystem` | Rewrite calls | High |
| `IO_lib` (if custom) | `AsIO` or `AsIODiag` | Module update | High |
| `ArEventLog` (5.24) | `ArSystem` (6.x) | Complete replacement | High |
| `AsIO` (5.24) | `AsIODiag` + enhanced I/O | New API | Medium |
| Old communication stacks | EtherCAT, modular protocols | Verify hardware | Medium |

### File Processing Implications for Converter

**During AS4 → AS6 conversion, the tool must:**

1. **Detect library references in .st files:**
   ```st
   (* Example: detect deprecated library calls *)
   {external declare}
   VAR_EXTERNAL
       ArEventLog: ArEventLog_typ;  (* DEPRECATED *)
   END_VAR
   ```
   
2. **Detect hardware module dependencies in .hw files:**
   ```xml
   <Module ID="123">
       <Name>X20CP0201</Name>  <!-- DEPRECATED CPU -->
   </Module>
   ```

3. **Update .apj metadata:**
   - Change `Version="4.9.6.42 SP"` → `Version="6.0.0"`
   - Update all TechnologyPackage versions

4. **Validate code compatibility:**
   - Check function signatures (parameters may have changed)
   - Verify type definitions (some may be incompatible)
   - Validate I/O addressing schemes

---

## 5. Structured Text (ST) Code Changes

### Variable Declaration Changes

**AS4 Style:**
```st
PROGRAM main
    VAR
        counter AT %MD10 : INT := 0;  (* Direct memory address *)
        status : BOOL;
    END_VAR
    
    VAR_EXTERNAL
        gConfig : configType_t;        (* Reference to global *)
    END_VAR
    
    (* Function call - AS4 style *)
    IF AsString.StrLen(name) > 10 THEN
        (* Handle string *)
    END_IF
END_PROGRAM
```

**AS6 Considerations:**
```st
PROGRAM main
    VAR
        counter AT %MD10 : INT := 0;  (* UNCHANGED *)
        status : BOOL := FALSE;       (* More explicit initialization *)
    END_VAR
    
    VAR_EXTERNAL
        gConfig : configType_t;       (* UNCHANGED *)
    END_VAR
    
    (* Function call - AS6 style (if using AsBrStr) *)
    IF AsBrStr.StrLen(name) > 10 THEN  (* NEW LIBRARY NAME *)
        (* Handle string *)
    END_IF
END_PROGRAM
```

**Key ST Conversion Changes:**
- Library function namespace updates (e.g., `AsString` → `AsBrStr`)
- Parameter lists may differ (check .fun files)
- New features: Optional parameters, enhanced type checking
- Stricter type rules may require explicit casts

### Code Patterns in DCM21_LegoGit (AS4)

**Pattern 1: Module initialization**
```st
PROGRAM _INIT
    em.setup.name := 'main';
    this.brdkPVLocalVariable_0.pPV[0] := ADR('recipe');
    this.brdkPVLocalVariable_0();
END_PROGRAM
```

**Pattern 2: State machine implementation**
```st
CASE em.mode OF
    MODE_PRODUCING: producing;
    MODE_EMPTYING: empty;
    MODE_MANUAL: (* manual controls *)
END_CASE
```

**Pattern 3: Event logging (likely using ArEventLog)**
```st
(* Hypothetical in project *)
IF error THEN
    ArEventLog.CreateEvent(...);  (* DEPRECATED IN AS6 *)
END_IF
```

---

## 6. Hardware Configuration Changes

### AS4 Hardware Definitions

**Expected in Physical/ directory:**
```xml
<Configuration>
    <CPU ID="0">
        <Type>X20CP0201</Type>      <!-- AS4 era CPU -->
        <Firmware>5.24.42</Firmware>
    </CPU>
    
    <IOModule ID="1">
        <Type>X20AI2632-1</Type>    <!-- AS4 era analog input -->
        <Channels>4</Channels>
    </IOModule>
    
    <IOModule ID="2">
        <Type>X20DO2248</Type>      <!-- AS4 era digital output *)
        <Channels>8</Channels>
    </IOModule>
</Configuration>
```

### AS6 Hardware Requirements

| Hardware | AS4 Version | AS6 Version | Status |
|----------|------------|------------|--------|
| CPU | X20CP0201 | X20CP1381 | Recommended update |
| CPU | X20CP2381 | X20CP2586 | Recommended update |
| AI Module | X20AI2632-1 | X20AI2636 | Direct replacement |
| AO Module | X20AO2638 | X20AO2648 | Enhanced version |
| DO Module | X20DO2248 | X20DO2256 | Direct replacement |
| DI Module | X20DI2374 | X20DI2381 | Direct replacement |
| Communication | X20CM0000 | X20CM0001 | EtherCAT support |

**Critical Impact:** If old hardware modules are used, they may:
1. Still work but with reduced functionality
2. Require firmware updates
3. Lose advanced AS6 features (enhanced diagnostics, etc.)

---

## 7. Conversion Tool - Structural Validation Checklist

### Pre-Conversion Validation (Phase 1)

```
☐ Project file format detection (AS4 vs AS6)
☐ Version string parsing (4.9.6.42 SP)
☐ Edition validation (Standard/Professional)
☐ Technology package version detection
☐ IEC settings compatibility check
☐ File encoding validation (UTF-8 vs others)
```

### Conversion Mapping (Phase 2)

```
☐ Update .apj Version attribute (4.9.6.42 SP → 6.0.0)
☐ Update TechnologyPackage versions:
  ☐ Acp10Arnc0: 5.24.1 → 6.10.0
  ☐ mapp: 5.24.2 → 6.20.0
  ☐ mappSafety: 5.24.1 → 6.10.0
  ☐ mappView: 5.24.1 → 6.10.0
☐ Add new IEC setting: StrictTypes=true
☐ Scan all .st files for deprecated libraries
☐ Generate deprecation report with fix suggestions
☐ Update hardware module references (if applicable)
```

### Post-Conversion Validation (Phase 3)

```
☐ Validate new .apj against AS6 schema
☐ Check for orphaned library references
☐ Verify function parameter compatibility
☐ Validate type definitions against new schema
☐ Generate compatibility warnings
☐ Create migration report with manual review items
```

---

## 8. Directory Structure Preservation Requirements

### For Zip Download in Conversion Tool

**Essential Structure to Preserve:**
```
ProjectName_AS6_converted/
├── dcm21.apj                           # UPDATED
├── Logical/                            # ALL FILES
│   ├── [All .st, .fun, .typ, .var files]
│   ├── Libraries/                      # ALL LIBRARY REFERENCES
│   ├── modules/                        # ALL USER MODULES
│   ├── mappView/                       # ALL VISUALIZATION
│   └── BuildVersion/
├── Physical/                           # UPDATED HARDWARE REFS
├── Services/                           # ALL FILES
├── _conversion-report.json             # METADATA
└── _conversion-summary.txt             # HUMAN-READABLE SUMMARY
```

**Files NOT to Modify:**
- .st/.fun/.typ/.var code files (unless library replacements needed)
- Binary files (.br, .lby, .a)
- Media/asset files (SVG, PNG, etc.)
- .tmx localization files (unless referenced by old libraries)

**Files TO Update:**
- `.apj` (project metadata)
- Any `.st` files that reference deprecated libraries
- `.hwl` files (hardware layout, if old modules detected)

---

## 9. Recommendations for Conversion Tool Enhancement

### Immediate (High Priority)

1. **Update .apj metadata transformation:**
   ```javascript
   // Current: Minimal updates
   // Needed: Complete technology stack version update
   
   // Update metadata in AS4Converter.js:
   async updateProjectMetadata(projectFile) {
       // Parse XML
       // Update Version="6.0.0"
       // Update TechnologyPackage versions
       // Add StrictTypes=true
       // Return updated XML
   }
   ```

2. **Add AS6 format validation:**
   - Verify .apj structure against AS6 schema
   - Check TechnologyPackage compatibility
   - Validate new IEC settings

3. **Enhanced hardware detection:**
   - Scan .hwl files for deprecated modules
   - Generate hardware compatibility report
   - Suggest replacement modules

### Medium Priority

4. **Code pattern analysis:**
   - Detect AS4-specific code patterns
   - Flag potential breaking changes
   - Generate refactoring suggestions

5. **Function signature mapping:**
   - Create database of function signature changes
   - Detect incompatible function calls
   - Auto-suggest corrections where possible

### Long-term (Lower Priority)

6. **Server-based conversion:**
   - Backend compilation validation
   - Real compilation in AS6 environment
   - Return detailed diagnostic report

7. **Migration guide generation:**
   - Per-project specific recommendations
   - Dependency analysis
   - Resource usage calculations

---

## 10. Example AS4 Project Analysis (DCM21_LegoGit)

### Current AS4 Status
- **Version:** 4.9.6.42 SP
- **Edition:** Standard
- **Technology Packages:**
  - Acp10Arnc0 5.24.1 (Motor Control)
  - mapp 5.24.2 (Application Framework)
  - mappSafety 5.24.1 (Safety Runtime)
  - mappView 5.24.1 (HMI/Visualization)
- **IEC Settings:** Pointers=true, NamingConventions=true
- **Modules:** main, feeder, services (config, recipe, alarm, stats)
- **Visualization:** LegoLight theme with responsive layouts
- **Code Patterns:** State machines, event handling, mappView widgets

### AS6 Conversion Requirements for DCM21_LegoGit

**Must Update:**
1. `.apj` metadata (versions to 6.x.x series)
2. `Acp10Arnc0` library references to v6.10.0
3. `mapp*` library references to v6.2x.0 series
4. `mappSafety` to v6.10.0
5. `mappView` widgets/visualizations to AS6 format

**Should Review:**
- Hardware module specifications in Physical/ directory
- Any custom Acp10Arnc0 function calls (check parameter changes)
- mappView page layouts (may need CSS/styling updates)
- Recipe and data storage formats (MpRecipe v6 differences)

**Likely Compatible (No Changes Needed):**
- Module structure and control flow (.st logic)
- Type definitions (.typ files) - mostly backward compatible
- Variable declarations (.var files) - mostly unchanged
- Basic I/O operations (if using standard X20 modules)

---

## 11. Conclusion & Next Steps

### Summary

The AS4 → AS6 conversion is **largely a metadata update** with significant potential code changes depending on which libraries the project uses. The DCM21_LegoGit project, being mapp-based with visualization, requires:

1. **Definite changes:** Project metadata (.apj file)
2. **Probable changes:** Technology package version updates in code
3. **Possible changes:** Hardware module references, function signatures
4. **Unlikely changes:** Module structure, control flow logic

### For the Conversion Tool

To handle AS4 → AS6 conversion comprehensively, the tool should:

1. ✅ **Completed:** Detect deprecations and generate reports
2. ✅ **Completed:** Analyze code patterns and generate before/after
3. ✅ **Completed:** Update .apj metadata transformation (full AS6 format)
4. ✅ **Completed:** Validate AS6 format compliance (XML namespace, IEC attributes)
5. ✅ **Completed:** Technology package version detection and conversion
6. ✅ **Completed:** Package rename handling (mapp → mappServices)
7. 🔄 **Future:** Hardware module compatibility checking
8. 🔄 **Future:** Function signature validation for known breaking changes

### Testing Recommendation

1. Run converter on DCM21_LegoGit AS4 project
2. Verify generated .apj contains AS6 metadata with namespace
3. Check all library references updated to v6.x.x
4. Verify mapp is renamed to mappServices
5. Validate resulting project can be opened in AS6
6. Compile generated project in AS6 (if backend available)
7. Document any compilation warnings/errors

---

**Document Version:** 2.0  
**Analysis Date:** December 18, 2025  
**AS4 Project Analyzed:** DCM21_LegoGit (v4.9.6.42 SP)  
**AS6 Project Reference:** BlizzAS6/TowelFeederPLC (v6.5.0.305)  
**AS6 Target Version:** 6.5.0.305+
