import { createListCollection as createCollection, ListCollection } from "@chakra-ui/react";

export const createListCollection = <T extends { id: string | number; type_name: string }>(
  data: T[]
): ListCollection<T> => {
  const collection: ListCollection = createCollection({
    items: data.map((item) => ({
      value: item.id,
      label: item.type_name,
    })),
  });
  return collection;
}
