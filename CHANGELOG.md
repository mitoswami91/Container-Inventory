# 📦 Container Inventory System — Project Timeline & Changelog

A full chronological history of development milestones, feature enhancements, and operational improvements for the Container Inventory Application.

---

## 📅 Timeline & Version Milestones

### 🚀 [v1.6.0] — Auto-Size Detection & Master Sync
- **Automatic Container Size Pre-Selection**:
  - Enhanced the Add Container form so that selecting or typing an 11-digit container number automatically detects and selects the container's physical size (`20 FT`, `40 FT`, `45 FT`).
  - Operators can manually override the size dropdown if required; otherwise, only the yard location needs to be verified/entered.
- **Container Master Schema Upgrade**:
  - Added the `size` integer column to `ContainerMaster` database model and updated `getSuggestions` backend query to return matched dimensions.
- **High-Accuracy MSSQL Sync Query**:
  - Developed an optimized SQL Server batch query extracting over 664,900 unique containers with 99.98% size accuracy.

---

### 📱 [v1.5.0] — Mobile UX & Outdoor Sunlight Optimization
- **Excel Spreadsheet Grid Layout**:
  - Replaced stacked mobile cards in `view-container` with a horizontal spreadsheet view featuring crisp Excel-style gridlines and touch momentum scrolling.
- **Sticky Frozen Columns (Freeze Panes)**:
  - Pinned the `Cont No` and `Sr No` columns to the left edge so container numbers remain permanently visible while scrolling horizontally to check remarks, sizes, or dates.
- **1-Tap View Switcher (Excel Grid vs. Inspect Cards)**:
  - Introduced a toggle button allowing operators to switch between tabular Excel overview and dedicated inspection cards.
- **Tap-to-Inspect Modal**:
  - Tapping any container row opens a large, high-contrast modal dialog designed for physical yard re-inspection.
- **Outdoor Sunlight Typography**:
  - Upgraded font sizes and weights (`font-weight: 800` with deep slate contrast) on size dropdowns and form labels.

---

### ⚡ [v1.4.0] — DevOps, PM2 Process Management & Live Monitoring
- **PM2 Process Manager Integration**:
  - Configured `ecosystem.config.js` for zero-downtime process recovery and auto-restarts on system reboots.
- **Desktop One-Click Batch Shortcuts**:
  - `Start-Inventory-PM2.bat`: Launches the backend API in the background.
  - `Stop-Inventory-PM2.bat`: Safely terminates the background API service.
  - `View-Live-Logs.bat`: Opens a real-time console window streaming live container entries and operator logins.
- **Live Activity Logger**:
  - Integrated console logger streams in backend controllers to output formatted live events (`>>> [NEW ENTRY]` and `>>> [USER LOGIN]`).

---

### 🔄 [v1.3.0] — Offline Queue & Resilient Auto-Sync
- **Local Storage Resilience**:
  - Guarded offline queue entries in `localStorage` to prevent data loss across page reloads, browser closes, or device restarts.
- **Network-Aware Background Auto-Sync**:
  - Programmed automatic background syncing triggered as soon as network connectivity is restored (`window.online` event listener).
- **Duplicate-Skipping Queue Engine**:
  - Programmed the synchronization loop to detect duplicate database entries (`HTTP 409/400`) and silently skip them without aborting the rest of the queue.

---

### 👥 [v1.2.0] — User Login Event Tracking & Audit Logs
- **Login Audit Logging**:
  - Created the `LoginLog` database model to record timestamped authentication events for every successful login.
- **User Management Dashboard Counter**:
  - Added a dedicated "Logins" counter column to the User Administration dashboard table.
  - Connected login count statistics into CSV user export reports.

---

### 🔍 [v1.1.0] — Master Container Autocomplete
- **Container Master Suggestions**:
  - Created `ContainerMaster` database model to store historical container numbers.
  - Exposed prefix suggestion endpoint (`GET /container/suggest?query=...`) with debounced querying starting from 1 character.
- **PrimeNG AutoComplete Integration**:
  - Replaced input masks with dynamic `p-autoComplete` with ISO 6346 checksum validation.

---

### 🏗️ [v1.0.0] — Initial Foundation & Core Architecture
- **Full-Stack Architecture**:
  - **Backend**: NestJS framework with Prisma ORM and MySQL database.
  - **Frontend**: Angular 18 with PrimeNG design system, responsive layouts, and WAMP Apache deployment.
  - **Security**: JWT authentication, bcrypt password hashing, and granular Role-Based Access Control (RBAC: `can_add`, `can_delete`, `can_clear`).
- **Core Modules**:
  - Add Container with location and remarks.
  - My Container Entries (`view-container`).
  - All Container Entries (`all-container`) with CSV export and admin clear permissions.
  - User Management with active/inactive status toggles.

---

## 🔒 Security & Privacy Notice
- All database passwords, API connection strings, and encryption keys are strictly decoupled into `.env` and excluded from version control via `.gitignore`.
- Proprietary customer container lists and database dumps are excluded from repository tracking.
