const ldap = require("ldapjs");
const { promisify } = require("util");

const client = ldap.createClient({
  url: "ldap://ldap:389"
});

client.bind = promisify(client.bind);
client.search = promisify(client.search);
/**
 * Search users in LDAP directory
 * @name ldapSearch
 * @param cnSearch string - the cn value for the search filter
 * @return Promise
 */
module.exports = async function ldapSearch(cnSearch = "") {
  // The search options
  const opts = {
    filter: `(&(objectClass=person)(uid=${cnSearch ? `*${cnSearch}*` : "*"}))`,
    scope: "sub",
    attributes: ["db", "cn", "mail", "uid", "sn", "givenname"]
  };

  await client.bind("cn=admin,dc=example,dc=org", "admin");
  const search = await client.search("dc=example,dc=org", opts);
  const users = [];
  return new Promise((resolve, reject) => {
    search.on("searchEntry", function(entry) {
      const user = entry.object;
      users.push(user);
    });

    search.on("end", () => {
      return resolve(users);
    });

    search.on("error", function(error) {
      return reject(error);
    });
  });
};
