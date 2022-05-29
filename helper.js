const pluralize = require('pluralize')
const capitalizeWord = (str) => {
  const firstLetter = str.charAt(0);
  const remainder = str.slice(1);
  return `${firstLetter.toUpperCase()}${remainder}`;
};

const pluralizeWord = (str) => pluralize(str)

module.exports = {
  capitalizeWord,
  pluralizeWord,
};
