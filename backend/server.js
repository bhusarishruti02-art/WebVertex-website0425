const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();

const allowedOrigins = new Set([process.env.FRONTEND_ORIGIN].filter(Boolean));
app.use(cors({
    origin: (origin, callback) => {
        const isLocalDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
        callback(null, !origin || isLocalDevelopmentOrigin || allowedOrigins.has(origin));
    }
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "webvertex",
    port: Number(process.env.DB_PORT) || 3306
});

const jwtSecret = process.env.JWT_SECRET;
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;
const allowedProjects = new Set([
    "AI-Based Telegram Drug Trafficking Identification System",
    "Smart Attendance Scanner",
    "Smart Expense Tracker",
    "Smart EV Charging Station Management System",
    "Rental RO Water Purifier Management System"
]);
const enquiryStatuses = ["New", "Contacted", "Discussion", "Confirmed", "Completed", "Cancelled"];
const quotationStatuses = ["pending", "Contacted", "In Progress", "Completed", "Cancelled"];

const cleanText = (value, maxLength) => String(value || "").trim().replace(/[<>]/g, "").slice(0, maxLength);
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = value => /^\+?[0-9\s().-]{8,20}$/.test(value);

async function ensureProjectEnquiriesTable() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS project_enquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_name VARCHAR(180) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(160),
            whatsapp VARCHAR(30) NOT NULL,
            college_name VARCHAR(180) NOT NULL,
            branch VARCHAR(120) NOT NULL,
            academic_year VARCHAR(40),
            project_type ENUM('Individual', 'Group') NOT NULL,
            technology VARCHAR(180),
            custom_requirements TEXT,
            contact_method VARCHAR(40),
            status ENUM('New', 'Contacted', 'Discussion', 'Confirmed', 'Completed', 'Cancelled') NOT NULL DEFAULT 'New',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function ensureUsersTable() {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(160) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        req.admin = jwt.verify(token, jwtSecret);
        next();
    } catch {
        res.status(401).json({ success: false, message: "Admin authentication required." });
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Webvertex Technologies Backend Running"
    });
});

// Test MySQL connection
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.json({
            success: true,
            message: "MySQL Connected Successfully ✅",
            data: rows
        });

    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "MySQL Connection Failed ❌",
            error: error.message
        });
    }
});

app.post("/api/auth/register", async (req, res) => {
    const fullName = cleanText(req.body.full_name, 100);
    const email = cleanText(req.body.email, 160).toLowerCase();
    const password = String(req.body.password || "");

    if (!fullName || !isEmail(email) || password.length < 8) {
        return res.status(400).json({ success: false, message: "Enter a name, valid email and password with at least 8 characters." });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const [result] = await db.execute("INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)", [fullName, email, passwordHash]);
        const token = jwt.sign({ userId: result.insertId, email, role: "user" }, jwtSecret, { expiresIn: "7d" });
        res.status(201).json({ success: true, token, user: { fullName, email } });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "An account with this email already exists." });
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Unable to create your account right now." });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const email = cleanText(req.body.email, 160).toLowerCase();
    const password = String(req.body.password || "");

    if (!isEmail(email) || !password) return res.status(400).json({ success: false, message: "Enter your email and password." });

    try {
        const [rows] = await db.execute("SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1", [email]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ success: false, message: "Incorrect email or password." });
        const token = jwt.sign({ userId: user.id, email: user.email, role: "user" }, jwtSecret, { expiresIn: "7d" });
        res.json({ success: true, token, user: { fullName: user.full_name, email: user.email } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Unable to sign in right now." });
    }
});

