const { formatISO, endOfDay, startOfDay } = require('date-fns');

const formatDateFront = (dateFront) => {
  const [day, mounth, year] = dateFront.split('-');

  return formatISO(new Date(year, mounth - 1, day, 0, 0, 0));
};

const formatDatesFE = (initialDate, finalDate) => {
  const finalDate_ = finalDate ? finalDate : initialDate;
  const formmatedInitialDate = startOfDay(
    new Date(formatDateFront(initialDate))
  );
  const formmatedFinalDate = endOfDay(new Date(formatDateFront(finalDate_)));
  return [formmatedInitialDate, formmatedFinalDate];
};

module.exports = { formatDatesFE };
