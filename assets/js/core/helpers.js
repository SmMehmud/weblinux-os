/* =============================================
   helpers.js — DOM Utility Functions
   ============================================= */

/**
 * Query selector shorthand
 * @param {string} q - CSS selector
 */
const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

/**
 * Create element with properties and children
 * @param {string} t - tag name
 * @param {object} p - properties
 * @param {Array} c - children (elements or strings)
 */
const ce = (t, p = {}, c = []) => {
  const e = document.createElement(t);
  Object.assign(e, p);
  c.forEach(x => e.appendChild(
    typeof x === 'string' ? document.createTextNode(x) : x
  ));
  return e;
};
