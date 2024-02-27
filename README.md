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
