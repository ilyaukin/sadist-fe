import React from 'react';
import equal from 'deep-equal';

/**
 * Helper hook to make a request. It's in charge of
 * - queuing, i.e. requests won't be made concurrently
 * - throttling, i.e. when user triggers multiple requests
 * (for example, by typing in search box), unnecessary requests
 * are skipped
 * - making requests in a transition
 * - preventing repetitive requests with the same parameters,
 * unless `refresh` is true
 *
 * @param request any request data
 * @param callback function that makes request
 * @param dependencies of the request
 * @param refresh if request with the same parameters should be made
 * @return if request is currently being made
 */
export function useQueuedRequest<R>(
    request: R,
    callback: (r: R) => Promise<any>,
    dependencies: React.DependencyList,
    refresh: boolean = false
): boolean {
  const queue = React.useRef<R[]>([]);
  const requested = React.useRef<R | undefined>();

  const [isTransition, setTransition] = React.useState(false);

  // in the 1st effect we queue request;
  // queue length in each time no longer than 1
  React.useEffect(() => {
    if (queue.current.length < 1) {
      queue.current.push(request);
    } else {
      queue.current[0] = request;
    }
  }, dependencies);

  // in the 2nd effect we do the request unless we're
  // currently doing one
  React.useEffect(() => {
    if (isTransition) {
      return;
    }

    const r = queue.current.shift();
    if (!r || ( !refresh && equal(requested.current, r) )) {
      // request is not requested or equal to the previous
      return;
    }

    requested.current = r;
    setTransition(true);
    callback(r)
        .then(() => setTransition(false))
        .catch((e) => {
          setTransition(false);
          throw e;
        });
  }, [...dependencies, isTransition]);

  return isTransition;
}