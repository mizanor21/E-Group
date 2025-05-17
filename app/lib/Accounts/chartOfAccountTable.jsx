// utils/buildAccountHierarchy.js
export const buildAccountHierarchy = (accounts) => {
  // Create a map of all accounts by their _id
  const accountMap = {};
  accounts.forEach(account => {
    accountMap[account._id] = { ...account, children: [] };
  });

  // Build the hierarchy
  const hierarchy = [];
  accounts.forEach(account => {
    if (account.parentAccount && accountMap[account.parentAccount]) {
      accountMap[account.parentAccount].children.push(accountMap[account._id]);
    } else if (!account.parentAccount) {
      hierarchy.push(accountMap[account._id]);
    }
  });

  return hierarchy;
};