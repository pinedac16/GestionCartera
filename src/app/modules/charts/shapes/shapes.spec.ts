import { tooltipPath } from './shapes';

const width = 70, height = 20, offset = 7, radius = 5;

describe('svg shapes', () => {

  it('tooltip top', () => {
    const d = tooltipPath(width, height, offset, radius, 'top');
    expect(d).toBeDefined();
  });

  it('tooltip left', () => {
    const d = tooltipPath(width, height, offset, radius, 'left');
    expect(d).toBeDefined();
  });

  it('tooltip bottom', () => {
    const d = tooltipPath(width, height, offset, radius, 'bottom');
    expect(d).toBeDefined();
  });

  it('tooltip right', () => {
    const d = tooltipPath(width, height, offset, radius, 'right');
    expect(d).toBeDefined();
  });

  it('tooltip right', () => {
    const d = tooltipPath(width, height, offset, radius, 'other' as any);
    expect(d).toBeDefined();
  });

});
