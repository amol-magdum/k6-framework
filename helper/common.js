'strict mode';
export function getTimestamp() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let mill = date.getMilliseconds();

  month = (month < 10 ? '0' : '') + month;
  day = (day < 10 ? '0' : '') + day;
  hour = (hour < 10 ? '0' : '') + hour;
  min = (min < 10 ? '0' : '') + min;
  sec = (sec < 10 ? '0' : '') + sec;
  mill = (sec < 100 ? '0' : '') + sec;

  const timestamp =
    date.getFullYear() +
    month +
    day +
    '_' +
    hour +
    min +
    '_' +
    sec +
    '_' +
    mill;
  return timestamp;
}

////To generate a UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export function generateUUIDv4() {
  // Generates a RFC4122 version 4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function debugging(debug, res) {
  if (debug == 'true') {
    console.log(`status = ${JSON.stringify(res.status)}`);
    console.log(`body = ${JSON.stringify(res.body)}`);
  }
}

export function logging(
  res,
  url,
  body,
  username,
  password,
  expectedStatusCode,
) {
  if (res.status != expectedStatusCode) {
    if (!usernames.includes(username)) {
      console.log(`ERROR ------------------------------`);
      console.log(`timestamp       = ${getTimestamp()}`);
      console.log(`username        = ${JSON.stringify(username)}`);
      console.log(`password        = ${JSON.stringify(password)}`);
      console.log(`request url     = ${JSON.stringify(url)}`);
      console.log(`request body    = ${JSON.stringify(body)}`);
      console.log(`response status = ${JSON.stringify(res.status)}`);
      console.log(`response body   = ${JSON.stringify(res.body)}`);
      usernames.push(username);
    }
  }
}

export function getRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomStringUpperCase(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomStringLowerCase(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getRandomMonth() {
  const month = Math.floor(Math.random() * 11) + 1;
  return month < 10 ? '0' + month : '' + month;
}

export function getRamdomYear(min, max) {
  //Generated a number between Min and Mac. Used for setting DoB years
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomNumberString(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateRandomIp() {
  return (
    '192.168.' + `${generateMaxNumber(255)}` + '.' + `${generateMaxNumber(255)}`
  );
}

export function getRandomNumber(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateMaxNumber(max) {
  //Returns a value from 0 to the the number specified by Max
  return Math.floor(Math.random() * max);
}

export function getRandomAlphaNumericString(length) {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
