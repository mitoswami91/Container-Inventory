# 🚢 Container Inventory Management System

A high-performance, mobile-first web application designed for container freight stations (CFS) and logistics yards to verify, record, and track physical container inventory in real time.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Angular 18, PrimeNG, PrimeFlex, SCSS, RxJS, WAMP Apache |
| **Backend** | NestJS, TypeScript, Prisma ORM, JWT, Bcrypt |
| **Database** | MySQL (Port 3370), MSSQL Master Data Synchronization |
| **DevOps & Tools** | PM2 Process Manager, Windows Batch Automation |

---

## ✨ Key Features

1. **Mobile-First Yard Operations**:
   - **Auto-Detect Container Size**: Typing or picking a container number automatically detects and selects its size (20 FT, 40 FT, 45 FT).
   - **ISO 6346 Validation**: Real-time checksum verification on typed container prefixes.
   - **Offline Queue Mode**: Saves records in `localStorage` when network is weak; auto-syncs when online and skips duplicate records safely.

2. **Re-Inspection & Yard Verification**:
   - **Excel Spreadsheet View**: Horizontal scrollable grid with crisp borders and zebra striping.
   - **Freeze Panes (Sticky Column)**: Pinned Container Number column stays visible during horizontal scroll.
   - **Inspect Cards Mode**: 1-tap view switcher with large, high-contrast cards for outdoor sunlight verification.
   - **Tap-to-Inspect Modal**: Quick full-screen inspection summary for individual containers.

3. **DevOps & Live Monitoring**:
   - **PM2 Background Management**: Auto-restarts on reboot with zero manual terminal handling.
   - **Double-Click Batch Scripts**:
     - `Start-Inventory-PM2.bat`
     - `Stop-Inventory-PM2.bat`
     - `View-Live-Logs.bat` (Real-time live console stream of entries and logins).

4. **Security & Auditing**:
   - Granular RBAC (`can_add`, `can_delete`, `can_clear`).
   - Tracked login counts on User Management dashboard and CSV exports.

---

## 📖 Version History & Changelog
For a detailed chronological milestone history of all features, refer to:
👉 **[CHANGELOG.md](./CHANGELOG.md)**

---

## 🔒 Security & Privacy Notice
All confidential environment variables, database credentials, proprietary customer records, and build artifacts are strictly ignored via `.gitignore`.
