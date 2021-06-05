Live query with increamental updates (LQIU)

Suppose we query for all posts in a specified time range (from, to).
We have a Database table with every post as a row in the table.
Each row has updatedAt column.

The client subscribes (WS) to all the posts in the configured range which were updated after some date (aka cursor) (initial value = 1970).
After each result, the previous subscription is **replaced** by the client with a new one that has the updated cursor.

Each subscription's update has the following payload:<br>
ids[] - **ids only** for all posts that match the query **without** considiring the updatedAt in the query.<br>
updated[] - **ids only** for all posts that match the query and were updated after the cursor.

The client keeps in it's local store a copy of all posts that match the query. The initial posts store is an empty array.

For every update, the client does the following computation:

Compare the ids in the store (current) with the ids array in the update. Every id in ids that is not in the current state is removed from the store.

Every id in the updated ids array is considered as new or updated so we query it by id and update the store. It is also possible to send the whole data in the update payload. We need to find the maximum payload size allowed in an update. 

The subscription service listens to changes in the database table (using triggers or replicator PubSub) and runs the query for every connected client. There is only one query to the database for every client - select id, updatedAt where time in range.
The result is then parsed such that all ids are sent as ids array and all changes since cursor are computed in code.

Tha above mechanism is used mainly for root level entities. After we have those entities we may need to get linked entities. Every root level entity has an array of **linked entities ids**. For example comments for the post. 

The client keeps in it's local store a list of all comments that are linked to the posts in the query. The client runs over all posts and build an array of all comment's ids. The client subscribes to a service that keeps track of changes in comments. The subscription is for a specific list of ids of comments. The subscription service send for each update the following payload:<br>
updated: **array of ids** <br>
deleted: **array of ids**
The client removes from the store each comment that is in the deleted array. The client query by id all the comments that are in the updated array. The cleint resubscribes to the new list of comments ids.


