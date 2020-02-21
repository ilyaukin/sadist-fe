/**
 * return true if the value evaluated to true
 * and undefined otherwise
 *
 * this is the logic that `disabled` etc. props
 * of wired components follow
 * @param value
 * @returns {*}
 */
export const isVal = (value) => {
  if (value) {
    return true;
  }

  return undefined;
}
