TASK

create a express app which has two endpoints

The first piece of functionality is an in-memory stack (LIFO). This portion of the application should have two endpoints:
an endpoint to add an item to the stack
an endpoint to return the top item of the stack
requesting an item from the stack should also remove that item from the top of the stack
This process should be in-memory, so you don't need to worry about persisting the stack across restarts of the application.

The second piece of functionality is an in-memory key-value store that supports TTLs on the keys. Your interface should support:
adding a key to the store
setting a TTL should be optional to the client when adding the key
getting the value for a key
this should respect the TTL for the key if provided
deleting the value stored for a given key

The additional task is:

1. Value of the key should be able to be updated, ttl to my interpretation.
   --- Updating value of the key route has been added. TTL has it's default logic. (if it's mentioned only then changes).

2. New restriction. I have max 200 keys and to remove the ones that are not being used.
   --- I made changes the AddToStoreHandler (if >= maxKeys ) adding is not allowed. This allows me to have insurance instead of adding middleware to the router.

   --- added a property to the store type so that their count is counted. After that a new middleware will check their count and if it exceeds the threshold it cleanup starts running and it deletes the ones with the smallest count or if the is no count it deletes the oldest one by default.

The additional additional task:

Edgecase:1

What do if both both are on count 0?
default rn deletes the closest to letter "a"
USE CREATED AT AND THE OLDEST AND LEAST USED

Edgecase: 2
Is there an alternative way of the code so that cleanup runs po nqkuv pereiod ot vreme.

What are cons and pros.
I kakva e razlikata mejdu dvata koda.
