/* =========================================
   WEBVERTEX TECHNOLOGIES
   JAVASCRIPT
========================================= */

const API_BASE = window.location.port === "5000" ? "" : "http://localhost:5000";

async function readApiResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        throw new Error("Backend API is not connected. Start the backend with npm start and open the site through localhost:5000 or Live Server.");
    }
    return response.json();
}


/* =========================================
   PRELOADER
========================================= */

window.addEventListener("load", () => {

    const preloader = document.querySelector(".preloader");

    setTimeout(() => {

        preloader.classList.add("hide");

    }, 700);

});


/* =========================================
   USER AUTHENTICATION
========================================= */

document.body.classList.add("auth-locked");

const authGate = document.getElementById("authGate");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authMessage = document.getElementById("authMessage");
const authSubmit = document.querySelector(".auth-submit");
const authRegisterFields = document.querySelectorAll(".auth-register-only");
let authMode = "login";

function setAuthMode(mode) {
    authMode = mode;
    const isRegister = mode === "register";

    authRegisterFields.forEach(field => field.classList.toggle("is-hidden", !isRegister));
    document.getElementById("authName").required = isRegister;
    document.getElementById("authConfirmPassword").required = isRegister;
    authTitle.textContent = isRegister ? "Create your account" : "Sign in to continue";
    authSubtitle.textContent = isRegister ? "Create an account to explore projects and connect with Webvertex." : "Access project details, services and your enquiry workspace.";
    authSubmit.querySelector("span").textContent = isRegister ? "Create Account" : "Login";
    document.getElementById("authSwitch").innerHTML = isRegister ? "Already have an account? <button type=\"button\" data-auth-mode=\"login\">Sign in</button>" : "New to Webvertex? <button type=\"button\" data-auth-mode=\"register\">Create an account</button>";
    authMessage.textContent = "";
    authMessage.classList.remove("success");
}

document.getElementById("authSwitch").addEventListener("click", event => {
    const modeButton = event.target.closest("[data-auth-mode]");
    if (modeButton) setAuthMode(modeButton.dataset.authMode);
});

function unlockSite() {
    authGate.classList.add("is-hidden");
    document.body.classList.remove("auth-locked");
}

localStorage.removeItem("webvertexUserToken");
localStorage.removeItem("webvertexUser");

if (sessionStorage.getItem("webvertexUserToken")) unlockSite();

authForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!authForm.reportValidity()) return;

    const data = Object.fromEntries(new FormData(authForm).entries());
    if (authMode === "register" && data.password !== data.confirm_password) {
        authMessage.textContent = "Passwords do not match.";
        return;
    }

    authSubmit.disabled = true;
    authSubmit.querySelector("span").textContent = authMode === "register" ? "Creating..." : "Signing in...";
    authMessage.textContent = "";

    try {
        const response = await fetch(`${API_BASE}/api/auth/${authMode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await readApiResponse(response);
        if (!response.ok || !result.success) throw new Error(result.message || "Authentication failed.");
        sessionStorage.setItem("webvertexUserToken", result.token);
        sessionStorage.setItem("webvertexUser", JSON.stringify(result.user));
        unlockSite();
    } catch (error) {
        authMessage.textContent = error.message || "Unable to connect to the server.";
        authSubmit.disabled = false;
        authSubmit.querySelector("span").textContent = authMode === "register" ? "Create Account" : "Login";
    }
});


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    document.body.classList.toggle("menu-open");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("active")) {

        icon.classList.remove("fa-bars");

        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    }

});


/* Close mobile menu after clicking link */

document.querySelectorAll(".nav-link, .nav-btn").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");

        icon.classList.add("fa-bars");

    });

});


/* =========================================
   HEADER SCROLL EFFECT
========================================= */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   PROJECT SHOWCASE
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(filterButton => filterButton.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach(card => {
            const categories = card.dataset.categories.split(" ");
            card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
        });

    });

});

const projectDetails = {
    telegram: {
        title: "AI-Based Telegram Drug Trafficking Identification System",
        category: "AI / ML / CYBERSECURITY",
        icon: "fa-shield-halved",
        copy: "A responsible OSINT research platform that analyzes public Telegram content and metadata. It supports authorized researchers with explainable signals and never accesses private messages or bypasses platform controls.",
        stack: "Python, NLP, Machine Learning, Computer Vision, Flask/FastAPI, MySQL",
        features: ["Text and context detection", "Image analysis and risk scoring", "Analytics dashboard and report generation"],
        projectName: "AI-Based Telegram Drug Trafficking Identification System"
    },
    attendance: {
        title: "Smart Attendance Scanner",
        category: "AI / COMPUTER VISION / WEB",
        icon: "fa-camera",
        copy: "A practical attendance workflow that combines QR or face-recognition scanning with student records, automatic timestamps, percentage calculations and downloadable reports.",
        stack: "Python, OpenCV, QR Scanner, JavaScript, Node.js/PHP, MySQL",
        features: ["Student registration and scanning", "Date, time and percentage tracking", "Admin dashboard and reports"],
        projectName: "Smart Attendance Scanner"
    },
    expense: {
        title: "Smart Expense Tracker",
        category: "FINTECH / WEB / DATA ANALYTICS",
        icon: "fa-chart-pie",
        copy: "A focused personal-finance dashboard for recording income and expenses, setting monthly budgets, reviewing transaction history and understanding spending patterns.",
        stack: "HTML, CSS, JavaScript, Node.js/PHP, MySQL, Chart.js",
        features: ["Income, expense and category management", "Monthly budgets and interactive charts", "Transaction history and financial reports"],
        projectName: "Smart Expense Tracker"
    },
    ev: {
        title: "Smart EV Charging Station Management System",
        category: "IOT / EV / WEB",
        icon: "fa-charging-station",
        copy: "A connected platform for discovering charging stations, reserving slots and monitoring charging information across users, stations and IoT devices.",
        stack: "ESP32, Sensors, MQTT, Python/Node.js, MySQL, Web Dashboard",
        features: ["Charger availability and slot booking", "Charging status and energy monitoring", "User and station management"],
        projectName: "Smart EV Charging Station Management System"
    },
    water: {
        title: "Rental RO Water Purifier Management System",
        category: "IOT / SMART UTILITY / WEB",
        icon: "fa-droplet",
        copy: "A subscription and service platform for purifier rentals, maintenance requests, reminders, payment status and connected device monitoring.",
        stack: "ESP32, Sensors, Node.js/PHP, MySQL, Web Dashboard",
        features: ["Rental plans and subscription management", "Maintenance requests and service reminders", "Purifier status and payment tracking"],
        projectName: "Rental RO Water Purifier Management System"
    }
};

const detailDialog = document.createElement("dialog");
detailDialog.className = "project-dialog";
document.body.appendChild(detailDialog);

document.querySelectorAll(".project-detail-btn").forEach(button => {

    button.addEventListener("click", () => {

        const detail = projectDetails[button.dataset.project];

        detailDialog.innerHTML = `
            <button class="dialog-close" type="button" aria-label="Close project details"><i class="fa-solid fa-xmark"></i></button>
            <div class="dialog-project-logo"><i class="fa-solid ${detail.icon}"></i></div>
            <span class="section-label">${detail.category}</span>
            <h2>${detail.title}</h2>
            <p>${detail.copy}</p>
            <strong>Key features</strong>
            <ul class="dialog-features">${detail.features.map(feature => `<li>${feature}</li>`).join("")}</ul>
            <strong>Technology stack</strong>
            <p class="dialog-stack">${detail.stack}</p>
            <div class="dialog-actions"><button type="button" class="btn btn-primary dialog-enquire">Get This Project <i class="fa-solid fa-arrow-right"></i></button><button type="button" class="dialog-back">Back to Projects</button></div>
        `;

        detailDialog.showModal();
        detailDialog.querySelector(".dialog-close").addEventListener("click", () => detailDialog.close());
        detailDialog.querySelector(".dialog-back").addEventListener("click", () => detailDialog.close());
        detailDialog.querySelector(".dialog-enquire").addEventListener("click", () => {
            detailDialog.close();
            openProjectEnquiry(detail.projectName);
        });

    });

});

detailDialog.addEventListener("click", event => {
    if (event.target === detailDialog) detailDialog.close();
});

const serviceDetails = {
    "Business Website": {
        icon: "fa-solid fa-globe",
        title: "Business Websites",
        description: "Professional responsive websites that make your business easy to discover, understand and contact on every device.",
        deliverables: ["Responsive modern design", "Business pages and service sections", "Contact form and enquiry integration", "Basic SEO-ready structure"]
    },
    "E-Commerce Website": {
        icon: "fa-solid fa-cart-shopping",
        title: "E-Commerce Websites",
        description: "Customer-friendly online stores with product discovery, enquiry or checkout flows and simple management tools.",
        deliverables: ["Product catalogue and categories", "Responsive shopping experience", "Order or enquiry management", "Database-backed administration"]
    },
    "Landing Page": {
        icon: "fa-solid fa-window-maximize",
        title: "Landing Pages",
        description: "Focused landing experiences for campaigns, services and products, designed to communicate value and drive enquiries.",
        deliverables: ["Conversion-focused page structure", "Mobile-first responsive layout", "Strong call-to-action sections", "Analytics-ready implementation"]
    },
    "Custom Web Application": {
        icon: "fa-solid fa-gears",
        title: "Custom Web Applications",
        description: "Purpose-built web applications that turn your operational requirements into a clear, scalable digital workflow.",
        deliverables: ["Requirements and workflow planning", "Frontend and backend development", "Database and API integration", "Testing and technical support"]
    },
    "Student Project": {
        icon: "fa-solid fa-graduation-cap",
        title: "Academic Project Solutions",
        description: "Practical mini and final-year project development with documentation, demo preparation and technical guidance.",
        deliverables: ["Project planning and development", "Source code and database", "Documentation and presentation support", "Demo and viva preparation"]
    },
    "Python Project": {
        icon: "fa-brands fa-python",
        title: "Python Projects",
        description: "Python applications for automation, data analysis, APIs and academic problem-solving with a clean, explainable structure.",
        deliverables: ["Python application development", "Data processing or automation workflows", "API or database integration", "Setup and explanation support"]
    },
    "AI / ML Project": {
        icon: "fa-solid fa-brain",
        title: "AI / ML Projects",
        description: "Responsible AI and machine-learning projects using data, model evaluation and useful dashboards to demonstrate real outcomes.",
        deliverables: ["Dataset and preprocessing workflow", "Model training and evaluation", "Prediction or analytics interface", "Documentation and demo support"]
    },
    "IoT Project": {
        icon: "fa-solid fa-microchip",
        title: "IoT Projects",
        description: "Connected hardware and software projects using sensors, microcontrollers and dashboards to monitor real-world systems.",
        deliverables: ["ESP32 or Arduino integration", "Sensor and device communication", "Backend and dashboard connection", "Testing, setup and troubleshooting"]
    }
};

const serviceDialog = document.createElement("dialog");
serviceDialog.className = "project-dialog service-dialog";
document.body.appendChild(serviceDialog);

document.querySelectorAll(".learn-more").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const serviceName = link.dataset.service;
        const service = serviceDetails[serviceName];

        serviceDialog.innerHTML = `
            <button class="dialog-close" type="button" aria-label="Close service details"><i class="fa-solid fa-xmark"></i></button>
            <div class="dialog-project-logo"><i class="${service.icon}"></i></div>
            <span class="section-label">SERVICE DETAILS</span>
            <h2>${service.title}</h2>
            <p>${service.description}</p>
            <strong>What you receive</strong>
            <ul class="dialog-features">${service.deliverables.map(item => `<li>${item}</li>`).join("")}</ul>
            <div class="dialog-actions"><button type="button" class="btn btn-primary service-quote">Discuss This Service <i class="fa-solid fa-arrow-right"></i></button><button type="button" class="dialog-back">Close</button></div>
        `;

        serviceDialog.showModal();
        serviceDialog.querySelector(".dialog-close").addEventListener("click", () => serviceDialog.close());
        serviceDialog.querySelector(".dialog-back").addEventListener("click", () => serviceDialog.close());
        serviceDialog.querySelector(".service-quote").addEventListener("click", () => {
            const serviceField = document.getElementById("service");
            const messageField = document.getElementById("message");
            if (serviceField) serviceField.value = serviceName;
            if (messageField) messageField.value = `I would like to discuss your ${serviceName} service.`;
            serviceDialog.close();
            document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
        });
    });
});

serviceDialog.addEventListener("click", event => {
    if (event.target === serviceDialog) serviceDialog.close();
});

const enquiryDialog = document.createElement("dialog");
enquiryDialog.className = "enquiry-dialog";
document.body.appendChild(enquiryDialog);

const enquiryFields = `
    <div class="enquiry-form-grid">
        <label>Full Name *<input name="full_name" required maxlength="100" autocomplete="name"></label>
        <label>Email Address<input type="email" name="email" maxlength="160" autocomplete="email"></label>
        <label>WhatsApp Number *<input name="whatsapp" required pattern="\\+?[0-9\\s().-]{8,20}" maxlength="30" autocomplete="tel"></label>
        <label>College Name *<input name="college_name" required maxlength="180"></label>
        <label>Branch *<input name="branch" required maxlength="120" placeholder="Computer Engineering"></label>
        <label>Academic Year<select name="academic_year"><option value="">Select year</option><option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option></select></label>
        <label>Project Type *<select name="project_type" required><option value="">Select type</option><option>Individual</option><option>Group</option></select></label>
        <label>Required Technology<input name="technology" maxlength="180" placeholder="Python, MySQL, IoT..."></label>
        <label class="enquiry-full">Custom Requirements<textarea name="custom_requirements" rows="3" maxlength="4000" placeholder="Tell us about your college format or custom features..."></textarea></label>
        <label>Preferred Contact Method<select name="contact_method"><option>WhatsApp</option><option>Phone Call</option><option>Email</option></select></label>
    </div>
`;

function openProjectEnquiry(projectName) {
    enquiryDialog.innerHTML = `
        <div class="enquiry-dialog-shell">
            <button class="dialog-close enquiry-close" type="button" aria-label="Close enquiry form"><i class="fa-solid fa-xmark"></i></button>
            <div class="enquiry-dialog-header"><span class="section-label">PROJECT ENQUIRY</span><h2>Build your final-year project with confidence.</h2><p>Your selected project is ready. Share a few details and our team will follow up with you.</p></div>
            <div class="enquiry-selected"><i class="fa-solid fa-layer-group"></i><div><small>SELECTED PROJECT</small><strong>${projectName}</strong></div></div>
            <div class="enquiry-layout">
                <form id="projectEnquiryForm" class="project-enquiry-form" novalidate>${enquiryFields}<div class="enquiry-form-message" role="alert"></div><button class="btn btn-primary enquiry-submit" type="submit"><span>Submit Project Enquiry</span><i class="fa-solid fa-paper-plane"></i></button><button class="whatsapp-enquiry-btn" type="button"><i class="fa-brands fa-whatsapp"></i> Enquire on WhatsApp</button></form>
                <aside class="enquiry-package"><span class="section-label">COMPLETE FINAL YEAR PROJECT</span><div class="enquiry-price">₹14,999<span>/-</span></div><p>Everything needed for a polished academic delivery.</p><ul><li>Working Source Code</li><li>Frontend + Backend</li><li>Database</li><li>Project Documentation</li><li>PPT</li><li>UML / DFD / ER Diagrams</li><li>Installation &amp; Setup</li><li>Project Demo</li><li>Project Explanation</li><li>Viva Preparation</li><li>Bug Fixing &amp; Technical Support</li></ul><small>Customization available according to your college/project requirements.</small></aside>
            </div>
        </div>
    `;

    enquiryDialog.showModal();
    const form = enquiryDialog.querySelector("#projectEnquiryForm");
    const message = enquiryDialog.querySelector(".enquiry-form-message");
    const submit = enquiryDialog.querySelector(".enquiry-submit");
    const whatsappButton = enquiryDialog.querySelector(".whatsapp-enquiry-btn");
    let latestWhatsAppMessage = "";

    enquiryDialog.querySelector(".enquiry-close").addEventListener("click", () => enquiryDialog.close());

    const getFormData = () => Object.fromEntries(new FormData(form).entries());

    const makeWhatsAppMessage = data => `Hello, I am interested in a final-year project.\n\nProject: ${projectName}\nName: ${data.full_name}\nCollege: ${data.college_name}\nBranch: ${data.branch}\nAcademic Year: ${data.academic_year || "Not specified"}\n\nPackage: ₹14,999\n\nI would like to know the project features, customization options, documentation, delivery details and support.\n\nPlease share the complete project details.`;

    whatsappButton.addEventListener("click", () => {
        const data = getFormData();
        if (!form.reportValidity()) return;
        latestWhatsAppMessage = makeWhatsAppMessage(data);
        window.open(`https://wa.me/917038448688?text=${encodeURIComponent(latestWhatsAppMessage)}`, "_blank", "noopener,noreferrer");
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = getFormData();
        submit.disabled = true;
        submit.classList.add("is-loading");
        submit.querySelector("span").textContent = "Submitting...";
        message.textContent = "";

        try {
            const response = await fetch(`${API_BASE}/api/project-enquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project_name: projectName, ...data })
            });
            const result = await readApiResponse(response);
            if (!response.ok || !result.success) throw new Error(result.message || "Unable to submit enquiry.");

            latestWhatsAppMessage = makeWhatsAppMessage(data);
            enquiryDialog.querySelector(".enquiry-dialog-shell").innerHTML = `<div class="enquiry-success"><div class="success-icon"><i class="fa-solid fa-check"></i></div><span class="section-label">ENQUIRY RECEIVED</span><h2>Thank You!</h2><p>Your project enquiry has been submitted successfully.</p><p>Our project team will contact you shortly on WhatsApp to discuss your project requirements, customization and next steps.</p><div class="success-actions"><button class="btn btn-primary continue-whatsapp" type="button"><i class="fa-brands fa-whatsapp"></i> Continue on WhatsApp</button><button class="back-projects" type="button">← Back to Projects</button></div></div>`;
            enquiryDialog.querySelector(".continue-whatsapp").addEventListener("click", () => window.open(`https://wa.me/917038448688?text=${encodeURIComponent(latestWhatsAppMessage)}`, "_blank", "noopener,noreferrer"));
            enquiryDialog.querySelector(".back-projects").addEventListener("click", () => enquiryDialog.close());
        } catch (error) {
            message.textContent = error.message || "Unable to connect to server. Please try again.";
            submit.disabled = false;
            submit.classList.remove("is-loading");
            submit.querySelector("span").textContent = "Submit Project Enquiry";
        }
    });
}

