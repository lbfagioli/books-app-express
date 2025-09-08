import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    one: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '300s',
      duration: '5m',
      preAllocatedVUs: 1,
    },
    ten: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: `${300/10}s`,
      duration: '5m',
      preAllocatedVUs: 1,
    },
    hundred: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: `${300/100}s`,
      duration: '5m',
      preAllocatedVUs: 1,
    },
    thousand: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: `${300/1000}s`,
      duration: '5m',
      preAllocatedVUs: 1,
    },
    five_thousand: {
      executor: 'constant-arrival-rate',
      rate: 5000,
      timeUnit: `${300/5000}s`,
      duration: '5m',
      preAllocatedVUs: 1,
    },
  },
};

export default function () {
  http.get('http://localhost:80');
}