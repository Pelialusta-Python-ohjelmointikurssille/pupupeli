import { Vector2 } from '../vector';

describe('Vector2', () => {
  it('should construct with given x and y', () => {
    const vector = new Vector2(1, 2);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
  });

  it('should calculate magnitude correctly', () => {
    const vector = new Vector2(3, 4);
    expect(vector.magnitude).toBe(5);
  });

  it('should set value correctly', () => {
    const vector = new Vector2(1, 2);
    vector.SetValue(3, 4);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(4);
  });

  it('should calculate distance to another vector correctly', () => {
    const vector1 = new Vector2(1, 2);
    const vector2 = new Vector2(4, 6);
    expect(vector1.DistanceTo(vector2)).toBe(5);
  });

  it('should convert to string correctly', () => {
    const vector = new Vector2(1, 2);
    expect(vector.ToString()).toBe('Vector2(1, 2)');
  });

  it('should return a new vector multiplied by the given multiplier', () => {
    const vector = new Vector2(2, 3);
    const multipliedVector = vector.MultipliedBy(2);
    expect(multipliedVector.x).toBe(4);
    expect(multipliedVector.y).toBe(6);
  });
  it('vector from direction works correctly', () => {
    const vectorUp = Vector2.FromDirection(0);
    expect(vectorUp.x).toBe(0);
    expect(vectorUp.y).toBe(-1);
    const vectorDown = Vector2.FromDirection(2);
    expect(vectorDown.x).toBe(0);
    expect(vectorDown.y).toBe(1);
    const vectorLeft = Vector2.FromDirection(3);
    expect(vectorLeft.x).toBe(-1);
    expect(vectorLeft.y).toBe(0);
    const vectorRight = Vector2.FromDirection(1);
    expect(vectorRight.x).toBe(1);
    expect(vectorRight.y).toBe(0);
  });
});