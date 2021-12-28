import * as express from 'express';

export function graphqlExtractOperationMiddleware(
  req: express.Request,
  res: express.Response,
  next,
) {
  const operationName = req.body?.operationName;
  const query: string = req.body?.query || req.query?.query;
  const isMutation =
    query.indexOf(`mutation ${operationName}`) !== -1;
  const isQuery = query.indexOf(`query ${operationName}`) !== -1;
  const isSubscription =
    query.indexOf(`subscription ${operationName}`) !== -1;
  let operationType: 'query' | 'mutation' | 'subscription';
  if (isQuery) operationType = 'query';
  if (isMutation) operationType = 'mutation';
  if (isSubscription) operationType = 'subscription';
  const subOperation = query
    .split(`${operationType} ${operationName}`)[1]
    .trim()
    .split('{')[1]
    .split('(')[0]
    .trim();

  if (operationName && operationType && subOperation) {
    req.graphql = { operationName, operationType, subOperation };
  }
  next();
}
