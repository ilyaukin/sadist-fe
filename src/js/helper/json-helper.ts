import giztselect from '@gizt/selector';

export function select(selector?: string, object?: any): any {
  if (!selector || !object) {
    return null;
  }

  try {
    return giztselect(selector, object);
  } catch (e) {
    console.error(`Fail select ${selector} on ${JSON.stringify(object)}`, e);
    return null;
  }
}