# PROS

1. Code is simple and well structured. Files are well seperated and the structure with controller ->middleware ->routes ->app seems to be easily readable. Code provides granuallity and can be usefull if the application grows.

2. Sequence while adding in the store (GetStoreHandler): handler -> middleware -> route. The handler has hardcoded logic to check if more keys can be added. This way we take additional code that would have been added in the validate middleware and this way we don't have to call cleanup middleware while adding. It makes the request faster.

3. cleanup middleware -> By checking for active TTLs before deleting keys resolves the possiblity of conflicts between cleanUp and TTL. Keys with active TTL will not be mistakenly deleted. The application will have an optimised performance. The cleanup process avoids unnecessary deletions, thus resulting to faster responds.

4. Cleanup issue I have two functionalities that clean the keys. ( ttl and cleanup ) I can't be sure cleanup won't run while TTL is running.
   How did I resolve this issue?
   I ensured that cleanUp logic doesn't delete keys with an active TTL.

# CONS

1. Sequence while adding in the store (GetStoreHandler): handler -> middleware -> route. The handler has hardcoded logic to check if more keys can be added. This way we take additional code that would have been added in the validate middleware and this way we don't have to call cleanup middleware while adding. Users will have to wait until keys are deleted and there is space for new ones, by having other request like (UpdateKeyHandler) or (GetKeyHandler) ran. Managing between cleanup and ttl might become very hard as the application grows. (da kajem che vsichkite sa sus 100 dni ttl, none of them are being used, we are trying to create new ones, but we are not allowed because of no space. We will just have to wait)

   - Solution 1: have cleanUp run in some period of time (by customers choice) for the whole application (including keys with ttl and no ttl) so keys that are the least used don't clutter
   - Solution 2: Have a third middleware that checks if cleanup middleware has cleaned any keys that don't have TTL. If it hasn't start cleaning keys with the same logic least used/ oldest from the ones with ttl (PROS No 2)

2. Cleanup issue I have two functionalities that clean the keys. ( ttl and cleanup ) I can't be sure cleanup won't run while TTL is running.
   How did I resolve this issue?
   I ensured that cleanUp logic doesn't delete keys with an active TTL. This might result in increased memory usage and possible unnecessary memory consumption because keeping keys with active ttl until their expiration, whilst they are not being used is taking space in RAM (especially if the app has grown) (PROS No 4)
