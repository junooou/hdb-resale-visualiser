# HDB Resale Price Visualiser

This is a full-stack web application that allows users to explore historical HDB resale price trends across different towns in Singapore and view predicted price trends for the year 2029. The application includes an AI-generated buying suggestion based on forecasted trends.

This project was developed as part of NTU's SC2006 Software Engineering module.

---

## Features

- Users can select an HDB town from a dropdown list.
- The app displays a line chart with:
  - Historical resale price trends from 2000 to 2023.
  - A projected trend for 2029 based on logistic regression.
- Below the chart, a textual summary provides:
  - Predicted average resale price in 2029.
  - A data-driven buy/wait suggestion.

---

## Setup Instructions

### Frontend

Navigate to the `frontend` directory and run:

```bash
npm install
npm start
