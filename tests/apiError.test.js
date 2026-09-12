import test from "node:test";
import assert from "node:assert/strict";

import { apiErrorMessage } from "../src/utils/apiError.js";

const fallback = "Não foi possível concluir a operação.";

test("substitui mensagens técnicas genéricas por uma mensagem em português", () => {
  const error = { response: { data: { error: "Not Found" } } };

  assert.equal(apiErrorMessage(error, fallback), fallback);
});

test("preserva a mensagem de negócio devolvida pela API", () => {
  const error = {
    response: { data: { error: "Lançamento não encontrado" } },
  };

  assert.equal(apiErrorMessage(error, fallback), "Lançamento não encontrado");
});

test("aceita o formato detail e usa fallback quando não há mensagem", () => {
  assert.equal(
    apiErrorMessage({ response: { data: { detail: "Dados inválidos" } } }, fallback),
    "Dados inválidos"
  );
  assert.equal(apiErrorMessage({}, fallback), fallback);
});
