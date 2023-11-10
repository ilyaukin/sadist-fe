/**
 * Scroll container to make element within it visible
 * @param element element
 * @param container container
 */
export function scrollToVisible(element: Element | null | undefined, container: Element | null | undefined) {
  if (container) {
    const containerRect = container?.getBoundingClientRect();
    const thisRect = element?.getBoundingClientRect();
    // vertically
    if (thisRect &&
        !( containerRect.top <= thisRect.top &&
            thisRect.top < containerRect.bottom )) {
      container.scrollTo({ top: container.scrollTop + thisRect.top - containerRect.top });
    }
    // horizontally
    if (thisRect &&
        !( containerRect.left <= thisRect.left &&
            thisRect.left < containerRect.right )) {
      container.scrollTo({ left: container.scrollLeft + thisRect.left - containerRect.left });
    }
  }
}