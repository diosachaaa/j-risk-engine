# J-Risk Engine Frontend

Frontend application for **J-Risk Engine**, a dynamic cyber risk scoring dashboard developed for the capstone project.

This project provides a web interface for:
- landing page and public information
- authentication flow
- CISO dashboard
- asset detail report page
- management dashboard placeholder

---

## Project Overview

J-Risk Engine is designed to help monitor cyber risk posture more effectively through a dashboard-based interface.  
The frontend focuses on presenting:
- asset risk overview
- risk trend visualization
- alert summary
- technical analysis
- asset-level detail reporting

---

## Tech Stack

- **React**
- **React Router**
- **Vite**
- **CSS**
- **Lucide React**

---

## Project Structure

```txt
src/
  app/
    App.jsx
    main.jsx
    routeMeta.js

  assets/
    images/

  features/
    asset-detail/
      components/
      data/
      pages/
      styles/

    auth/
      components/
      locales/
      pages/
      styles/

    dashboard/
      ciso/
        components/
        data/
        pages/
      management/
        data/
        pages/
      shared/
        components/
        styles/
        dashboardText.js

    landing/
      components/
      locales/
      pages/
      styles/

  shared/
    components/
    contexts/
    styles/
    utils/
```

---

## Main Features

### Public / Landing
- Landing page
- Product introduction
- Feature overview
- Dashboard preview
- Contact section

### Authentication
- Login page
- Register page
- Verify code page
- Verify email page

### Dashboard
- CISO dashboard
- Risk trend card
- Security status card
- Recent alert card
- Top risk table
- Technical analysis card
- Asset preview modal

### Asset Detail
- Asset detail page
- Printable asset security report
- PDF-friendly layout using browser print

### Management
- Management dashboard placeholder page

---

## Routing

Main routes currently available:

- `/`
- `/auth/login`
- `/auth/register`
- `/auth/complete-profile`
- `/auth/verify-email`
- `/dashboard/ciso`
- `/dashboard/ciso/assets/:assetId`
- `/dashboard/management`

---