import Transaction from "../transactions/transaction.model.js";

/**
 * @description Service to calculate total income, total expenses, and net balance.
 */
const getSummary = async (filters = {}) => {
  const query = {};
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  const stats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const result = {
    income: 0,
    expense: 0,
    balance: 0,
  };

  stats.forEach((item) => {
    if (item._id === "income") result.income = item.total;
    if (item._id === "expense") result.expense = item.total;
  });

  result.balance = result.income - result.expense;

  return result;
};

/**
 * @description Service to get category-wise totals.
 */
const getCategoryStats = async (filters = {}) => {
  const query = {};
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  return await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);
};

/**
 * @description Service to get monthly trends for income and expenses.
 */
const getTrends = async (filters = {}) => {
  const query = {};
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  return await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
};

/**
 * @description Service to fetch the 10 most recent transactions.
 */
const getRecentTransactions = async () => {
  return await Transaction.find()
    .sort({ date: -1 })
    .limit(10)
    .populate("createdBy", "name email");
};

export { getSummary, getCategoryStats, getTrends, getRecentTransactions };
