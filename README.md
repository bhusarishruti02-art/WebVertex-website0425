# 🌐 WebVertex Website

A **dynamic and responsive IT company website** built to showcase IT services, manage customer quote requests, and provide an administrative dashboard for managing website data.

The project includes a frontend interface, backend server, database integration, quote request management, and an admin dashboard.

---

## 📌 Project Overview

**WebVertex** is a full-stack IT company website designed to provide a professional online presence for an IT services company.

Visitors can explore the company's services and submit project/quote requests through the website.

Administrators can securely access the admin dashboard to manage and monitor customer requests and website data.

---

## ✨ Features

### 🏠 Modern Website

* Responsive and modern UI
* Professional IT company design
* Mobile-friendly layout
* Service presentation
* Company information
* Contact section
* Smooth navigation

### 💼 Services

The website provides information about the IT services offered by WebVertex.

Visitors can explore available services and learn more about the company's solutions.

### 📝 Quote Request System

Customers can submit project requirements through the quote request form.

The system collects information such as:

* Full Name
* Contact Information
* Project Requirements
* Service Requirements
* Additional Message

Submitted requests are stored in the database for administration.

### 🔐 Admin Dashboard

The project includes a dedicated admin dashboard.

Administrators can:

* Login securely
* View quote requests
* Monitor customer enquiries
* Manage website data
* Review submitted requirements
* Manage requests from a centralized dashboard

### 🗄️ Database Integration

The website uses a backend database to store dynamic information such as:

* Customer quote requests
* User/admin information
* Website data
* Request status

### 📱 Responsive Design

The website is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

---

## 🛠️ Technologies Used

> Update this table if your project uses additional technologies.

| Technology   | Purpose                        |
| ------------ | ------------------------------ |
| HTML5        | Website structure              |
| CSS3         | Styling and responsive design  |
| JavaScript   | Frontend interactions          |
| Node.js      | Backend runtime                |
| Express.js   | Backend/API development        |
| Database     | Dynamic data storage           |
| REST API     | Frontend-backend communication |
| Git & GitHub | Version control                |

---

## 🏗️ Project Architecture

```text
WebVertex Website
        │
        ├── Frontend
        │   ├── HTML
        │   ├── CSS
        │   └── JavaScript
        │
        ├── Backend
        │   ├── Node.js
        │   ├── Express.js
        │   └── API Routes
        │
        ├── Database
        │   └── Application Data
        │
        └── Admin Dashboard
            ├── Admin Login
            ├── Quote Requests
            └── Request Management
```

---

## 📂 Project Structure

```text
WebVertex-website0425/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── ...
│
├── admin.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

> The structure above is an example. Adjust the folder names according to your actual repository structure.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bhusarishruti02-art/WebVertex-website0425.git
```

Move into the project:

```bash
cd WebVertex-website0425
```

---

### 2. Install Dependencies

If the project uses Node.js:

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the backend/project root according to your application configuration.

Example:

```env
PORT=5000
DATABASE_URL=your_database_connection
ADMIN_USER=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_secret_key
```

**Do not upload `.env` to GitHub.**

Make sure `.env` is included in `.gitignore`.

---

## ▶️ Running the Project

Start the backend server using:

```bash
npm start
```

For development:

```bash
npm run dev
```

Then open the website in your browser.

Example:

```text
http://localhost:5000
```

The exact port depends on your backend configuration.

---

## 🔐 Admin Dashboard

The WebVertex project includes an administrator dashboard for managing customer requests.

Admin dashboard:

```text
/admin.html
```

When deployed, it can be accessed through:

```text
https://your-domain.com/admin.html
```

The admin dashboard communicates with the backend API and database to display and manage quote requests.

---

## 🔄 Website Workflow

```text
Visitor
   ↓
WebVertex Website
   ↓
Explore Services
   ↓
Submit Quote Request
   ↓
Backend API
   ↓
Database
   ↓
Admin Dashboard
   ↓
Admin Reviews Request
   ↓
Request Management
```

---

## 📝 Quote Request Workflow

```text
Customer fills Quote Form
          ↓
Frontend Validation
          ↓
API Request
          ↓
Backend Processing
          ↓
Database
          ↓
Request Stored
          ↓
Admin Dashboard
          ↓
Admin Reviews Request
```

---

## 🔒 Security

The project follows basic security practices such as:

* Protected admin dashboard
* Authentication
* Environment variable configuration
* Password protection
* Backend API validation
* Database validation
* `.env` protection
* Sensitive credentials excluded from GitHub

Never commit passwords, API keys, database credentials, JWT secrets, or other sensitive information.

---

## 🚀 Deployment

The project can be deployed using a hosting platform that supports the selected frontend and backend technologies.

A typical deployment structure is:

```text
GitHub Repository
       ↓
Backend Hosting
       ↓
Database
       ↓
Live Website
       ↓
Admin Dashboard
```

After deployment, the website can be accessed through your custom domain.

---

## 📸 Screenshots

### 🏠 Home Page

*Add your WebVertex home page screenshot here.*

### 💼 Services Section

*Add services section screenshot here.*

### 📝 Quote Request Form

*Add quote form screenshot here.*

### 🔐 Admin Login

*Add admin login screenshot here.*

### 📊 Admin Dashboard

*Add admin dashboard screenshot here.*

---

## 🎯 Advantages

* Professional online presence
* Responsive design
* Dynamic content
* Automated quote request management
* Centralized admin dashboard
* Database-backed system
* Easy request monitoring
* Scalable architecture
* Suitable for IT service businesses

---

## 🚀 Future Scope

The project can be extended with:

* 📧 Email notifications for quote requests
* 📱 Customer account system
* 💬 Live chat support
* 📊 Advanced analytics dashboard
* 🔔 Admin notifications
* 📄 Automated quotation generation
* 💳 Online payment integration
* ☁️ Cloud database
* 🔐 Two-factor authentication
* 📱 Progressive Web App (PWA)
* 🤖 AI-powered customer support

---

## 👨‍💻 Developer

**Shruti Bhusari**

Computer Engineering

---

## 📄 License

This project is developed for **educational and portfolio purposes**.

---

## ⭐ Acknowledgement

This project demonstrates the practical implementation of:

* Frontend web development
* Backend development
* Database integration
* REST APIs
* Authentication
* Responsive UI design
* Admin dashboard development
* Dynamic web applications
* Git and GitHub version control
