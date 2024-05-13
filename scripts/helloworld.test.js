const helloworld = require('./helloworld');

test('Returns hello world', () => {
  expect(helloworld()).toBe("Hello world!");
});