export const getPaginationParams = (limit, page) => {
  const min = 1;
  const max = 100;

  if (min > limit) {
    limit = min;
  } else if (limit > max) {
    limit = max;
  }

  const skip = limit * (page - 1);

  return { skip, limit };
};
