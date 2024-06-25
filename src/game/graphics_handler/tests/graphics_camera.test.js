import { GraphicsCamera } from '../graphics_camera';
import { Vector2 } from '../../vector';

// Mock PIXI.Container and PIXI.Rectangle
const mockPIXIContainer = {
  position: { x: 0, y: 0 },
  pivot: { x: 0, y: 0 },
  rotation: 0,
  scale: { x: 1, y: 1 },
};

const mockPIXIRectangle = {
  width: 1024,
  height: 1024,
};

describe('GraphicsCamera', () => {
  let camera;

  beforeEach(() => {
    camera = new GraphicsCamera(mockPIXIContainer, mockPIXIRectangle, new Vector2(0, 0));
  });

  test('should initialize with the correct properties', () => {
    expect(camera.container).toBe(mockPIXIContainer);
    expect(camera.pixiScreen).toBe(mockPIXIRectangle);
    expect(camera.position).toEqual(new Vector2(0, 0));
    expect(camera.renderScale).toEqual(new Vector2(1, 1));
    expect(camera.screenCenter).toEqual(new Vector2(512, 512));
    expect(camera.zoomScale).toBe(1);
    expect(camera.rotation).toBe(0);
    expect(camera.minZoom).toBe(0.08);
    expect(camera.maxZoom).toBe(0.95);
    expect(camera.focusPaddingPercent).toBe(0.1);
    expect(camera.totalRenderScale).toBe(1);
  });

  test('should update position and associated variables correctly', () => {
    camera.position = new Vector2(100, 100);
    camera.updatePosition();

    expect(camera.totalRenderScale).toBe(1);
    expect(camera.container.pivot.x).toBe(100);
    expect(camera.container.pivot.y).toBe(100);
    expect(camera.container.rotation).toBe(0);
    expect(camera.container.scale).toBe(1);
  });

  test('should calculate total render scale correctly', () => {
    camera.zoomScale = 2;
    expect(camera.getTotalRenderScale()).toBe(2);
  });

  test('should move camera to a point', () => {
    const point = new Vector2(200, 200);
    camera.moveToPoint(point);

    expect(camera.position.x).toBe(200);
    expect(camera.position.y).toBe(200);
  });

  test('should focus on an area given its middle point and size', () => {
    const middle = new Vector2(500, 500);
    const size = new Vector2(400, 400);
    camera.focusOnAreaMiddle(middle, size);

    expect(camera.position).toEqual(middle);
  });

  test('should focus on an area given its top left and bottom right points', () => {
    const topLeft = new Vector2(100, 100);
    const bottomRight = new Vector2(300, 300);
    camera.focusOnArea(topLeft, bottomRight);

    expect(camera.position).toEqual(new Vector2(200, 200));
  });

  test('should set zoom correctly within bounds', () => {
    camera.setZoom(0.5);
    expect(camera.zoomScale).toBe(0.5);

    camera.setZoom(1.5);
    expect(camera.zoomScale).toBe(0.95);

    camera.setZoom(0.05);
    expect(camera.zoomScale).toBe(0.08);
  });
});

