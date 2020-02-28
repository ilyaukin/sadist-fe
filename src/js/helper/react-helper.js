import ReactDom from "react-dom";

export function renderPage(element) {
  const wrapper = document.getElementById('container');
  return wrapper ? ReactDom.render(element, wrapper) : false;
}