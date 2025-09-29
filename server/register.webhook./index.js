const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });const fs = require('fs'); // since my .env is nested in parent /server path
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// route to register webhook
app.get('/register-webhook', async (req, res) => {
  try {
    const response = await fetch('https://api.safetyculture.io/webhooks/v1/webhooks', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.SC_TOKEN}`
      },
      body: JSON.stringify({
        url: 'https://hooks.zapier.com/hooks/catch/24763366/u1legww/',
        trigger_events: ['TRIGGER_EVENT_TRAINING_COURSE_COMPLETED']
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
    console.log("response", data);
  } catch (err) {
    console.error('Error registering webhook:', err);
    res.status(500).json({ error: 'Failed to register webhook' });
  }
});

// base route
app.get('/', (req, res) => {
  res.send('SC Webhook Registration Server is running 🚀');
});

// on runtime
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
