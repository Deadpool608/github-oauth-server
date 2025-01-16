const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 

app.use(cors()); 
app.use(express.json()); 

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const redirectUri = 'https://goaltrackerloginserver.netlify.app:3001/callback'; // Replace with your actual frontend callback URL

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
    // Here you would typically store the access token (e.g., in a database or session)

    res.send('Authentication successful! You can now close this window.'); 

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Authentication failed.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    console.log('Received GET request on /');
    res.send('Hello from the server!'); 
  });