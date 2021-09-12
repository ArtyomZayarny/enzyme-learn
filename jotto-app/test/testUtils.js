import checkPropTypes from "check-prop-types";
/*
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {string} val - value of data-test attribute for search
 * @returns  {ShallowWrapper}
 */

export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test='${val}']`);
};

export const checkProps = (component, confirminProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    confirminProps,
    "prop",
    component.name
  );
  expect(propError).toBeUndefined();
};
