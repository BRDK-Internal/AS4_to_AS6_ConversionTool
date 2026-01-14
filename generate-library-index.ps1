# Generate AS6 Libraries Index for the converter tool
# This script scans the LibrariesForAS6 folder and creates an index JSON file

$basePath = "c:\Projects\GithibCopilotPlayground\LibrariesForAS6"
$outputPath = "c:\Projects\GithibCopilotPlayground\as6-libraries-index.json"

$index = @{
    Library_2 = @{}
    TechnologyPackages = @{}
}

# Scan Library_2 folder
Write-Host "Scanning Library_2 folder..."
$lib2Path = Join-Path $basePath "Library_2"
if (Test-Path $lib2Path) {
    $libraries = Get-ChildItem -Path $lib2Path -Directory
    foreach ($lib in $libraries) {
        $libName = $lib.Name
        $files = Get-ChildItem -Path $lib.FullName -Recurse -File | ForEach-Object {
            $_.FullName.Substring($lib.FullName.Length + 1).Replace('\', '/')
        }
        if ($files.Count -gt 0) {
            $index.Library_2[$libName] = @($files)
            Write-Host "  $libName : $($files.Count) files"
        }
    }
}

# Scan TechnologyPackages folder
Write-Host "`nScanning TechnologyPackages folder..."
$tpPath = Join-Path $basePath "TechnologyPackages"
if (Test-Path $tpPath) {
    $packages = Get-ChildItem -Path $tpPath -Directory
    foreach ($pkg in $packages) {
        $pkgName = $pkg.Name
        $index.TechnologyPackages[$pkgName] = @{}
        
        # Get version folders
        $versions = Get-ChildItem -Path $pkg.FullName -Directory
        foreach ($ver in $versions) {
            $verName = $ver.Name
            $index.TechnologyPackages[$pkgName][$verName] = @{}
            
            # Check for Library subfolder
            $libraryPath = Join-Path $ver.FullName "Library"
            if (Test-Path $libraryPath) {
                $libs = Get-ChildItem -Path $libraryPath -Directory
                foreach ($lib in $libs) {
                    $libName = $lib.Name
                    
                    # Check for version subfolders in the library
                    $libVersions = Get-ChildItem -Path $lib.FullName -Directory | Where-Object { $_.Name -match '^V?\d+\.\d+' }
                    
                    if ($libVersions.Count -gt 0) {
                        # Use the first (or highest) version folder
                        $libVersion = $libVersions | Sort-Object Name -Descending | Select-Object -First 1
                        $libVerName = $libVersion.Name
                        
                        $files = Get-ChildItem -Path $libVersion.FullName -Recurse -File | ForEach-Object {
                            $_.FullName.Substring($libVersion.FullName.Length + 1).Replace('\', '/')
                        }
                        
                        if ($files.Count -gt 0) {
                            $index.TechnologyPackages[$pkgName][$verName][$libName] = @{
                                version = $libVerName
                                files = @($files)
                            }
                            Write-Host "  $pkgName/$verName/$libName ($libVerName): $($files.Count) files"
                        }
                    } else {
                        # No version subfolders, scan directly
                        $files = Get-ChildItem -Path $lib.FullName -Recurse -File | ForEach-Object {
                            $_.FullName.Substring($lib.FullName.Length + 1).Replace('\', '/')
                        }
                        
                        if ($files.Count -gt 0) {
                            $index.TechnologyPackages[$pkgName][$verName][$libName] = @{
                                version = "latest"
                                files = @($files)
                            }
                            Write-Host "  $pkgName/$verName/$libName (latest): $($files.Count) files"
                        }
                    }
                }
            }
        }
    }
}

# Convert to JSON and save
Write-Host "`nWriting index to $outputPath..."
$json = $index | ConvertTo-Json -Depth 10 -Compress:$false
$json | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "Done! Index generated with:"
Write-Host "  - $($index.Library_2.Count) Library_2 libraries"
Write-Host "  - $($index.TechnologyPackages.Count) Technology Packages"
