# parlament

1. subscription auto reconnect
2. wait for query to finish before re-subscribe
3. bounceTime incorrectly merges multiple actions
4. get all operations subscription keeps open with no need
5. concatMap vs switchMap - minimize the swithing time by using actions 
7. lack of typesafety
8. use new ngrx syntax - createAction, ofType, etc.
9. split one big effect to smaller reusable effects
10. invalidation - do we remove uneeded entities from store?
11. use immer.js for store immutability
12. check if selectors are memoized acording to content or state changes
13. detect changes in sub entities using selectors of their parents - less prone to updates misses
14. hasura provides live query so we get full update instaed of incremental one. The advantage is simpler handling of state synchronization