document.querySelectorAll(".project-enquire-btn").forEach(button => button.addEventListener("click", () => openProjectEnquiry(button.dataset.projectName)));

enquiryDialog.addEventListener("click", event => {
    if (event.target === enquiryDialog) enquiryDialog.close();
});


/* =========================================
   COUNTER ANIMATION
========================================= */

const counters = document.querySelectorAll("[data-target]");

let countersStarted = false;


function startCounters() {

    if (countersStarted) return;

    countersStarted = true;


    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        let current = 0;

        const increment = Math.max(1, Math.ceil(target / 70));


        const updateCounter = () => {

            current += increment;

            if (current >= target) {

                counter.textContent = target + (target === 100 ? "" : "+");

                return;

            }

            counter.textContent = current;

            requestAnimationFrame(updateCounter);

        };


        updateCounter();

    });

}


const statsSection = document.querySelector(".stats-section");


const statsObserver = new IntersectionObserver(

    entries => {

        if (entries[0].isIntersecting) {

            startCounters();

            statsObserver.disconnect();

        }

    },

    {
        threshold: .4
    }

);


statsObserver.observe(statsSection);


/* =========================================
   FAQ ACCORDION
========================================= */

const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const isActive = item.classList.contains("active");


        faqItems.forEach(otherItem => {

            otherItem.classList.remove("active");

            const answer = otherItem.querySelector(".faq-answer");

            answer.style.maxHeight = null;

        });


        if (!isActive) {

            item.classList.add("active");

            const answer = item.querySelector(".faq-answer");

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }

    });

});


