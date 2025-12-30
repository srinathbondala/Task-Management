/**
 * Trim text to a specific number of words
 * @param {string} text
 * @param {number} limit
 * @returns {string}
 */
const trimTextByWords = (text = '', limit = 10) => {
  if (!text) return '';

  const words = text.split(/\s+/);
  return words.length > limit
    ? words.slice(0, limit).join(' ') + '...'
    : text;
};

/**
 * Format task list response
 * - trims description
 * - keeps other fields untouched
 * @param {Array} tasks
 * @param {number} descLimit
 * @returns {Array}
 */
const formatTasksResponse = (tasks = [], descLimit = 10) => {
  return tasks.map(task => ({
    ...task,
    description: trimTextByWords(task.description, descLimit),
  }));
};

module.exports = {
  trimTextByWords,
  formatTasksResponse,
};
