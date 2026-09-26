# MAKAUT Continuous Assessment Marks Calculator

A simple, responsive, and user-friendly web application for calculating **MAKAUT Continuous Assessment (CA) marks** for theory courses.

The calculator converts different assessment components into the **30-mark Continuous Assessment score** and provides a clear breakdown of the final result.

## 🚀 Live Repository

[MAKAUT Continuous Assessment Marks Calculator — GitHub](https://github.com/Rakesh-2211/MAKAUT-Continuous-Assessment-Marks-Calculator?utm_source=chatgpt.com)

---

## 📌 About the Project

Calculating Continuous Assessment marks manually can be time-consuming, especially when different assessment components have different maximum marks and weightages.

This project provides a web-based calculator that simplifies the process.

The application follows the assessment structure:

| Component | Raw Marks | Converted Marks |
| --------- | --------: | --------------: |
| CA1       |        25 |               5 |
| CA2       |        25 |               5 |
| ECA       |        70 |              10 |
| WCA       |        10 |              10 |
| **Total** |         — |          **30** |

CA1 and CA2 are combined as **Component A**, which contributes a maximum of **10 marks**.

ECA contributes another **10 marks**, while WCA contributes the remaining **10 marks**.

---

## ✨ Features

### 🧮 1. Continuous Assessment Calculator

Enter your marks for:

* CA1 — Class Test 1
* CA2 — Class Test 2
* ECA — End-Semester CA
* WCA — Whole-Semester CA

The application automatically calculates the converted marks and final CA score.

### 📊 2. Detailed Score Breakdown

The result section displays:

* Component A score
* Component B score
* Component C score
* Final CA marks
* Maximum CA marks
* Percentage
* Performance status
* Visual progress indicator

### 📚 3. Semester Subject Tracker

The project also includes a **Semester Subject Continuous Assessment Tracker** for keeping track of CA performance across multiple subjects.

This makes it easier to monitor your overall semester performance.

### 🌓 4. Dark / Light Mode

The interface includes a theme switcher that allows users to switch between:

* 🌙 Night Mode
* ☀️ Day Mode

### 🖨️ 5. Printable CA Grade Report

The application generates a structured printable report containing:

* Subject name
* Date generated
* Assessment components
* Raw marks
* Maximum marks
* Converted marks
* Final CA score
* Percentage
* Signature sections

This can be useful for maintaining a physical or digital record of the calculated result.

### 📱 6. Responsive Design

The interface is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

### ⚡ 7. No Backend Required

The application runs entirely on the client side.

No database or server is required to perform the calculations.

---

## 📐 Calculation Method

### Component A — CA1 + CA2

CA1 and CA2 are each evaluated out of 25 marks.

Their average is converted to a maximum of 10 marks:

```text
CA Average = (CA1 + CA2) / 2

Component A = (CA Average / 25) × 10
```

Equivalent form:

```text
Component A = ((CA1 + CA2) / 50) × 10
```

### Component B — ECA

ECA is evaluated out of 70 marks and converted to 10 marks:

```text
Component B = (ECA / 70) × 10
```

### Component C — WCA

WCA is evaluated directly out of 10:

```text
Component C = WCA
```

### Final CA Score

```text
Final CA Score = Component A + Component B + Component C
```

Maximum:

```text
Final CA Score = 30 marks
```

### Percentage

```text
CA Percentage = (Final CA Score / 30) × 100
```

---

## 🧪 Example Calculation

Suppose a student obtains:

```text
CA1 = 20 / 25
CA2 = 22 / 25
ECA = 56 / 70
WCA = 9 / 10
```

### Step 1 — Component A

```text
CA Average = (20 + 22) / 2
           = 21

Component A = (21 / 25) × 10
            = 8.40
```

### Step 2 — Component B

```text
Component B = (56 / 70) × 10
            = 8.00
```

### Step 3 — Component C

```text
Component C = 9.00
```

### Final Score

```text
Final CA Score = 8.40 + 8.00 + 9.00
               = 25.40 / 30
```

### Percentage

```text
Percentage = (25.40 / 30) × 100
           = 84.67%
```

---

## 🛠️ Technologies Used

This project is built using standard web technologies:

* **HTML5** — Application structure
* **CSS3** — Styling, responsive layout, animations and themes
* **JavaScript (ES6+)** — Calculation logic and interactive functionality
* **SVG** — Icons and score visualization
* **Google Fonts** — Typography

No external framework or backend is required.

---

## 📂 Project Structure

```text
MAKAUT-Continuous-Assessment-Marks-Calculator/
│
├── .github/
│   └── workflows/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

### `index.html`

Contains the complete user interface, including:

* Header
* Calculator inputs
* Result dashboard
* Semester tracker
* Printable report
* Theme controls

### `style.css`

Handles:

* Responsive layout
* Dark/light themes
* Cards
* Buttons
* Progress indicators
* Animations
* Mobile styling
* Print styling

### `app.js`

Contains the application's:

* Calculation logic
* Input validation
* Dynamic result updates
* Subject tracker functionality
* Theme switching
* Printable report generation
* UI interactions

---

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rakesh-2211/MAKAUT-Continuous-Assessment-Marks-Calculator.git
```

### 2. Navigate to the Project

```bash
cd MAKAUT-Continuous-Assessment-Marks-Calculator
```

### 3. Run the Application

Since this is a client-side web application, no package installation is required.

Simply open:

```text
index.html
```

in your web browser.

Alternatively, you can use **VS Code Live Server** for local development.

---

## 🖥️ How to Use

### Step 1

Open the application in your browser.

### Step 2

Enter the **subject name**.

### Step 3

Enter your marks:

```text
CA1 → out of 25
CA2 → out of 25
ECA → out of 70
WCA → out of 10
```

### Step 4

The calculator automatically calculates:

```text
Component A
Component B
Component C
Final CA Score
Percentage
Performance Status
```

### Step 5

Use the semester tracker if you want to maintain CA scores for multiple subjects.

### Step 6

Use the print/report option to generate a printable CA grade report.

---

## 📊 Performance Interpretation

The application provides a performance indicator based on the calculated CA score.

Example thresholds displayed by the application include:

|  CA Score | Interpretation |
| --------: | -------------- |
| ≥ 21 / 30 | Good           |
| ≥ 15 / 30 | Average        |
| < 15 / 30 | Needs Work     |

These indicators are intended as a simple performance visualization and should not be treated as an official MAKAUT grade classification.

---

## 🎯 Project Objectives

The main objectives of this project are:

1. Reduce manual CA mark calculations.
2. Minimize arithmetic errors.
3. Provide instant calculation results.
4. Display a clear component-wise breakdown.
5. Track CA performance across multiple subjects.
6. Provide a printable CA report.
7. Create a responsive interface accessible from different devices.
8. Demonstrate practical use of HTML, CSS and JavaScript.

---

## 🔮 Future Improvements

Possible future upgrades include:

* [ ] CGPA / SGPA calculator
* [ ] Semester-wise performance analytics
* [ ] Graphs and charts
* [ ] Export report as PDF
* [ ] Save student data locally
* [ ] Import/export subject data using CSV
* [ ] Multiple student profiles
* [ ] Progressive Web App (PWA) support
* [ ] Installable Android application
* [ ] Automatic MAKAUT regulation/version selection
* [ ] Improved accessibility
* [ ] Unit testing for calculation functions

---

## ⚠️ Disclaimer

This project is an **educational utility** intended to simplify Continuous Assessment calculations.

Users should verify the applicable MAKAUT regulations, syllabus, assessment scheme, and official academic records before using calculated values for official purposes.

Assessment rules can change between regulations, academic sessions, programs, or institutions.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

### Contribution Steps

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git commit -m "Add: your feature"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

## 📜 License

This project currently does not specify a license in the repository.

If you want others to freely use, modify, and distribute the project, consider adding an appropriate open-source license such as the MIT License.

---

## 👨‍💻 Author

**Rakesh-2211**

Electronics & Communication Engineering Student

GitHub:
[Rakesh-2211 on GitHub](https://github.com/Rakesh-2211?utm_source=chatgpt.com)

---

## ⭐ Support

If this project is useful to you, consider giving the repository a ⭐ on GitHub.

**Made for MAKAUT students.**
