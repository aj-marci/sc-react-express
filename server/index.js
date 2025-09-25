const express = require('express');
const cors = require('cors');  
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('AJs SC app server');
});

app.get('/api/example', (req, res) => {
  res.json({ message: 'This is an example API endpoint' });
});

// SC ROUTES
// inspection data feeds to render unique audit_id's
app.get('/api/inspection-items', async (req, res) => {
  console.log('Fetching inspection items from SafetyCulture...');

  try {
    const response = await fetch('https://api.safetyculture.io/feed/inspection_items?archived=false&completed=true', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.SC_TOKEN}`,
      },
    });

    console.log(`SafetyCulture API response status: ${response.status}`);

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed response from SafetyCulture:', text);
      return res.status(response.status).json({ error: 'Failed to fetch inspection items' });
    }

    const data = await response.json();
    console.log(`Received ${data.objects?.length || 0} inspection items`);
    res.json(data);

  } catch (error) {
    console.error('Error during fetch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET specific inspection per audit_id
app.get('/api/inspection/:id', async (req, res) => {
  const inspectionId = req.params.id;
  console.log(`Fetching inspection details for ID: ${inspectionId}`);

  try {
    const response = await fetch(`https://api.safetyculture.io/inspections/v1/inspections/${inspectionId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.SC_TOKEN}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from SafetyCulture:', text);
      return res.status(response.status).json({ error: 'Failed to fetch inspection details' });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// on runtime
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
