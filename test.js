const axios = require('axios');
require('dotenv').config();

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY ='418e3a5e87msh6145e2b013769a6p1d13dajsna187c19ae9f6'

async function testJudge0() {
  try {
    const submission = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: 'print("Hello from Judge0")',
        language_id: 71, // Python 3
        stdin: ''
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );

    const token = submission.data.token;
    console.log('🔄 Submitted. Polling for result...');

    let result;
    do {
      await new Promise((r) => setTimeout(r, 1500));
      const res = await axios.get(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      result = res.data;
    } while (result.status.id <= 2); // In Queue or Processing

    const output = result.stdout
      ? result.stdout
      : result.stderr || result.compile_output || '[No Output]';

    console.log('✅ Output:', output);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testJudge0();
