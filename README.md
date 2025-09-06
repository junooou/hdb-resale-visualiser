# HDB Resale Price Visualiser

This is a full-stack web application that allows users to explore historical HDB resale price trends across different towns in Singapore and view predicted price trends for the year 2029. The application includes an AI-generated buying suggestion based on forecasted trends.

This project was developed as part of NTU's SC2006 Software Engineering module.

## Features

- Users can select an HDB town from a dropdown list.
- The application displays a line chart with:
  - Historical resale price trends from 2000 to 2023.
  - A projected trend for 2029 based on logistic regression.
- Below the chart, a textual summary provides:
  - Predicted average resale price in 2029.
  - A data-driven buy or wait suggestion.

## Setup Instructions

### Frontend

Navigate to the `frontend` directory and run:

```bash
npm install
npm start
```

The frontend will be available at http://localhost:3000.

### Backend

Navigate to the `backend` directory and run:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will be available at http://localhost:5000.

## API Overview

### Endpoints

| Endpoint                    | Method | Description                         |
|-----------------------------|--------|-------------------------------------|
| `/api/districts`            | GET    | Returns a list of all HDB towns     |
| `/api/prices/<district>`    | GET    | Returns historical price data       |
| `/api/predict/<district>`   | GET    | Returns predicted price and insight |

All endpoints return JSON responses.

## Architecture

This project follows a modular architecture with separate frontend, backend, and model logic.

- **Frontend:** React with components for town selection, data visualization, and insight display.
- **Backend:** Python with Flask, exposing REST endpoints for data and predictions.
- **Machine Learning Model:** Logistic regression implemented with scikit-learn.
- **Data Source:** A mock CSV dataset containing average resale prices from 2000 to 2023.

## Directory Structure

```
hdb-resale-visualiser/
│
├── frontend/            # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── api/
│
├── backend/             # Flask app
│   ├── app.py
│   ├── ml_logic.py
│   └── data/
│       └── resale_data.csv
│
└── model/               # Jupyter notebooks for training
```

## Technologies Used

**Frontend**

- React.js
- Tailwind CSS
- Chart.js
- Axios

**Backend**

- Python
- Flask
- scikit-learn
- pandas

**Other**

- Google Maps API (optional)
- CSV file for mock data

## Future Improvements

- Replace mock data with live HDB resale data from official APIs.
- Add filtering by flat type, year range, and town.
- Include additional ML models (e.g. ARIMA, XGBoost).
- Enable user accounts and allow saving of selected towns or predictions.

## Team

This project was completed as part of NTU's SC2006 Software Engineering module.

| Name         | Role                  | GitHub       |
|--------------|------------------------|--------------|
| Chaewon Kim  | Full-stack developer   | [junooou](https://github.com/junooou) |
| [Name]       | Machine Learning       | [GitHub]     |
| [Name]       | Frontend               | [GitHub]     |
