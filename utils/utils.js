function notRsvpList(list1, list2) {
  // Create a Set of emails from list2 for efficient lookup
  const emailsInList2 = new Set(list2.map((item) => item.email));

  // Filter list1 to find items whose email is not in list2
  const uniqueItems = list1.filter((item) => !emailsInList2.has(item.email));

  return uniqueItems;
}

// // Example usage:
// const list1 = [
//   { name: "Alice", email: "alice@example.com" },
//   { name: "Bob", email: "bob@example.com" },
//   { name: "Charlie", email: "charlie@example.com" },
// ];

// const list2 = [
//   { name: "David", email: "david@example.com" },
//   { name: "Bob", email: "bob@example.com" },
// ];

// const result = getUniqueEmails(list1, list2);
// console.log(result);

module.exports = {
  notRsvpList,
};
