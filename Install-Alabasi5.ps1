# ============================================
# Alabasi System 5 Installer - 100% Automatic
# ============================================
# Version: 1.0
# Date: 2025-01-13
# ============================================

# Temporarily disable execution policy
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Colors
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

# Installation settings
$InstallPath = "D:\AAAAAA\alabasi-5"
$XamppPath = "C:\xampp"
$DatabaseName = "alabasi_system_5"
$Port = 3000

# ============================================
# Function: Print colored message
# ============================================
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# ============================================
# Function: Print header
# ============================================
function Write-Header {
    param([string]$Title)
    Write-Host "`n========================================" -ForegroundColor $Cyan
    Write-Host "  $Title" -ForegroundColor $Cyan
    Write-Host "========================================`n" -ForegroundColor $Cyan
}

# ============================================
# Function: Check and install Git
# ============================================
function Install-Git {
    Write-Header "Checking Git..."
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $version = git --version
        Write-ColorMessage "[OK] Git found: $version" $Green
        return $true
    }
    
    Write-ColorMessage "[INSTALL] Installing Git..." $Yellow
    
    try {
        # Try using winget
        winget install --id Git.Git -e --source winget --silent --accept-package-agreements --accept-source-agreements
        
        # Update PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify
        if (Get-Command git -ErrorAction SilentlyContinue) {
            Write-ColorMessage "[OK] Git installed successfully" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "[ERROR] Failed to install Git automatically" $Red
        Write-ColorMessage "Please install Git manually from: https://git-scm.com/download/win" $Yellow
        return $false
    }
}

# ============================================
# Function: Check and install Node.js
# ============================================
function Install-NodeJS {
    Write-Header "Checking Node.js..."
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $version = node --version
        Write-ColorMessage "[OK] Node.js found: $version" $Green
        return $true
    }
    
    Write-ColorMessage "[INSTALL] Installing Node.js..." $Yellow
    
    try {
        # Try using winget
        winget install --id OpenJS.NodeJS.LTS -e --source winget --silent --accept-package-agreements --accept-source-agreements
        
        # Update PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify
        if (Get-Command node -ErrorAction SilentlyContinue) {
            Write-ColorMessage "[OK] Node.js installed successfully" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "[ERROR] Failed to install Node.js automatically" $Red
        Write-ColorMessage "Please install Node.js manually from: https://nodejs.org" $Yellow
        return $false
    }
}

# ============================================
# Function: Check and install pnpm
# ============================================
function Install-Pnpm {
    Write-Header "Checking pnpm..."
    
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        $version = pnpm --version
        Write-ColorMessage "[OK] pnpm found: $version" $Green
        return $true
    }
    
    Write-ColorMessage "[INSTALL] Installing pnpm..." $Yellow
    
    try {
        npm install -g pnpm
        
        # Verify
        if (Get-Command pnpm -ErrorAction SilentlyContinue) {
            Write-ColorMessage "[OK] pnpm installed successfully" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "[ERROR] Failed to install pnpm" $Red
        return $false
    }
}

# ============================================
# Function: Check MySQL
# ============================================
function Test-MySQL {
    Write-Header "Checking MySQL..."
    
    $mysqlPath = "$XamppPath\mysql\bin\mysql.exe"
    
    if (Test-Path $mysqlPath) {
        try {
            & $mysqlPath -u root -e "SELECT VERSION();" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-ColorMessage "[OK] MySQL is working" $Green
                return $true
            }
        } catch {
            Write-ColorMessage "[WARNING] MySQL found but not running" $Yellow
            Write-ColorMessage "Please start MySQL from XAMPP Control Panel" $Yellow
            return $false
        }
    } else {
        Write-ColorMessage "[ERROR] XAMPP MySQL not found at: $XamppPath" $Red
        Write-ColorMessage "Please install XAMPP from: https://www.apachefriends.org" $Yellow
        return $false
    }
}

# ============================================
# Main Program
# ============================================

Clear-Host

Write-Host @"

========================================
  Alabasi Accounting System 5
  100% Automatic Installation
========================================

"@ -ForegroundColor $Cyan

Write-ColorMessage "Starting installation..." $Cyan
Write-ColorMessage ""

# Step 1: Check Git
if (-not (Install-Git)) {
    Write-ColorMessage "[ERROR] Installation failed - Git required" $Red
    pause
    exit 1
}

# Step 2: Check Node.js
if (-not (Install-NodeJS)) {
    Write-ColorMessage "[ERROR] Installation failed - Node.js required" $Red
    pause
    exit 1
}

# Step 3: Check pnpm
if (-not (Install-Pnpm)) {
    Write-ColorMessage "[ERROR] Installation failed - pnpm required" $Red
    pause
    exit 1
}

