# HDB Resale Price Visualiser

This is a full-stack web application developed as part of NTU’s SC2006 Software Engineering module. It allows users to explore historical HDB resale prices and receive predicted price insights for 2029 using machine learning.

The application is designed to make government housing data more accessible through interactive graphs, maps, and AI-generated insights. It supports guest access as well as secure login for users who wish to save their comparison history.

[Watch demo video here](https://youtu.be/6dS3is9w9no)

---

## Features

- **Historical Price Trends:** Line graphs showing resale prices from 2015–2023.
- **AI Forecasting:** Projected 2029 resale prices based on linear regression.
- **Interactive Search:** Users can search by district or year using natural language input.
- **Comparison Tool:** Compare prices across up to 5 districts over a selected time range.
- **Interactive Map:** Select districts directly via a Google Map interface.
- **Recent Transactions:** View and sort recent transactions by town, room type, or year.
- **User Authentication:** Login, sign up, reset password, and guest access supported.
- **LocalStorage Support:** Recently viewed comparisons saved locally on the browser.
- **Filter Options:** Filter listings by flat type, district, resale year, and room type.

---

## Demo Video

Watch our 6-minute walkthrough here:  
[https://your-youtube-demo-link.com](https://youtu.be/6dS3is9w9no)

---

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs at: http://localhost:3000

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs at: http://localhost:5000

---

## API Overview

| Endpoint                              | Method | Description                                |
|---------------------------------------|--------|--------------------------------------------|
| `/api/districts`                      | GET    | Returns all HDB districts                  |
| `/api/resale/resale_analysis/`        | GET    | Returns historical data for selected town |
| `/api/resale/predictions/`            | GET    | Returns ML prediction for a town/year     |

Backend endpoints return JSON. Frontend queries them dynamically.

---

## Architecture

- **Frontend:** React.js, Tailwind CSS, Chart.js, Axios, Google Maps API
- **Backend:** Flask, Python, pandas, scikit-learn
- **ML Model:** Linear regression using scikit-learn
- **Data Source:** Mocked resale data in CSV format (loaded server-side)
- **Design Patterns:** MVC (Model-View-Controller), Observer, Factory, Facade

---

## Directory Structure

```
hdb-resale-visualiser/
│
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/api/
│   └── ...
│
├── backend/
│   ├── app.py
│   ├── ml_logic.py
│   └── data/resale_data.csv
│
└── model/
    └── train_model.ipynb
```

---

## Key Modules

### Search

- Search by district name (e.g., “Woodlands”) or year (e.g., “2019”)
- Input validation ensures one or both fields are filled

### Price Comparison

- Users select up to 5 districts and time range
- Switch between graph and table view
- History saved in browser localStorage

### Interactive Map

- Google Maps API used to render visual district selection
- Two modes: compare same room type across districts, or different room types within one district
- Markers toggle selection with color changes

### AI Insights

- Uses scikit-learn linear regression model
- Projects resale price based on historical trend
- Users select districts to get trendline + 2029 forecast + recommendation (buy/wait)

### Authentication

- Users can sign up and login securely
- Password reset via email (demo mode)
- Guest mode allows access without account
- Navbar updates dynamically based on login state

---

## Testing

- Manual user flow tests for login, search, and comparison features
- Data consistency checks for CSV parsing and visual rendering
- UI responsiveness tested on multiple screen sizes
- Model outputs verified against known historical data

---

## Software Engineering Practices

- Modular React components
- RESTful API design with Flask
- GitHub branches for feature development
- SCRUM-inspired workflow with 3 sprints:
  - Sprint 1: Backend and search
  - Sprint 2: Visualisation and ML
  - Sprint 3: Integration and testing
- Applied SOLID principles:
  - Single Responsibility (component separation)
  - Open/Closed (e.g., new filters can be added without rewriting core)
  - Dependency Inversion (frontend only calls APIs)
- Design Patterns:
  - MVC, Observer (for graph/map responsiveness), Factory

---

## Limitations & Future Work

- Current dataset is incomplete; real-time API integration is planned
- The ML model is simple; future versions may use time-series forecasting or XGBoost
- Logged-in users currently have limited personalisation; future versions may support saved searches, notifications, or recommendations
