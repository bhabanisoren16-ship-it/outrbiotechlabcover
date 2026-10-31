# OUTR Lab Cover Generator 📄🎓

[![Official Website](https://img.shields.io/badge/Official%20Site-outrbiotechlabcover.vercel.app-3533cd?style=for-the-badge&logo=vercel&logoColor=white)](https://outrbiotechlabcover.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-outrlabcover-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bhabanisoren16-ship-it/outrlabcover)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Official Live Website**: [https://outrbiotechlabcover.vercel.app/](https://outrbiotechlabcover.vercel.app/)  
> **Designed and Developed by**: **Biotechnology 2025–29**

A modern, high-performance web application designed for students and faculty of **Odisha University of Technology and Research (OUTR), Bhubaneswar** to create, preview, and download standard academic A4 lab cover pages.

---

## 🌟 Features

- ⚡ **High-Speed Instant Download**: Hardware-accelerated 300 DPI PDF generation in under 1 second.
- 📱 **Mobile & Desktop Optimized**: Adaptive scaling ensures lightning-fast rendering on smartphones and tablets without lag or memory issues.
- 🖨️ **Print-Ready Academic Standard**: Generates pixel-perfect 300 DPI A4 documents formatted to OUTR standards.
- 🔄 **Real-Time Live Preview**: Instant visual synchronization as you type course details, student names, registration numbers, and departments.
- 🖼️ **Flexible Export Options**:
  - **Download PDF**: Lightweight, crystal-clear single-page PDF (~700 KB).
  - **Download Image**: Lossless high-definition PNG.
  - **Direct Print**: Standard browser print dialog configured for borderless A4 paper.
- 🎨 **Customization & Logo Support**: Supports custom department names, logos, borders, and typography.
- 🔒 **Client-Side Privacy**: Details are processed locally in your browser and automatically cleared after export.

---

## 🚀 Live Access

Visit the official production site:  
👉 **[https://outrbiotechlabcover.vercel.app/](https://outrbiotechlabcover.vercel.app/)**

---

## 🔐 Admin Portal

The platform includes an administrative control portal for academic coordinators and faculty to manage university profiles, departments, pre-configured lab courses, document types, and export telemetry:

- **Portal URL**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html) (or click the **Admin** button in the header)
- **Default Username**: `admin`
- **Default Password**: `outr@admin2025` *(changeable in the portal)*
- **Key Capabilities**:
  - 📊 **Telemetry & Analytics**: Real-time tracking of total PDF and PNG covers exported.
  - 🏫 **Institutional Profile**: Centralized control over University Name, Campus Address, Degree prefix, and Batch Attribution.
  - 📚 **Departments & Labs Manager**: Add, edit, and organize OUTR engineering branches with standard pre-configured lab subjects.
  - 📑 **Document Types & Semesters**: Configure academic document classifications (`LAB RECORD`, `ASSIGNMENT`, `PROJECT REPORT`, `SEMINAR`).
  - 🔒 **Hardened Security**: Salted SHA-256 client-side cryptographic hashing, brute-force lockout (5 attempts triggers 60s cooldown), and session expiration.
  - 💾 **Data Backup & Restore**: Download complete configuration as portable JSON and restore across environments or reset to OUTR factory defaults.

---

## 💻 Local Development

Run locally without external dependencies:

```bash
# Clone the repository
git clone https://github.com/bhabanisoren16-ship-it/outrlabcover.git

# Navigate to project folder
cd outrlabcover

# Start the local development server
node serve.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ Attribution

Designed and Developed with pride by **Biotechnology 2025–29**, Odisha University of Technology and Research (OUTR), Bhubaneswar.
