
# Backend Setup Instructions

To set up the backend for sentiment analysis, create a separate Node.js project:

## Backend Structure

```
backend/
├── server.js
└── package.json
```

## package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sentiment": "^5.0.2",
    "cors": "^2.8.5"
  }
}
```

## server.js
```js
const express = require("express");
const cors = require("cors");
const sentiment = require("sentiment");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/sentiment", (req, res) => {
  const { text } = req.body;
  const result = sentiment(text);
  res.json({
    sentiment: result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral",
    confidence: Math.min(1, Math.abs(result.comparative))
  });
});

app.listen(5000, () => console.log("API running on http://localhost:5000"));
```

## Setup Instructions

1. Create a new directory for the backend
2. Run `npm install` in the backend directory
3. Run `npm start` to start the backend server
4. The frontend will automatically fall back to demo mode if the backend is not available
