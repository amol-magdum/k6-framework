'strict mode';
/*************************************************************
Command used in jenkins:

cd k6/test_result
mkdir -p test_results
export host=jenkins
export testRunDuration=${TestDuration}
export testType=nf
executionType=${executionType} node create_summary.js
******************************************************************/

const fs = require('fs');
const testRunDuration = process.env.testRunDuration;
const testType = process.env.testType;
const executionType = process.env.executionType;

/// <--- Gather data from all the test result files

var results = [];

results.push(
  getTestMetric('End_to_End_All_Methods.json', 'Authors_DELETE_apis_duration'),
);
results.push(
  getTestMetric('End_to_End_All_Methods.json', 'Authors_GET_apis_duration'),
);
results.push(
  getTestMetric('End_to_End_All_Methods.json', 'Authors_POST_apis_duration'),
);
results.push(
  getTestMetric('End_to_End_All_Methods.json', 'Authors_PUT_apis_duration'),
);

///<--- Create summary output and write to file
let output =
  'Timestamp, Scenario, metric, 200, 400, 500, min, med, max, avg, p(90), p(95), Iterations, Calls Per Min, executionType, \n';
results.forEach(r => {
  let r2 =
    r.substring(0, r.length - 1) +
    executionType +
    ', ' +
    r.substring(r.length - 1);
  output = output + r2;
});

fs.writeFileSync(`./test_results/00_all_scripts.csv`, output);

//// --------------- functions -------------------------

function getTestResult(testName, multiplyIterationsBy, divideDurationFrom) {
  var s = '';
  var result;
  setUp(testName);

  try {
    result = JSON.parse(fs.readFileSync(`${folder}/${testName}`));
    var vals = result.metrics.http_req_duration.values;
    var iterations = result.metrics.iterations.values.count;
    var callsPerMin = calculateCallsPerMin(
      iterations,
      multiplyIterationsBy,
      divideDurationFrom,
    );

    s = `${getTimeYYYYMMDDHHmm()}, ${testName.replace(
      '.json',
      '',
    )},${testName.replace('.json', '')}, ${
      result.metrics['Response_200'].values.passes
    }, ${result.metrics['Response_400'].values.passes}, ${
      result.metrics['Response_500'].values.passes
    }, ${vals['min']},${vals['med']},${vals['max']},${vals['avg']},${
      vals['p(90)']
    },${vals['p(95)']},${iterations},${callsPerMin}, \n`;
  } catch (err) {
    console.log('WARNING! - Problem with ' + testName + ' message: ' + err);
    s = `${getTimeYYYYMMDDHHmm()}, ${testName.replace(
      '.json',
      '',
    )}, "FAILED OR MISSING RESULTS DATA,0,0,0,0,0,0,0,0,0,0,0, \n`;
  }
  return s;
}

function getTestMetric(
  testName,
  metric,
  multiplyIterationsBy,
  divideDurationFrom,
) {
  var result,
    s = '';
  setUp(testName);

  try {
    result = JSON.parse(fs.readFileSync(`${folder}/${testName}`));
    var vals = eval(`result.metrics.${metric}.values`);
    var iterations = calculateMetricIterations(
      result.metrics.iterations.values.count,
      multiplyIterationsBy,
      divideDurationFrom,
    );
    var callsPerMin = calculateCallsPerMin(
      iterations,
      multiplyIterationsBy,
      divideDurationFrom,
    );

    s = `${getTimeYYYYMMDDHHmm()}, ${testName.replace(
      '.json',
      '',
    )}, ${metric}, ${result.metrics['Response_200'].values.passes}, ${
      result.metrics['Response_400'].values.passes
    }, ${result.metrics['Response_500'].values.passes}, ${vals['min']},${
      vals['med']
    },${vals['max']},${vals['avg']},${vals['p(90)']},${
      vals['p(95)']
    },${iterations},${callsPerMin}, \n`;
  } catch (err) {
    console.log('WARNING! - Problem with ' + testName + ' message: ' + err);
    s = `${getTimeYYYYMMDDHHmm()}, ${testName.replace(
      '.json',
      '',
    )}, "FAILED OR MISSING RESULTS DATA",0,0,0,0,0,0,0,0,0,0,0, \n`;
  }
  return s;
}

function setUp(testName) {
  // if (process.env.host == 'local') {
  //   folder = 'test_results';
  // } else if (process.env.host == 'jenkins') {
  //   folder = `/var/lib/jenkins/workspace/${testType}_${testName.replace(
  //     '.json',
  //     ''
  //   )}/k6/scripts_api/test_results`;
  // } else {
  //   console.log(`host name not found: ${process.env.host}`);
  // }

  folder = './test_results';
}

function getTimeYYYYMMDDHHmm() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  month = (month < 10 ? '0' : '') + month;
  day = (day < 10 ? '0' : '') + day;
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;

  const timestamp = date.getFullYear() + month + day + '_' + hour + min;
  return timestamp;
}

function calculateCallsPerMin(
  iterations,
  multiplyIterationsBy,
  divideDurationFrom,
) {
  if (multiplyIterationsBy > 0) {
    callsPerMin = (iterations * multiplyIterationsBy) / testRunDuration;
  } else if (divideDurationFrom > 0) {
    callsPerMin = iterations * (divideDurationFrom / testRunDuration);
  } else {
    callsPerMin = iterations / testRunDuration;
  }

  return callsPerMin;
}

function calculateMetricIterations(
  iterations,
  multiplyIterationsBy,
  divideDurationFrom,
) {
  if (multiplyIterationsBy > 0) {
    callsPerMin = iterations * multiplyIterationsBy;
  } else if (divideDurationFrom > 0) {
    callsPerMin = iterations * divideDurationFrom;
  } else {
    callsPerMin = iterations;
  }

  return callsPerMin;
}
