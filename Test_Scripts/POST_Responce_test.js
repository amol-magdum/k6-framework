'strict mode';
/***************************************************************

POST method 

k6 run -e TEST_TYPE=smoke .\Test_Scripts\POST_Respose_test.js
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

const post_responce = new Trend('post_responce');
// Logic to pick which configuration to use
const env = __ENV.url;
const testType = __ENV.TEST_TYPE || 'load';
const debug = `${__ENV.debug}`;

const data = new SharedArray('user data', function () {
  return JSON.parse(open('../test_data/authers.json')).authors;
});

// 2. Dynamically build the options object
export const options = {
  scenarios: scenariosConfig[testType],
  thresholds: thresholdsConfig[testType],
};

export default function () {
  var baseURL = 'https://fakerestapi.azurewebsites.net';

  const authorsParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  var id = data[__VU - 1].id;
  var title = data[__VU - 1].title;
  var idBook = data[__VU - 1].idBook;
  var firstName = data[__VU - 1].firstName;
  var lastName = data[__VU - 1].lastName;

  const authorPostBody = JSON.stringify({
    id: `${id}`,
    title: `${title}`,
    idBook: `${idBook}`,
    firstName: `${firstName}`,
    lastName: `${lastName}`,
  });

  console.log(authorPostBody);
  //Post method

  let url = `${baseURL}/api/v1/Authors`;
  let res = http.post(url, authorPostBody, authorsParams);
  post_responce.add(res.timings.duration);

  let Book_id = JSON.parse(res.body).idBook;

  let first_Name = JSON.parse(res.body).firstName;
  let last_Name = JSON.parse(res.body).lastName;

  console.log(`New book id ${Book_id}'s author is ${first_Name} ${last_Name}`);

  check(res, {
    'POST https://fakerestapi.azurewebsites.net/api/v1/Authors is status 200':
      r => r.status === 200,
  });

  debugging(debug, res);
  passrate(res, 200);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    './test_results/POST_Respose_test.json': JSON.stringify(data),
  };
}
