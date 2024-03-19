import { expect, fixture, html } from '@open-wc/testing';
import '../lib/wired-globe';
import '../lib/wired-marker';
import { WiredGlobe } from '../lib/wired-globe';
import { WiredMarker } from '../lib/wired-marker';

describe('wired-globe', () => {
  it('should update data points on slot change', async function () {
    const code = html`
      <wired-globe style="width: 900px;">
      </wired-globe>
    `
    const element = await fixture(code);

    const addItem = (name: string, coordinates: [number, number]) => {
      const item = new WiredMarker();
      item['data-id'] = { name, loc: { type: 'Point', coordinates } };
      item['data-name'] = 'aaa';
      item['data-value'] = 1;
      element.appendChild(item);
    }

    const removeItem = () => {
      while (element.hasChildNodes()) {
        element.lastChild!.remove();
      }
    }

    addItem('Moscow', [37.61556, 55.75222]);
    addItem('Paris', [2.3488, 48.85341]);
    await ( element as WiredGlobe ).updateComplete;

    let points = element.querySelectorAll('wired-marker');
    expect(points.length).to.be.equal(2);
    expect(( <HTMLElement>points[0] ).style.left).to.be.equal('550.604px');

    removeItem();
    addItem('Russia', [55.3947, 53.3846]);
    addItem('France', [2.8275, 47.0074]);
    await ( element as WiredGlobe ).updateComplete;

    points = element.querySelectorAll('wired-marker');
    expect(points.length).to.be.equal(2);
    expect(( <HTMLElement>points[0] ).style.left).to.be.equal('502.429px');
  });
})