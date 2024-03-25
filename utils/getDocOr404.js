import { ResourceNotFoundError } from "../errors/resource.js";

/** If you're querying by id, set `getBy` to `{_id: value}`. You can't use
 * `id` if it's not set in your schema as it would be a virtual; you can't
 * query by virtuals.
 **/
const getDocOr404 = async (model, getBy) => {
  const doc = await model.findOne(getBy).exec();
  if (!doc) {
    let keys = Object.keys(getBy).join(", ");
    let vals = Object.values(getBy).join(", ");
    throw new ResourceNotFoundError(
      ```${model.collection.collectionName} with field(s) ${keys}
      matching value(s) ${vals} doesn't exist```
    );
  }
  return doc;
};

export { getDocOr404 };
