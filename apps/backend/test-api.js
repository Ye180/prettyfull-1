const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.end();