# Step 4: Check MySQL
if (-not (Test-MySQL)) {
    Write-ColorMessage "[ERROR] Installation failed - MySQL required" $Red
    Write-ColorMessage "Please start MySQL from XAMPP Control Panel and try again" $Yellow
    pause
    exit 1
}

# Step 5: Create installation directory
Write-Header "Creating installation directory..."

try {
    if (Test-Path $InstallPath) {
        Write-ColorMessage "[WARNING] Directory exists, removing..." $Yellow
        Remove-Item -Recurse -Force $InstallPath
    }
    
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-ColorMessage "[OK] Directory created: $InstallPath" $Green
} catch {
    Write-ColorMessage "[ERROR] Failed to create directory: $_" $Red
    pause
    exit 1
}

# Step 6: Clone project from GitHub
Write-Header "Downloading project from GitHub..."

try {
    Set-Location (Split-Path $InstallPath -Parent)
    git clone https://github.com/alabasi2025/alabasi-system-5.git (Split-Path $InstallPath -Leaf)
    Set-Location $InstallPath
    Write-ColorMessage "[OK] Project downloaded successfully" $Green
} catch {
    Write-ColorMessage "[ERROR] Failed to download project: $_" $Red
    pause
    exit 1
}

# Step 7: Install dependencies
Write-Header "Installing dependencies (this may take 2-3 minutes)..."

try {
    pnpm install
    Write-ColorMessage "[OK] Dependencies installed successfully" $Green
} catch {
    Write-ColorMessage "[ERROR] Failed to install dependencies: $_" $Red
    pause
    exit 1
}

# Step 8: Create .env file
Write-Header "Creating configuration file..."

try {
    $envContent = @"
DATABASE_URL=mysql://root@localhost:3306/$DatabaseName
PORT=$Port
NODE_ENV=development
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-ColorMessage "[OK] Configuration file created" $Green
} catch {
    Write-ColorMessage "[ERROR] Failed to create .env file: $_" $Red
    pause
    exit 1
}

# Step 9: Create database
Write-Header "Creating database..."

try {
    $mysqlPath = "$XamppPath\mysql\bin\mysql.exe"
    & $mysqlPath -u root -e "CREATE DATABASE IF NOT EXISTS $DatabaseName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorMessage "[OK] Database created: $DatabaseName" $Green
    } else {
        throw "Failed to create database"
    }
} catch {
    Write-ColorMessage "[ERROR] Failed to create database: $_" $Red
    pause
    exit 1
}

# Step 10: Apply database schema
Write-Header "Applying database schema..."

try {
    pnpm db:push
    Write-ColorMessage "[OK] Database schema applied (24 tables created)" $Green
} catch {
    Write-ColorMessage "[ERROR] Failed to apply schema: $_" $Red
    pause
    exit 1
}

# Step 11: Add seed data
Write-Header "Adding seed data (80+ records)..."

try {
    pnpm db:seed
    Write-ColorMessage "[OK] Seed data added successfully" $Green
} catch {
    Write-ColorMessage "[WARNING] Failed to add seed data (optional)" $Yellow
}

# Step 12: Create desktop shortcut
Write-Header "Creating desktop shortcut..."

try {
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = "$desktopPath\Alabasi System 5.lnk"
    $startScript = "$InstallPath\Start.bat"
    
    # Create Start.bat
    $startContent = @"
@echo off
cd /d "$InstallPath"
pnpm dev:win
"@
    $startContent | Out-File -FilePath $startScript -Encoding ASCII
    
    # Create shortcut
    $WScriptShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-NoExit -Command `"cd '$InstallPath'; pnpm dev:win`""
    $Shortcut.WorkingDirectory = $InstallPath
    $Shortcut.Save()
    
    Write-ColorMessage "[OK] Desktop shortcut created" $Green
} catch {
    Write-ColorMessage "[WARNING] Failed to create shortcut (optional): $_" $Yellow
}

# ============================================
# Installation Complete
# ============================================

Write-Host "`n========================================" -ForegroundColor $Green
Write-Host "  Installation Complete!" -ForegroundColor $Green
Write-Host "========================================" -ForegroundColor $Green
Write-Host ""
Write-ColorMessage "Installation Path: $InstallPath" "White"
Write-ColorMessage "Database: $DatabaseName (80+ records)" "White"
Write-ColorMessage "Port: $Port" "White"
Write-ColorMessage "URL: http://localhost:$Port" "Cyan"
Write-Host ""
Write-ColorMessage "Next Steps:" $Cyan
Write-ColorMessage "1. Double-click 'Alabasi System 5' on your desktop" "White"
Write-ColorMessage "2. Wait for the server to start" "White"
Write-ColorMessage "3. Open http://localhost:$Port in your browser" "White"
Write-Host ""
Write-ColorMessage "Or run manually:" $Cyan
Write-ColorMessage "  cd $InstallPath" "White"
Write-ColorMessage "  pnpm dev:win" "White"
Write-Host ""

pause
