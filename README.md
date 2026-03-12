# META-NEW2 Frontend Template

Frontend template for the **MetaAssets platform**.

Repository: **META-NEW2**

This version includes updated frontend navigation and new member backend pages.
The project is built with **Vite + EJS + SCSS** and will later be integrated with a **PHP backend**.

---

# Project Overview

This repository contains the **UI template layer** for the MetaAssets website.

Main updates in this version:

- Updated **Frontend Navigation**
- Added **Member Backend Pages**
- Updated **terminology**
- Added **ETH / USD price display**
- Added **Edition count display**

This project currently contains **frontend UI templates only**.

Backend logic will be implemented separately.

---

# Main Updates in META-NEW2

## 1. Navigation Update

The main navigation menu has been updated.

Navigation changes based on login state.

### Before Login

錢包登入 / 設定

### After Login

查看鏈證

Inside `header.ejs`, there are commented sections showing how to switch navigation depending on login status.

Example:

<!-- Login state control -->

<!-- Before login -->

<a href="login.html">錢包登入 / 設定</a>

<!-- After login -->

<a href="user/assets.html">查看鏈證</a>

Backend developers should output the appropriate section based on login state.

---

# 2. Terminology Update

Several terms were updated across the platform.

| Old Term | New Term |
| -------- | -------- |
| 鏈證藝術 | 藝術鍊證 |
| 藏品鏈證 | 藏品鍊證 |
| 認證藝術 | 認證藝術 |
| 藝術藏品 | 藝術藏品 |

Please ensure backend data uses the **new terminology**.

---

# 3. Artwork Card Data Fields

Artwork cards now include additional information.

New fields:

- ETH price
- USD price
- Edition count

Example display:

1,000.00 ETH  
(3,000 USD)

Edition: 5

If a field is missing, the UI currently uses `&nbsp;` to maintain layout alignment.

---

# 4. Member Backend Pages

This version introduces **member backend pages**.

Location:

pages/user/

Example pages:

assets.html  
records.html  
assigned.html  
assigned-message.html  
transaction-assigned-detail.html

These pages share a common layout including:

- Member sidebar
- Breadcrumb navigation
- Content area

---

# Layout Structure

Shared layout components are stored in:

layout/

Important files:

header.ejs  
breadcrumb.ejs  
pagination.ejs  
sidebar.ejs

---

# Frontend Technology

This project uses:

- Vite
- EJS
- SCSS
- BEM CSS architecture

Example CSS naming:

ma-card  
ma-card**title  
ma-card**price  
ma-card\_\_edition

---

# Build Instructions

Install dependencies:

npm install

Run development server:

npm run dev

Build production files:

npm run build

---

# Build Output

After running build, files will be generated in:

dist/

Example structure:

dist  
 ├─ assets  
 │ ├─ js  
 │ └─ css  
 ├─ images  
 ├─ index.html  
 ├─ search-assets.html  
 ├─ search-collect.html  
 └─ user

The **dist folder** contains the final frontend files for deployment.

---

# Backend Integration Notes

Backend developers should handle:

Login state control  
Artwork data population  
Prices and edition data  
User account data  
Transaction records

Some links currently use placeholder values `#` which should be replaced with backend routes.

---

# Important Notes

This repository provides **UI templates only**.

No API integration is included.

Backend developers should integrate:

Wallet login  
Artwork data  
Transaction data  
User account system

---

# Folder Structure

Example simplified structure:

META-NEW2

src  
 ├─ assets  
 │ ├─ scss  
 │ ├─ js  
 │ └─ images  
 │
├─ layout  
 │ ├─ header.ejs  
 │ ├─ breadcrumb.ejs  
 │ ├─ pagination.ejs  
 │
├─ pages  
 │ ├─ index.html  
 │ ├─ search-assets.html  
 │ ├─ search-collect.html  
 │
│ └─ user  
 │ ├─ assets.html  
 │ ├─ records.html  
 │ ├─ assigned.html  
 │ └─ assigned-message.html

---

# Author

MetaAssets Frontend
