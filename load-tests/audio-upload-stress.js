import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test simulating 1,000 concurrent speaking attempts
export const options = {
  stages: [
    { duration: '30s', target: 100 },  // ramp up to 100 virtual users
    { duration: '1m', target: 500 },   // ramp up to 500 VUs
    { duration: '2m', target: 1000 },  // peak at 1,000 concurrent users
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests must complete within 1.5s
    http_req_failed: ['rate<0.01'],    // less than 1% error rate
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000/api/v1';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock_jwt_token_for_load_testing',
  };

  // 1. Request Pre-signed Audio Upload URL
  const presignPayload = JSON.stringify({
    fileType: 'audio/wav',
    durationSeconds: 5,
  });

  const presignRes = http.post(`${BASE_URL}/practice/pre-signed-url`, presignPayload, { headers });
  check(presignRes, {
    'presign status 200/201': (r) => r.status === 200 || r.status === 201,
  });

  // 2. Submit Practice Attempt for STT & Linguistic Scoring
  const attemptPayload = JSON.stringify({
    practiceType: 'SENTENCE',
    referenceId: 'mock-sentence-1',
    expectedText: 'Yesterday I finished implementing the authentication endpoints and wrote unit tests.',
    audioS3Key: 'mock/uploads/audio_sample_test.wav',
    durationSeconds: 4.5,
  });

  const attemptRes = http.post(`${BASE_URL}/practice/attempts`, attemptPayload, { headers });
  check(attemptRes, {
    'attempt submission success': (r) => r.status === 200 || r.status === 201,
    'has overallScore in response': (r) => r.json('data.overallScore') !== undefined || r.json('overallScore') !== undefined,
  });

  sleep(1);
}

