const loginButton = document.getElementById('loginButton');
const userProfileDiv = document.getElementById('user-profile');

loginButton.addEventListener('click', () => {
  const clientId = 'Ov23ligmx17E2tLS2ONA'; // You can also fetch this from your backend
  const redirectUri = 'http://localhost:3000/callback'; 

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  window.open(githubAuthUrl, 'GitHub Login', 'width=600,height=500');
});

// Handle the callback (this will be triggered after user authorization)
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

if (code) {
  fetch('http://localhost:3000/callback', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code: code })
  })
  .then(response => response.json())
  .then(userData => {
    if (userData.error) {
      console.error(userData.error);
      // Handle error 
    } else {
      // Update UI with user data
      userProfileDiv.innerHTML = `
        <h2>Welcome, ${userData.username}!</h2>
        <img src="${userData.avatarUrl}" alt="${userData.username}" width="50">
      `;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}