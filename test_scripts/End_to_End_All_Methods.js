'strict mode';
/***************************************************************

 GET, POST, PUT and DELETE methods 

 Command : 
powershell windows: $env:K6_WEB_DASHBOARD="true";$env:K6_WEB_DASHBOARD_PERIOD=3s;$env:K6_WEB_DASHBOARD_EXPORT='./test_results/End_to_End_All_Methods.html'; k6 run -e env=perf -e TEST_TYPE=vu1d5m .\Test_Scripts\End_to_End_All_Methods.js
linux: K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_HOST=localhost K6_WEB_DASHBOARD_PORT=4032 K6_WEB_DASHBOARD_PERIOD=1s K6_WEB_DASHBOARD_EXPORT=./End_to_End_All_Methods.html k6 run -e env=perf -e TEST_TYPE=vu1d5m .\Test_Scripts\End_to_End_All_Methods.js

 K6_WEB_DASHBOARD=true k6 run -e env=perf -e TEST_TYPE=vu1d5m ./test_scripts/End_to_End_All_Methods.js

localhost default: http://localhost:5665
if port changed: http://localhost:4032


$env:K6_WEB_DASHBOARD="true";$env:K6_WEB_DASHBOARD_PERIOD='3s';$env:K6_WEB_DASHBOARD_EXPORT='./test_results/End_to_End_All_Methods.html'; k6 cloud run -e env=perf -e TEST_TYPE=stress .\Test_Scripts\End_to_End_All_Methods.js

****************************************************************/
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { passrate } from '../helper/api.js';
import { thresholdsConfig } from '../options/thresholds.js';
import { scenariosConfig } from '../options/scenario.js';
import { cloud } from '../options/distribution.js';
import { SharedArray } from 'k6/data';
import {
  debugging,
  logging,
  getRandomStringLowerCase,
} from '../helper/common.js';
import { Trend } from 'k6/metrics';
import { environments } from '../helper/config.js';

/**
 * Passing environment variables to the k6 Script.
 * In k6, the environment variables are exposed through a global __ENV variable, a JS object.
 *
 */

// Logic to pick which configuration to use
const env = __ENV.env || 'perf';
const testType = __ENV.TEST_TYPE || 'load';
const debug = `${__ENV.debug}`;

/// custom metrics for individual API
const GET_duration = new Trend('Authors_GET_apis_duration');
const POST_duration = new Trend('Authors_POST_apis_duration');
const PUT_duration = new Trend('Authors_PUT_apis_duration');
const DELETE_duration = new Trend('Authors_DELETE_apis_duration');

// retrive data from json file
const data = new SharedArray('user data', function () {
  return JSON.parse(open('../test_data/authers.json')).authors;
});

//Select the config based on the envType
const currentConfig = environments[env];

// 2. Dynamically build the options object
export const options = {
  cloud: cloud,
  scenarios: scenariosConfig[testType],
  thresholds: thresholdsConfig[testType],
};

let url;
let res;
export default function () {
  // Common params
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Created local variables and assign fetched from external test data.
  // Make sure all this is in between default function() and also before request body
  var id = data[__VU - 1].id;
  var title = data[__VU - 1].title;
  var idBook = data[__VU - 1].idBook;
  var firstName = data[__VU - 1].firstName;
  var lastName = data[__VU - 1].lastName;

  // GET Method,
  group('GET Method', () => {
    url = `${currentConfig.baseUrl}/api/v1/Authors/authors/books`;
    res = http.get(`${url}/${idBook}`, params);

    GET_duration.add(res.timings.duration, { name: 'GET request' });

    check(res, {
      'GET https://fakerestapi.azurewebsites.net/api/v1/Authors/authors/books api status 200':
        r => r.status === 200,
    });

    debugging(debug, res);
    //    logging(res, url);
    passrate(res, 200);
    // sleep(1);
  });

  // POST Method
  group('POST Method', () => {
    const authorPostBody = JSON.stringify({
      id: `${id}`,
      title: `${title}`,
      idBook: `${idBook}`,
      firstName: `${firstName}`,
      lastName: `${lastName}`,
    });

    url = `${currentConfig.baseUrl}/api/v1/Authors`;
    res = http.post(url, authorPostBody, params);

    let Book_id = JSON.parse(res.body).idBook;
    let first_Name = JSON.parse(res.body).firstName;
    let last_Name = JSON.parse(res.body).lastName;

    // console.log(
    //   `New book id ${Book_id}'s author is ${first_Name} ${last_Name}`,
    // );

    POST_duration.add(res.timings.duration, { name: 'POST request' });

    check(res, {
      'POST https://fakerestapi.azurewebsites.net/api/v1/Authors is status 200':
        r => r.status === 200,
    });

    // debugging(debug, res);
    //    logging(res, url);
    passrate(res, 200);
    // sleep(1);
  });

  // PUT Method
  group('PUT Method', () => {
    const authorPutBody = JSON.stringify({
      id: `${id}`,
      title: `${title}_updated_${getRandomStringLowerCase(5)}`,
      idBook: `${idBook}`,
      firstName: `${firstName}_updated_${getRandomStringLowerCase(5)}`,
      lastName: `${lastName}_updated_${getRandomStringLowerCase(5)}`,
    });

    // console.log(authorPutBody);

    //Put method
    url = `${currentConfig.baseUrl}/api/v1/Authors`;
    res = http.put(`${url}/${id}`, authorPutBody, params);

    let Book_id = JSON.parse(res.body).idBook;
    let first_Name = JSON.parse(res.body).firstName;
    let last_Name = JSON.parse(res.body).lastName;

    // console.log(
    //   `Updated author of id ${Book_id}'s author is ${first_Name} ${last_Name}`,
    // );

    PUT_duration.add(res.timings.duration, { name: 'PUT request' });

    check(res, {
      'PUT https://fakerestapi.azurewebsites.net/api/v1/Authors is status 200':
        r => r.status === 200,
    });

    // debugging(debug, res);
    //    logging(res, url);
    passrate(res, 200);
    // sleep(1);
  });

  // DELETE Method
  group('DELETE Method', () => {
    url = `${currentConfig.baseUrl}/api/v1/Authors`;
    res = http.del(`${url}/${idBook}`, params);

    DELETE_duration.add(res.timings.duration, { name: 'DELETE request' });

    check(res, {
      'DELETE https://fakerestapi.azurewebsites.net/api/v1/Authors/1 api status 200':
        r => r.status === 200,
    });

    // debugging(debug, res);
    //    logging(res, url);
    passrate(res, 200);
  });
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    './test_results/End_to_End_All_Methods.json': JSON.stringify(data),
  };
}
