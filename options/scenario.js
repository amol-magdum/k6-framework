// scenarios.js
export const scenariosConfig = {
  smoke: {
    smoke_test: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '10s',
    },
  },
  load: {
    load_test: {
      executor: 'constant-arrival-rate',
      rate: 5,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 5,
    },
  },
  stress: {
    stress_test: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      stages: [
        { target: 50, duration: '2m' },
        { target: 50, duration: '5m' },
        { target: 0, duration: '2m' },
      ],
      preAllocatedVUs: 50,
    },
  },
};
