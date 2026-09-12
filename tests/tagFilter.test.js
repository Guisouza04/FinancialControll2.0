import test from "node:test";
import assert from "node:assert/strict";

import { buildTagFilterOptions } from "../src/utils/tagFilter.js";

const tags = [
  { id: 1, nome: "Tag A" },
  { id: 2, nome: "Tag B" },
  { id: 3, nome: "Tag C" },
];

test("exibe somente as tags utilizadas nos lançamentos do tipo", () => {
  const accounts = [
    { tags: [{ id: 1 }, { id: 2 }] },
    { tags: [{ id: 2 }] },
  ];

  assert.deepEqual(buildTagFilterOptions(tags, accounts), [
    { value: "", label: "Todas as tags" },
    { value: "1", label: "Tag A" },
    { value: "2", label: "Tag B" },
  ]);
});

test("exibe apenas Todas as tags quando o tipo não utiliza tags", () => {
  const accounts = [{ tags: [] }, {}];

  assert.deepEqual(buildTagFilterOptions(tags, accounts), [
    { value: "", label: "Todas as tags" },
  ]);
});

test("compara ids numéricos e textuais sem duplicar opções", () => {
  const accounts = [{ tags: [{ id: "2" }, { id: 2 }] }];

  assert.deepEqual(buildTagFilterOptions(tags, accounts), [
    { value: "", label: "Todas as tags" },
    { value: "2", label: "Tag B" },
  ]);
});
