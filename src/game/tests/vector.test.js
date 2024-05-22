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
});