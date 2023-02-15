import ReactDom from "react-dom";

export function renderPage(element: JSX.Element) {
  const wrapper = document.getElementById('container');
  return wrapper ? ReactDom.render(element, wrapper) : false
}

export function appendElement(element: JSX.Element, container: ReactDom.Container | null) {
  return ReactDom.render(element, container);
}
