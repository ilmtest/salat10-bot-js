/**
 * The purpose of this function is so that the functions in controllers don't have to do
 * ```
 * try {...} catch (err) { next(err) }
 * ```
 * everywhere. And instead can just put whatever is in the body of the `try`, and this
 * function will simply call the next with the error automatically.
 * @param {*} fn
 */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
