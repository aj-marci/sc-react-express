const express = require('express');
const cors = require('cors');  
require('dotenv').config({ path: __dirname + '/../.env' });const fs = require('fs'); // since my .env is nested in parent /server path
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const BASE_URL = 'https://api.safetyculture.io';


// routes
app.get('/', (req, res) => {
  res.send('AJs JOHNSON ELECTRIC SERVER');
});

// johnson electric issues fetching, parsing, converting to .csv handler function
app.get('/export-issues', async (req, res) => {
  console.log('➡️  /export-issues route hit');

  try {
    // 1️⃣ fetchinig issues
    console.log('Fetching issues from SafetyCulture...');
    const issuesResponse = await fetch(`${BASE_URL}/feed/issues`, {
      headers: {
        Authorization: `Bearer ${process.env.JOHN_ELEC_SUDO_TOKEN}`,
      },
    });

    if (!issuesResponse.ok) {
      const text = await issuesResponse.text();
      console.error('❌ Issues fetch failed:', text);
      return res.status(issuesResponse.status).json({ error: 'Failed to fetch issues' });
    }

    const issuesJson = await issuesResponse.json();
    const issues = issuesJson.data || [];
    console.log(`Fetched ${issues.length} issues`);

    // 2️⃣ fetching assignees and timeline items
    console.log('Fetching all issue assignees...');
    const assigneesResponse = await fetch(`${BASE_URL}/feed/issue_assignees`, {
      headers: { Authorization: `Bearer ${process.env.JOHN_ELEC_SUDO_TOKEN}` },
    });

    if (!assigneesResponse.ok) {
      const text = await assigneesResponse.text();
      console.error('❌ Assignees fetch failed:', text);
      return res.status(assigneesResponse.status).json({ error: 'Failed to fetch assignees' });
    }

    const assigneesJson = await assigneesResponse.json();
    const assigneesData = assigneesJson.data || [];
    console.log(`Fetched ${assigneesData.length} assignees`);

   
    console.log('Fetching issue timeline items...');
    const timelineResponse = await fetch(`${BASE_URL}/feed/issue_timeline_items`, {
      headers: { Authorization: `Bearer ${process.env.JOHN_ELEC_SUDO_TOKEN}` },
    });

    if (!timelineResponse.ok) {
      const text = await timelineResponse.text();
      console.error('❌ Timeline items fetch failed:', text);
      return res.status(timelineResponse.status).json({ error: 'Failed to fetch timeline items' });
    }

    const timelineJson = await timelineResponse.json();
    const timelineData = timelineJson.data || [];
    console.log(`Fetched ${timelineData.length} timeline items`);

    // 3️⃣ matching assignees and timeline "completed by" per issue
    const enrichedIssues = issues.map(issue => {
      
      const matchingAssignees = assigneesData
        .filter(a => a.issue_id === issue.id)
        .map(a => a.name)
        .join(', ');

      
      const completedTimelineItem = timelineData
        .filter(item =>
          item.item_type === 'TASK_STATUS_UPDATED' &&
          item.item_data === '450484b1-56cd-4784-9b49-a3cf97d0c0ad' && 
          item.task_id === issue.id
        )[0]; 

      const completedBy = completedTimelineItem ? completedTimelineItem.creator_name : '';

      return {
        title: issue.title,
        creator_user_name: issue.creator_user_name,
        completed_at: issue.completed_at,
        assignee: matchingAssignees,
        completed_by: completedBy,
      };
    });

    console.log('✅ Enriched issues with completed_by:', enrichedIssues);

    // 4️⃣ converting to CSV
    const fields = ['title', 'creator_user_name', 'completed_at', 'assignee', 'completed_by'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(enrichedIssues);

    
    const filePath = './issues.csv';
    fs.writeFileSync(filePath, csv);
    console.log(`📂 CSV written to ${filePath}`);

  
    res.download(filePath);

  } catch (error) {
    console.error('❌ Error exporting issues:', error);
    res.status(500).json({ error: 'Failed to export issues' });
  }
});


// on runtime
app.listen(PORT, () => {
  console.log(`JOHN ELEC Server is running on http://localhost:${PORT}`);
});
