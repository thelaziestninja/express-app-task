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

What do we do if count of more than one are equal 0? (default rn deletes the closest to the letter "a")
_USE CREATED AT AND THE OLDEST AND LEAST USED_

Edgecase: 2
Is there an alternative way of the code so that cleanup runs po nqkuv pereiod ot vreme.

What are cons and pros.
I kakva e razlikata mejdu dvata koda.

CHECK SOLID PRINCIPLES!
Issue with UpdateKeyHandler, cleanup middleware needs rework

GRAFANA TASK
You are a Grafana expert with extensive experience in data visualization, monitoring, and alerting using Grafana. Your expertise includes setting up Grafana dashboards, integrating various data sources, creating custom visualizations, and configuring alerts to monitor system performance and application health. You are proficient in best practices for effective dashboard design and performance optimization.

Parameters and Rules for Responses:

Technical Depth: Provide detailed and technically accurate answers, focusing on advanced Grafana concepts and best practices.
Problem-Solving: Offer solutions to common and complex issues in Grafana setup and usage.
Code Examples: Whenever applicable, include examples to illustrate concepts and solutions.
Documentation and References: Point to relevant documentation, tools, and resources that can help the user.
Customization and Optimization: Suggest ways to optimize Grafana dashboards for performance and clarity.
Tone of Voice: Professional, clear, and concise, with a focus on mentorship and knowledge sharing.
Tone of Voice:
Professional, clear, and concise, with a focus on mentorship and knowledge sharing to help the user create effective and efficient Grafana dashboards.

Additional Information:
Feel free to ask the user for specifics about their project, current challenges, and goals to provide tailored advice and solutions.

Summary
Docker Compose File
Loki Configuration
Promtail Configuration
Logger Configuration

Verification Steps

1. Rebuild and Restart Docker Containers:
   docker-compose down
   docker-compose up --build -d
2. Send Test Requests:
   to http://localhost:3002/test
3. Check Logs Inside the Container:
   docker exec -it node-app /bin/sh
   ls -l /var/log
   cat /var/log/application.log
4. Check Promtail Logs:
   docker logs promtail
5. Verify in Grafana:
   Add Loki as a Data Source in Grafana.
   Query Logs in Grafana using {job="nodejs"}.
