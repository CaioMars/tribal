const isEmailAddress = (email) => {
  if (!email) return false;

  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const trimToLength = (str, length) => {
  if (str.length > length) return str.slice(0, length) + "...";
  return str;
};

function stripEmailAddress(email) {
  return email.replace(/[^a-z0-9_\-@.]/gi, "").toLowerCase();
}

const stripNumber = (str) => str.toString().replace(/[^0-9]+/g, "");

const isPhoneNumber = (number) => {
  number = stripNumber(number);
  if (number.length === 11) {
    let split = number.split("");
    if (split[0] === split[1] && split[1] === split[2]) return false;
    else if (split[3] == 0) return false;
    return true;
  }
  return false;
};

const formatPhoneNumber = (number) => {
  number = stripNumber(number);
  let split = number.split("");
  if (split.length === 11)
    return `(${split[0]}${split[1]}${split[2]}) ${split[3]}${split[4]}${split[5]}${split[6]}-${split[7]}${split[8]}${split[9]}${split[10]}`;
  return number;
};

export {
  isEmailAddress,
  trimToLength,
  stripEmailAddress,
  stripNumber,
  isPhoneNumber,
  formatPhoneNumber,
};
