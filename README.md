# Enterprise HRMS Portal 🚀

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.js.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT Security](https://img.shields.io/badge/Security-JWT%20Bearer-red?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A state-of-the-art **Enterprise Human Resource Management System (HRMS)** designed to streamline workforce operations, enhance HR decision-making, and automate payroll, attendance, recruitment, and performance reviews. Built with a powerful **Spring Boot 3 + Java 17** REST backend, stateless **JWT Role-Based Security**, and an exquisite **React + Vite** frontend utilizing modern **Glassmorphism design acoustics and dynamic micro-animations**.

---

## 🌟 Core Features & Modules

### 🔐 Role-Based Access Control (RBAC) & Security
- **Stateless JWT Authentication**: Secure HTTP Bearer token validation with automated token expiration and refresh capabilities.
- **Granular Permissions**: Tailored user views and endpoint protection across four hierarchical roles:
  - **`ROLE_ADMIN` & `ROLE_HR`**: Full organizational oversight, employee creation, department administration, payroll generation, and system announcements.
  - **`ROLE_MANAGER`**: Team performance review evaluations, leave request processing, and candidate recruitment insights.
  - **`ROLE_EMPLOYEE`**: Self-service portal for viewing personal attendance logs, submitting leave requests, browsing job postings, viewing review scores, and downloading salary slips.

### 👥 Employee & Department Roster Management
- **Centralized Employee Profiles**: Complete profile records including designation, contact details, date of birth, addresses, and joining timelines.
- **Department Metrics & Allocation**: Dedicated management for organizational divisions (Human Resources, IT, Engineering & Research, Finance, Marketing, Sales, Operations, Legal, and Customer Support).
- **Profile Photo Service**: Seamless binary file upload, persistent local file storage, and dynamic content serving.

### 💰 Automated Payroll & Salary Slip Engine
- **Enterprise Calculation Engine**: Automatically calculates Basic salary proportions, **House Rent Allowance (HRA - 50%)**, bonuses, allowances, **Flat Tax deductions (10%)**, and **Provident Fund contributions (PF - 12%)**.
- **Instant PDF Payslip Exports**: Embedded PDF generator using `jsPDF` and `html2canvas` allowing employees and HR officers to export clean, printable, official monthly salary slips directly from the table interface.

### 📈 360° Performance Evaluation Suite
- **Multi-Dimensional Scoring**: Evaluates employee excellence across core criteria: *Communication*, *Productivity*, *Teamwork*, and *Leadership* (graded 0 to 5).
- **Manager Feedback Loops**: Integrated commentary notes, analytical charts, and historical trajectory evaluation.
- **Responsive Pagination**: Optimized database sorting guaranteeing immediate visibility of newly submitted evaluations.

### 📅 Attendance & Leave Workflow Engine
- **Daily Attendance Tracking**: Automated log entries recording employee arrival and departure times with visual growth and attendance trend analytics.
- **Leave Request Management**: Comprehensive workflow handling *Sick*, *Vacation*, and *Casual* leave application submissions with instant approval/rejection switching for supervisors.

### 📢 Corporate Bulletin & Recruitment Tracking
- **Announcement Board**: Organization-wide communication broadcasting hackathons, holidays, policy upgrades, and general notices.
- **Talent Acquisition Engine**: Dedicated job openings and candidate application pipelines managed by internal teams.

### 🎨 Premium Glassmorphic UI/UX
- Designed with high-contrast, state-of-the-art visual excellence featuring curated color palettes, dark-mode styling, glowing glass cards, modern typography, and smooth interactive micro-animations.

---

## 🛠️ Technology Stack

### Backend Architectures (Java / Spring)
- **Framework**: Spring Boot 3.4.x
- **Language**: Java 17 / Java 21 compatible
- **Data Persistence**: Spring Data JPA / Hibernate ORM
- **Database**: MySQL 8.0+
- **Security**: Spring Security 6 + JJWT Token Service
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI
- **Build & Dependency Management**: Apache Maven

### Frontend Architectures (React / Node)
- **Framework**: React 18
- **Build Tooling & Server**: Vite 5.x
- **UI & Styling**: Vanilla CSS (Tailored Design System tokens & utilities)
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptor token injection
- **Export Utility**: jsPDF + html2canvas

---

## 🚀 Quick Start Guide

### Prerequisites
Ensure you have the following installed on your target environment:
- [JDK 17 or higher](https://www.oracle.com/java/technologies/downloads/)
- [Node.js 18.x or higher](https://nodejs.org/) & `npm`
- [MySQL 8.0 Server](https://www.mysql.com/)
- [Git](https://git-scm.com/)

---

### 1️⃣ Database Configuration (MySQL)
Open MySQL Workbench or your command terminal and execute:
```sql
CREATE DATABASE hrms_db;
```
Verify your connection credentials inside `src/main/resources/application.properties` (or `application.yml`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hrms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

### 2️⃣ Backend Execution (Spring Boot)
Open a terminal in the project root directory (`D:\Project\HRMS`) and execute Maven:
```bash
# Clean build and verify compilation
mvn clean compile

# Run Spring Boot Application Server
mvn spring-boot:run
```
*The REST API and Tomcat server will start immediately on **`http://localhost:8081`**.*

---

### 3️⃣ Frontend Execution (React + Vite)
Open a separate terminal window and navigate into the `frontend` subfolder:
```bash
cd frontend

# Install Node modules and dependencies
npm install

# Start the high-speed Vite dev server
npm run dev
```
*Your interactive HRMS portal will boot up on **`http://localhost:5173`**.*

---

## 📚 API Reference & Swagger Interactive UI

The backend automatically embeds comprehensive OpenAPI Documentation equipped with HTTP Bearer Token testing capabilities.

- **Swagger Documentation URL**: [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)
- **How to Authorize in Swagger**:
  1. Call `POST /api/v1/auth/login` (or register a user via `POST /api/v1/auth/register`).
  2. Copy the resulting `"token"` string from the JSON response.
  3. Click the green **Authorize (🔓)** lock icon at the top right of the Swagger UI dashboard.
  4. Paste your token directly into the input field and hit **Authorize**. All subsequent REST requests will be executed securely!

---

## 📂 Repository Structure

```text
├── src/main/java/com/enterprise/hrms/
│   ├── config/          # CORS, Swagger OpenAPI schemes, JPA Auditor Auditing
│   ├── controller/      # Auth, Employee, Department, Payroll, Performance, Leave & Announcement Endpoints
│   ├── dto/             # Clean Data Transfer Objects (Requests & Responses)
│   ├── entity/          # Hibernate JPA Database Models & Relationship Mapping
│   ├── exception/       # Global Exception Handlers & Standardized API Responses
│   ├── repository/      # Spring Data JPA Repository Interfaces
│   ├── security/        # JWT Filtering, User Details Service & Password Encoding
│   └── service/         # Core Business Logic & File Storage Processing
│
├── frontend/src/
│   ├── components/      # Glassmorphic Modal Dialogs, AppShell Navigation & Interactive Charts
│   ├── context/         # AuthContext JWT Token Storage & Session Management
│   ├── pages/           # Dashboard, Employee Hub, Departments, Payroll, Performance & Leaves
│   └── utils/           # Axios Interceptor setups & automated PDF Slip generation engine
│
├── pom.xml              # Maven Project Configuration & Dependencies
└── README.md            # Comprehensive Documentation Hub
```
##Deployed Live Link: 
https://hrms-frontend-kjti.onrender.com

---

## 🤝 Contributing & License
Designed and crafted for High-Performance Enterprise Resource Management. Contributions, issues, and feature enhancements are always welcome!

---
*Built with ❤️ by [Bharath TS](https://github.com/bharathts04).*
