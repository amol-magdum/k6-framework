// thresholds.js
import { Rate, Trend } from 'k6/metrics';
const passRate200 = new Rate('Response_200');
const failRate400 = new Rate('Response_400');
const failRate500 = new Rate('Response_500');

// thresholds.js
export const thresholdsConfig = {
  load: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  stress: {
    http_req_duration: ['p(99)<1000'],
    http_req_failed: ['rate<0.05'],
  },
  soak: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.001'],
  },
  custom: {
    Response_200: ['rate<0.1'], // threshold on a custom metric
    Response_400: ['rate<0.005'], // threshold on a custom metric
    Response_500: ['rate<0.005'], // threshold on a custom metric
    http_req_duration: ['p(95) < 15000'], // threshold on a standard metric
    http_req_failed: ['rate < 0.01'],
  },
};
