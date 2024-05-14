const { test } = require('@jest/globals');
const { expect } = require('@jest/globals');
const helloworld = require('../helloworld');

test('Returns hello world', () => {
  expect(helloworld()).toBe("Hello world!");
});