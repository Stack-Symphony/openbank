const fetch = require('node-fetch'); // Install with: npm install node-fetch@2

const login = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        saIdNumber: '8001869705645',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Response from backend:');
    console.log(data);

    if (data.success) {
      console.log(' Login successful!');
      console.log('Token:', data.data.token);
    } else {
      console.log(' Login failed:', data.message);
    }

  } catch (error) {
    console.error('Error connecting to backend:', error.message);
  }
};

login();
