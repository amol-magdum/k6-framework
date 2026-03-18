'strict mode';
/***************************************************************

 GET method with searchparams is used in the following :

k6 run -e env=perf -e TEST_TYPE=smoke .\Test_Scripts\GET_serach_params.js

****************************************************************/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { passrate } from '../helper/api.js';
import { thresholdsConfig } from '../options/thresholds.js';
import { scenariosConfig } from '../options/scenario.js';
import { SharedArray } from 'k6/data';
import { debugging, logging } from '../helper/common.js';
import { Trend } from 'k6/metrics';
import { environments } from '../helper/config.js';

const get_search_param = new Trend('get_search_param');

// Logic to pick which configuration to use
const env = __ENV.env || 'perf';
const testType = __ENV.TEST_TYPE || 'load';
const debug = `${__ENV.debug}`;

// retrive data from json file
const data = new SharedArray('user data', function () {
  return JSON.parse(open('../test_data/authers.json')).authors;
});

//Select the config based on the envType
const currentConfig = environments[env];

// 2. Dynamically build the options object
export const options = {
  scenarios: scenariosConfig[testType],
  thresholds: thresholdsConfig[testType],
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let idBook = data[__VU - 1].idBook;

  //GET url

  let url = `${currentConfig.baseUrl}/api/v1/Authors/authors/books`;
  let res = http.get(`${url}/${idBook}`, params);

  get_search_param.add(res.timings.duration);

  // checks
  check(res, {
    'GET https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books api status 200':
      r => r.status === 200,
  });

  debugging(debug, res);
  passrate(res, 200);
  // sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    './test_results/GET_serach_params.json': JSON.stringify(data),
  };
}
