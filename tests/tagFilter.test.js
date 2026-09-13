import test from "node:test";
import assert from "node:assert/strict";

import { buildTagFilterOptions } from "../src/utils/tagFilter.js";
import { accountActiveInPeriod } from "../src/utils/recurrence.js";

const tags = [
  { id: 1, nome: "Tag A" },
  { id: 2, nome: "Tag B" },
  { id: 3, nome: "Barbeiro" },
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

test("não exibe em setembro uma tag utilizada somente em agosto", () => {
  const accounts = [
    {
      recorrencia: "UNICA",
      dataInicio: "2026-08-15",
      dataFim: "2026-08-15",
      tags: [{ id: 3 }],
    },
    {
      recorrencia: "MENSAL",
      dataInicio: "2026-08-01",
      dataFim: "2026-12-01",
      tags: [{ id: 1 }],
    },
  ];
  const augustAccounts = accounts.filter((account) =>
    accountActiveInPeriod(account, "2026", "08")
  );
  const septemberAccounts = accounts.filter((account) =>
    accountActiveInPeriod(account, "2026", "09")
  );

  assert.deepEqual(buildTagFilterOptions(tags, augustAccounts), [
    { value: "", label: "Todas as tags" },
    { value: "1", label: "Tag A" },
    { value: "3", label: "Barbeiro" },
  ]);
  assert.deepEqual(buildTagFilterOptions(tags, septemberAccounts), [
    { value: "", label: "Todas as tags" },
    { value: "1", label: "Tag A" },
  ]);
});
