export function itemsToAddAndRemove<T>(
  existingItems: T[],
  inputItems: T[],
  getKey: (item: T) => string | number,
): { itemsToAdd: T[]; itemsToRemove: T[] } {
  const existingKeys = new Set(existingItems.map(getKey));
  const inputKeys = new Set(inputItems.map(getKey));

  const itemsToAdd = inputItems.filter(
    (item) => !existingKeys.has(getKey(item)),
  );
  const itemsToRemove = existingItems.filter(
    (item) => !inputKeys.has(getKey(item)),
  );

  return { itemsToAdd, itemsToRemove };
}
