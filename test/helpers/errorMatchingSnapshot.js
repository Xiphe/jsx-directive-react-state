const stripAnsi = require('strip-ansi');

module.exports = function errorMatchingSnapshot() {
  return {
    asymmetricMatch(actual) {
      expect(actual).toEqual(expect.any(Error));
      expect(
        stripAnsi(`${actual.message}\n${actual.codeFrame}`),
      ).toMatchSnapshot();
      return true;
    },
  };
};
