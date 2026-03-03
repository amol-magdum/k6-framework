'strict mode';
/***************************************************************

 GET method with searchparams is used in the following :

 Command : k6 run --vus 1 --iterations 1 .\GET_with_serach_params.js -e env=test_env -e debug=true -e targetRate=1 -e duration1=1s -e duration2=1s --http-debug="full" --log-format raw

****************************************************************/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { passrate } from '../Helper/api.js';
import { thresholdsConfig } from '../options/thresholds.js';
import { scenariosConfig } from '../options/scenario.js';
import { SharedArray } from 'k6/data';
import { debugging, logging } from '../helper/common.js';
import { Trend } from 'k6/metrics';

const get_search_param = new Trend('get_search_param');

// Logic to pick which configuration to use
const env = __ENV.url;
const testType = __ENV.TEST_TYPE || 'load';
const debug = `${__ENV.debug}`;

// retrive data from json file
const data = new SharedArray('user data', function () {
  return JSON.parse(open('../test_data/authers.json')).authors;
});

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

  let url =
    'https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books';
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
