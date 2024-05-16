const { test } = require('@jest/globals');
const { expect } = require('@jest/globals');
const cell = require('../../game/cell');


test('Returns hello world', () => {
    expect(helloworld()).toBe("Hello world!");
  });