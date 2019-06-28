# LDAP Node.js

> Search users on OpenLDAP server using ldapjs and express.

Working with LDAP on dev environment isn't an easy thing, and especially when it comes to configuring an OpenLDAP only for development. So this project contains a simple implementation for users search feature from LDAP, and a docker environment for development based only on docker-compose, so there's no docker file.

The docker-compose has two services:

- dev: lunches the express application using nodemon by running the script `dev` into package.js.
- ldap: starts the OpenLdap server, adds the groups and users from `./ldif/directory.ldif`.

Both services working on the same network `ldap` network. So the ldapjs client on `dev` has access to ldap through this config:

```javascript
const client = ldap.createClient({
  url: "ldap://ldap:389"
});
```

## Starting the dev environment

To make thing more pleasant, I created a make file, so need to remember all docker commands to start your project. first of all, you necessitate to install the dependencies and start the dev server via docker-compose up, by typing:

```bash
make install
make dev
```

Hola! now you can request the user's search thought out the Rest API, via:

```bash
curl -X GET http://localhost:3000/users
```

Besides that, the search endpoint accepts `search` param query as cn filter for users search

```bash
curl -X GET http://localhost:3000/users\?search\=mo
```

## Bonus

### Generate a user password

```bash
docker exec ldap slappasswd -h {SSHA} -s admin
```
