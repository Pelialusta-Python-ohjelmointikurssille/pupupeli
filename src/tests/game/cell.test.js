const { test } = require('@jest/globals');
const { expect } = require('@jest/globals');
import { Cell } from "../../game/cell";

test('Returns hello world', () => {
  let cell = new Cell(0, 1);

  expect(cell.x).toBe(0);
  expect(cell.y).toBe(1);
});