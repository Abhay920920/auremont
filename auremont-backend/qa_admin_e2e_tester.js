// qa_admin_e2e_tester.js
const axios = require('axios');

const API_URL = 'http://127.0.0.1:3001';

async function runAdminQA() {
  console.log('\nStarting ADMIN QA End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, expected, actual) => {
    if (condition) {
      console.log(`✅ PASS: [${testName}]`);
      passed++;
    } else {
      console.log(`❌ FAIL: [${testName}] | Expected: ${expected} | Actual: ${actual}`);
      failed++;
    }
  };

  try {
    // Test 1: Accessing Admin Route without ANY token
    try {
      await axios.get(`${API_URL}/admin/dashboard/metrics`);
      assert(false, 'RBAC Security: No Token Access', '401 Unauthorized', '200 OK');
    } catch (err) {
      assert(err.response?.status === 401, 'RBAC Security: No Token Access', '401', err.response?.status);
    }

    // Test 2: Accessing Admin Route with a fake Customer JWT (Simulating Customer Spoofing)
    try {
      await axios.get(`${API_URL}/admin/dashboard/metrics`, {
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.CustomerPayload.SpoofedSignature` }
      });
      assert(false, 'RBAC Security: Customer JWT Spoofing Blocked', '401 Unauthorized', '200 OK');
    } catch (err) {
      assert(err.response?.status === 401, 'RBAC Security: Customer JWT Spoofing Blocked', '401', err.response?.status);
    }

    // Test 3: POST to Admin Products (Write operation protection)
    try {
      await axios.post(`${API_URL}/admin/products`, { name: 'Hacked Product' });
      assert(false, 'RBAC Security: Product Creation Blocked', '401 Unauthorized', '201 Created');
    } catch (err) {
      assert(err.response?.status === 401, 'RBAC Security: Product Creation Blocked', '401', err.response?.status);
    }

    console.log(`\n=================================`);
    console.log(`ADMIN TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
    console.log(`=================================\n`);

  } catch (error) {
    console.error('Test suite execution failed:', error.message);
  }
}

runAdminQA();
