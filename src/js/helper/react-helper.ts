import { createRoot } from 'react-dom/client';

export function renderPage(element: JSX.Element) {
  const container = document.getElementById('container');
  return appendElement(element, container);
}

export function appendElement(element: JSX.Element, container: HTMLElement | null) {
  if (container) {
    const root = createRoot(container);
    return root.render(element);
  }
  return false;
}