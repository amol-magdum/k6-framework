'strict mode';
/***************************************************************

 GET method  is used in the following :
k6 run -e TEST_TYPE=smoke .\Test_Scripts\Simple_GET_Respose.js
****************************************************************/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { thresholdsConfig } from '../options/thresholds.js';
import { scenariosConfig } from '../options/scenario.js';
import { debugging, logging } from '../helper/common.js';
import { passrate } from '../Helper/api.js';
import { SharedArray } from 'k6/data';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend } from 'k6/metrics';

const simple_GET_request = new Trend('simple_GET_request');

/**
 * Passing environment variables to the k6 Script.
 * In k6, the environment variables are exposed through a global __ENV variable, a JS object.
 *
 */
// Logic to pick which configuration to use
const debug = __ENV.debug || true;
const env = __ENV.url;
const testType = __ENV.TEST_TYPE || 'load';

// 2. Dynamically build the options object
export const options = {
  scenarios: scenariosConfig[testType],
  thresholds: thresholdsConfig[testType],
};

export default function () {
  //GET url
  let url = 'https://fakerestapi.azurewebsites.net/api/v1/Activities';
  let res = http.get(url);
  simple_GET_request.add(res.timings.duration);
  // checks
  check(res, {
    'GET https://fakerestapi.azurewebsites.net api status 200': r =>
      r.status === 200,
  });

  debugging(debug, res);
  passrate(res, 200);
  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    './test_results/Simple_GET_Respose.json': JSON.stringify(data),
  };
}
