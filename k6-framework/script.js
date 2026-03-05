import { check } from 'k6';
import http from 'k6/http';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    vus: 50,
    duration: '10s',
  };

export default function () {
  const res = http.get('http://test.k6.io/');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}

export function handleSummary(data) {
    return {
      stdout: textSummary(data, { indent: " ", enableColors: true }),
      "./test_summary.json": JSON.stringify(data),
    };
  }
  
