export const scenariosConfig = {
  // scenarios.js
  smoke: {
    smoke_test: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '10s',
    },
  },
  spike: {
    spike_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 50 }, // ramp-up to 50 users
        { duration: '2m', target: 50 }, // stay at 50 users
        { duration: '1m', target: 200 }, // spike to 200 users
        { duration: '2m', target: 50 }, // scale down to 50 users
        { duration: '2m', target: 0 }, // ramp-down to 0 users
      ],
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
        { target: 2, duration: '10s' },
        { target: 5, duration: '20s' },
        { target: 5, duration: '20s' },
        { target: 0, duration: '10s' },
      ],
      preAllocatedVUs: 5,
    },
  },

  constant_vus: {
    vu_5_duration_2m: {
      executor: 'constant-vus',
      vus: 10,
      duration: '2m',
    },
  },

  custom_stress: {
    custom_stress_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
        { duration: '30m', target: 200 }, // stay at higher 200 users for 30 minutes
        { duration: '5m', target: 0 }, // ramp-down to 0 users
      ],
    },
  },

  constant_arrival_rate: {
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      duration: '30s',
      rate: 30,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 50,
    },
  },
  vu1d5m: {
    vu_1_duration_5m: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5m',
    },
  },
};
