# PROS

1. The cleanup issue with two fuctionalities resolves the possiblity of conflicts between cleanUp and ttl.
2. The application will have an optimised performance.
3. Code is simple and understandable.

# CONS

1. Cleanup issue I have two functionalities that clean the keys. ( ttl and cleanup )
   I cant be sure cleanup wont run while ttl is running.
   How do I resolve this issue?
   I ensured that cleanUp logic doesn't delete keys with an active TTL.\

2. There will be increased memory usage and possible unnecessary memory consumption because keeping keys with active ttl until their expiration, whilst they
   are not being used is taking space in RAM.
3. Managing between cleanup and ttl might become very hard as the application grows. (da kajem che vsichkite sa sus 100 dni ttl, none of them are being used, we are trying to create new ones, but we are not allowed because of no space. We will just
   have to wait)
4. More logic in cleanup, so it will be delayed.