// Save quotation
app.post("/api/quotations", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            project_type,
            budget,
            requirements
        } = req.body;

        const sql = `
            INSERT INTO quotations
            (name, email, phone, project_type, budget, requirements)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            name,
            email,
            phone,
            project_type,
            budget,
            requirements
        ]);

        res.json({
            success: true,
            message: "Quotation saved successfully ✅",
            quotationId: result.insertId
        });

    } catch (error) {
        console.error("Quotation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save quotation ❌",
            error: error.message
        });
    }
});

app.get("/api/admin/quotations", requireAdmin, async (req, res) => {
    const search = `%${cleanText(req.query.search, 100)}%`;
    const status = quotationStatuses.includes(req.query.status) ? req.query.status : "";

    try {
        const [rows] = await db.execute(`
            SELECT * FROM quotations
            WHERE (name LIKE ? OR email LIKE ? OR project_type LIKE ?)
            AND (? = '' OR status = ?)
            ORDER BY created_at DESC
        `, [search, search, search, status, status]);
        res.json({ success: true, quotations: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to load quote requests." });
    }
});

app.patch("/api/admin/quotations/:id/status", requireAdmin, async (req, res) => {
    const status = cleanText(req.body.status, 20);
    if (!quotationStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status." });

    try {
        await db.execute("UPDATE quotations SET status = ? WHERE id = ?", [status, Number(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to update quote status." });
    }
});

app.delete("/api/admin/quotations/:id", requireAdmin, async (req, res) => {
    try {
        await db.execute("DELETE FROM quotations WHERE id = ?", [Number(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to delete quote request." });
    }
});

app.get("/api/admin/quotations/export", requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, email, phone, project_type, budget, requirements, status, created_at FROM quotations ORDER BY created_at DESC");
        const headers = Object.keys(rows[0] || { id: "", name: "" });
        const csv = [headers.join(","), ...rows.map(row => headers.map(header => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
        res.type("text/csv").set("Content-Disposition", "attachment; filename=quote-requests.csv").send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to export quote requests." });
    }
});

app.get("/api/admin/login", (req, res) => {
    res.status(405).json({
        success: false,
        message: "Admin login requires a POST request from /admin.html."
    });
});

app.post("/api/admin/login", (req, res) => {
    const username = cleanText(req.body.username, 80);
    const password = String(req.body.password || "");

    if (username !== adminUser || password !== adminPassword) {
        return res.status(401).json({ success: false, message: "Invalid admin credentials." });
    }

    res.json({ success: true, token: jwt.sign({ username, role: "admin" }, jwtSecret, { expiresIn: "8h" }) });
});

app.post("/api/project-enquiries", async (req, res) => {
    const enquiry = {
        projectName: cleanText(req.body.project_name, 180),
        fullName: cleanText(req.body.full_name, 100),
        email: cleanText(req.body.email, 160),
        whatsapp: cleanText(req.body.whatsapp, 30),
        collegeName: cleanText(req.body.college_name, 180),
        branch: cleanText(req.body.branch, 120),
        academicYear: cleanText(req.body.academic_year, 40),
        projectType: cleanText(req.body.project_type, 20),
        technology: cleanText(req.body.technology, 180),
        customRequirements: cleanText(req.body.custom_requirements, 4000),
        contactMethod: cleanText(req.body.contact_method, 40)
    };

    if (!allowedProjects.has(enquiry.projectName)) return res.status(400).json({ success: false, message: "Please select a valid project." });
    if (!enquiry.fullName || !enquiry.whatsapp || !enquiry.collegeName || !enquiry.branch || !enquiry.projectType) return res.status(400).json({ success: false, message: "Please complete all required fields." });
    if (enquiry.email && !isEmail(enquiry.email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
    if (!isPhone(enquiry.whatsapp)) return res.status(400).json({ success: false, message: "Enter a valid WhatsApp number." });
    if (!["Individual", "Group"].includes(enquiry.projectType)) return res.status(400).json({ success: false, message: "Choose Individual or Group." });

    try {
        const [result] = await db.execute(`
            INSERT INTO project_enquiries
            (project_name, full_name, email, whatsapp, college_name, branch, academic_year, project_type, technology, custom_requirements, contact_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [enquiry.projectName, enquiry.fullName, enquiry.email || null, enquiry.whatsapp, enquiry.collegeName, enquiry.branch, enquiry.academicYear || null, enquiry.projectType, enquiry.technology || null, enquiry.customRequirements || null, enquiry.contactMethod || null]);

        res.status(201).json({ success: true, enquiryId: result.insertId });
    } catch (error) {
        console.error("Project enquiry error:", error);
        res.status(500).json({ success: false, message: "Unable to save your enquiry right now." });
    }
});

app.get("/api/admin/project-enquiries", requireAdmin, async (req, res) => {
    const search = `%${cleanText(req.query.search, 100)}%`;
    const status = enquiryStatuses.includes(req.query.status) ? req.query.status : "";

    try {
        const [rows] = await db.execute(`
            SELECT * FROM project_enquiries
            WHERE (full_name LIKE ? OR project_name LIKE ?)
            AND (? = '' OR status = ?)
            ORDER BY created_at DESC
        `, [search, search, status, status]);
        res.json({ success: true, enquiries: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to load enquiries." });
    }
});

app.patch("/api/admin/project-enquiries/:id/status", requireAdmin, async (req, res) => {
    const status = cleanText(req.body.status, 20);
    if (!enquiryStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status." });

    try {
        await db.execute("UPDATE project_enquiries SET status = ? WHERE id = ?", [status, Number(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to update status." });
    }
});

app.delete("/api/admin/project-enquiries/:id", requireAdmin, async (req, res) => {
    try {
        await db.execute("DELETE FROM project_enquiries WHERE id = ?", [Number(req.params.id)]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to delete enquiry." });
    }
});

app.get("/api/admin/project-enquiries/export", requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, project_name, full_name, email, whatsapp, college_name, branch, academic_year, project_type, technology, custom_requirements, contact_method, status, created_at FROM project_enquiries ORDER BY created_at DESC");
        const headers = Object.keys(rows[0] || { id: "", project_name: "" });
        const csv = [headers.join(","), ...rows.map(row => headers.map(header => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
        res.type("text/csv").set("Content-Disposition", "attachment; filename=project-enquiries.csv").send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to export enquiries." });
    }
});

const PORT = Number(process.env.PORT) || 5000;

if (!jwtSecret || !adminUser || !adminPassword) {
    console.error("JWT_SECRET, ADMIN_USER and ADMIN_PASSWORD must be configured in backend/.env");
    process.exit(1);
}

Promise.all([ensureProjectEnquiriesTable(), ensureUsersTable()])
    .then(() => app.listen(PORT, () => console.log(`Webvertex server running at http://localhost:${PORT}`)))
    .catch(error => {
        console.error("Database initialization failed. Start MySQL in XAMPP and verify backend/.env DB_HOST, DB_USER, DB_PASSWORD, DB_NAME and DB_PORT.");
        console.error(error.message);
        process.exit(1);
    });