const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const testScenarios = [
  {
    name: 'Login Endpoint',
    url: 'http://localhost:5000/api/auth/login',
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    connections: 10,
    duration: 30
  },
  {
    name: 'Get Accounts',
    url: 'http://localhost:5000/api/accounts',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer <token>'
    },
    connections: 20,
    duration: 30
  },
  {
    name: 'Create Transaction',
    url: 'http://localhost:5000/api/transactions',
    method: 'POST',
    body: JSON.stringify({
      amount: 100,
      type: 'transfer',
      description: 'Test transaction'
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <token>'
    },
    connections: 15,
    duration: 30
  }
];

async function runTests() {
  const results = [];
  
  for (const scenario of testScenarios) {
    console.log(`Running test: ${scenario.name}`);
    
    const result = await autocannon({
      url: scenario.url,
      method: scenario.method,
      body: scenario.body,
      headers: scenario.headers,
      connections: scenario.connections,
      duration: scenario.duration
    });
    
    results.push({
      scenario: scenario.name,
      ...result
    });
    
    console.log(`Completed: ${scenario.name}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.average}ms`);
    console.log('---');
  }
  
  // Save results to file
  fs.writeFileSync(
    path.join(__dirname, 'performance-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  // Generate report
  generateReport(results);
}

function generateReport(results) {
  console.log('\n=== PERFORMANCE TEST REPORT ===');
  results.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.scenario}`);
    console.log(`  Requests/sec: ${test.requests.average}`);
    console.log(`  Avg Latency: ${test.latency.average}ms`);
    console.log(`  P99 Latency: ${test.latency.p99}ms`);
    console.log(`  Total Requests: ${test.requests.total}`);
    console.log(`  Errors: ${test.errors}`);
  });
}

runTests().catch(console.error);