const ALL_TAGS_OPTION = { value: "", label: "Todas as tags" };

export const buildTagFilterOptions = (tags, accounts) => {
  const usedTagIds = new Set();

  for (const account of Array.isArray(accounts) ? accounts : []) {
    for (const tag of Array.isArray(account.tags) ? account.tags : []) {
      if (tag?.id != null) usedTagIds.add(String(tag.id));
    }
  }

  const usedTags = (Array.isArray(tags) ? tags : []).filter((tag) =>
    usedTagIds.has(String(tag.id))
  );

  return [
    ALL_TAGS_OPTION,
    ...usedTags.map((tag) => ({ value: String(tag.id), label: tag.nome })),
  ];
};
