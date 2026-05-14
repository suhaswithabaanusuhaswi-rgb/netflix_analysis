# Netflix Data Analysis Dashboard

An interactive Netflix-style Data Analysis Dashboard built using React.js and Recharts.
This project visualizes Netflix show data through charts, statistics, and analytical insights using a modern UI inspired by Netflix.

---

## 🚀 Features

* Interactive Dashboard Interface
* Genre Distribution Analysis
* Average Ratings by Genre
* Release Year Analysis
* Top Rated Shows Visualization
* Duration Distribution Charts
* Statistical Summary Cards
* Responsive UI Design
* Netflix-inspired Theme

---

## 🛠️ Tech Stack

* React.js
* Vite
* Recharts
* JavaScript (JSX)
* CSS Inline Styling

---

## 📦 Installation

### Clone Repository

```bash id="dc2uh5"
git clone https://github.com/suhaswithabaanusuhaswi-rgb/netflix_analysis.git
```

---

### Navigate to Project

```bash id="w0vh08"
cd netflix_analysis
```

---

### Install Dependencies

```bash id="g5n8br"
npm install
```

---

### Install Recharts

```bash id="8vjlwm"
npm install recharts
```

---

### Run Development Server

```bash id="cz4ztw"
npm run dev
```

---

### Open Browser

```text id="6asvrm"
http://localhost:5173
```

---

## 📁 Project Structure

```text id="ihjlwm"
netflix_analysis/
│
├── src/
│   ├── main.jsx
│   ├── netflix-analysis.jsx
│
├── public/
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 📊 Dashboard Modules

1. Overview Data Table
2. Genre Distribution
3. Average Rating Analysis
4. Release Year Distribution
5. Genre vs Rating Comparison
6. Top Rated Shows
7. Shows by Year
8. Duration Analysis
9. Statistical Summary

---

## 📈 Visualizations Used

* Bar Charts
* Line Charts
* Statistical Cards
* Distribution Graphs
* Responsive Data Tables

---

## 📚 Concepts Covered

* React Functional Components
* React Hooks (`useState`)
* Data Visualization
* Array Manipulation
* Statistical Calculations
* Dynamic Rendering
* Responsive Design

---

## ⚠️ Important Note

Do not import `Histogram` from Recharts because it is not supported.

Correct import:

```javascript id="njlwm4"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";
```

---

## 🎯 Purpose of the Project

This project demonstrates:

* Frontend Dashboard Development
* Data Visualization Techniques
* React Component Architecture
* Real-world Analytics UI Design

---

## 👨‍💻 Developed By

Suhaswitha baanu

---

## 📄 License

This project is developed for educational and learning purposes.
