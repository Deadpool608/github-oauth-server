const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/callback'; // Replace with your actual frontend URL

app.get('/login', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', 
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      }),
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = response.data.access_token; 
    // **Simulate user data retrieval (replace with actual API call)**
    const userData = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`
      }
    });

    // **Store user data (in-memory for this example)**
    // In a real application, you would store this data in a database
    const user = { 
      id: userData.data.id, 
      username: userData.data.login, 
      avatarUrl: userData.data.avatar_url 
    }; 

    // **Send user data to the frontend (you'll handle this in your frontend code)**
    res.json(user); 

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

const port = 3000; 
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});