'strict mode';
/***************************************************************

PUT method 

k6 run -e TEST_TYPE=smoke .\Test_Scripts\PUT_Responce_test.js
****************************************************************/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { passrate } from '../helper/api.js';
import { thresholdsConfig } from '../options/thresholds.js';
import { scenariosConfig } from '../options/scenario.js';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';
import { debugging, logging } from '../helper/common.js';

const put_responce = new Trend('put_responce');

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
  var baseURL;

  // we can setup enviroment
  baseURL = 'https://fakerestapi.azurewebsites.net';

  const authorsParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log(data);

  var id = data[__VU - 1].id;

  console.log(id);

  const authorPutBody = JSON.stringify({
    id: `${id}`,
    title: 'Do Epic Shit',
    idBook: '2',
    firstName: 'Ankur',
    lastName: 'Warikoo',
  });

  console.log(authorPutBody);

  //Put method
  let updateAuthor = `${baseURL}/api/v1/Authors`;
  let res = http.put(`${updateAuthor}/${id}`, authorPutBody, authorsParams);

  put_responce.add(res.timings.duration);

  let Book_id = JSON.parse(res.body).idBook;
  let first_Name = JSON.parse(res.body).firstName;
  let last_Name = JSON.parse(res.body).lastName;

  console.log(
    `Updated author of id ${Book_id}'s author is ${first_Name} ${last_Name}`,
  );

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
    './test_results/PUT_Respose_test.json': JSON.stringify(data),
  };
}
