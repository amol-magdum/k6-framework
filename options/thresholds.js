// thresholds.js
export const thresholdsConfig = {
  load: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    // For the custom Trend metrics
    Authors_GET_apis_duration: ['p(90)<500'],
    Authors_POST_apis_duration: ['p(90)<500'],
    Authors_PUT_apis_duration: ['p(90)<500'],
    Authors_DELETE_apis_duration: ['p(90)<500'],
  },
  stress: {
    http_req_duration: ['p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    // For the custom Trend metrics
    Authors_GET_apis_duration: ['p(90)<500'],
    Authors_POST_apis_duration: ['p(90)<500'],
    Authors_PUT_apis_duration: ['p(90)<500'],
    Authors_DELETE_apis_duration: ['p(90)<500'],
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
