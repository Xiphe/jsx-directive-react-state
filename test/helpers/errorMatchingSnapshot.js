module.exports = function errorMatchingSnapshot() {
  return {
    asymmetricMatch(actual) {
      expect(actual).toEqual(expect.any(Error));
      expect(`${actual.message}\n${actual.codeFrame}`).toMatchSnapshot();
      return true;
    },
  };
};
