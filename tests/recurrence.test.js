import test from "node:test";
import assert from "node:assert/strict";

import {
  occurrenceValue,
  sumActiveInPeriod,
} from "../src/utils/recurrence.js";

const account = {
  id: 1,
  value: 120,
  recorrencia: "MENSAL",
  dataInicio: "2026-08-10",
  dataFim: "2026-10-10",
  valoresCompetencia: [{ competencia: "2026-09", value: 100 }],
};

test("usa o valor excepcional somente na competência correspondente", () => {
  assert.equal(occurrenceValue(account, "2026", "08"), 120);
  assert.equal(occurrenceValue(account, "2026", "09"), 100);
  assert.equal(occurrenceValue(account, "2026", "10"), 120);
});

test("mantém o valor padrão quando não há uma competência única", () => {
  assert.equal(occurrenceValue(account, "2026", ""), 120);
});

test("soma mensal usa o valor efetivo", () => {
  assert.equal(sumActiveInPeriod([account], "2026", "09"), 100);
});