/* =========================================
   QUOTE FORM
========================================= */

const quoteForm = document.getElementById("quoteForm");
const formMessage = document.getElementById("formMessage");

quoteForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const budget = document.getElementById("budget").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !service || !message) {

        formMessage.textContent =
            "Please fill in all required fields.";

        formMessage.classList.add("show");

        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/quotations`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    project_type: service,
                    budget: budget,
                    requirements: message
                })
            }
        );

        const data = await readApiResponse(response);

        if (data.success) {

            formMessage.textContent =
                "Thank you! Your quote request has been received. We will contact you soon.";

            formMessage.classList.add("show");

            quoteForm.reset();

        } else {

            formMessage.textContent =
                "Failed to submit your request. Please try again.";

            formMessage.classList.add("show");
        }

    } catch (error) {

        console.error("Error:", error);

        formMessage.textContent =
            "Unable to connect to server. Please try again.";

        formMessage.classList.add("show");
    }

    setTimeout(() => {

        formMessage.classList.remove("show");

    }, 6000);

});
/* =========================================
   BACK TO TOP
========================================= */

const backTop = document.getElementById("backTop");


window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

});


backTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =========================================
   CURRENT YEAR
========================================= */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =========================================
   SMOOTH ANCHOR SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerHeight = header.offsetHeight;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;


        window.scrollTo({

            top: targetPosition,

            behavior: "smooth"

        });

    });

});