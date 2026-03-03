'strict mode';
import { Rate } from 'k6/metrics';

const passRate200 = new Rate('Response_200');
const failRate400 = new Rate('Response_400');
const failRate500 = new Rate('Response_500');

export function passrate(res, expectedStatus) {
  if (!res) return;

  const containsErrorWord = checkBodyErrors(res.body);
  const isClientError = res.status >= 400 && res.status < 500;
  const isServerError = res.status >= 500;
  const isExpected = res.status === expectedStatus;

  passRate200.add(isExpected);
  failRate400.add(isClientError || (containsErrorWord && res.status < 500));
  failRate500.add(isServerError || (containsErrorWord && res.status >= 500));
}

export function checkBodyErrors(resBody) {
  const errorPatterns = [/{"Error":{"ErrorCode":\d+}}/];

  for (const pattern of errorPatterns) {
    if (pattern.test(resBody)) {
      console.log(`Detected Error in response body`);
      return true;
    }
  }

  return false;
}
