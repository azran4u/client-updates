import { mergeSchemas } from 'graphql-tools';
import { moSchema } from '../entities/parlament/mo/schema/mo.schema';
import { operationSchema } from '../entities/parlament/operation/schema/operation.schema';

const schemas = mergeSchemas({
  schemas: [operationSchema, moSchema],
});

export default schemas;
