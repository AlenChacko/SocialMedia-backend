module.exports = {
  validateEmail: (email) => {
    return String(email)
      .toLowerCase()
      .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
  },
  validateLength: (text, min, max) => {
    if (text.length > max || text.length < min) {
      return false;
    } else {
      return true;
    }
  },
  validateWordCount: (text) => {
    return String(text).match(/^(?:\b\w+\b[\s\r\n]*){0,20}$/);
  },
};
