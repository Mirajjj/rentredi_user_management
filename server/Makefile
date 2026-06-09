# Server tasks.
#
#   make db-get-users            # print the newest 10 users in Firebase RTDB
#   make db-get-users LIMIT=5    # print the newest 5

LIMIT ?= 10

.PHONY: db-get-users
db-get-users:
	node --env-file=.env scripts/db-get-users.js $(LIMIT)
