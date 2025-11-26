export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  // Enable populate functionality
  populate: {
    '*': true,
  },
};
