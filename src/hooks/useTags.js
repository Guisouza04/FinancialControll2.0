import { useState, useEffect, useCallback, useRef } from "react";
import financeService from "../services/financeService";

/**
 * Hook para gerenciar as tags do usuário (categorização de lançamentos).
 * Tags são globais ao usuário (não por tipo), então este hook busca a lista
 * uma vez e expõe as operações de CRUD.
 *
 * @returns {{
 *   tags: Array<{id:number, nome:string, cor:string}>,
 *   loading: boolean,
 *   addTag: (data:{nome:string,cor:string}) => Promise<{success:boolean, data?, error?}>,
 *   editTag: (id:number, data:{nome:string,cor:string}) => Promise<{success:boolean, data?, error?}>,
 *   removeTag: (id:number) => Promise<{success:boolean, error?}>,
 * }}
 */
export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.fetchTags();
      if (!isMountedRef.current) return;
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar tags:", err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const addTag = async (data) => {
    try {
      const created = await financeService.createTag(data);
      setTags((prev) =>
        [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome))
      );
      return { success: true, data: created };
    } catch (err) {
      console.error("Erro ao criar tag:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao criar a tag",
      };
    }
  };

  const editTag = async (id, data) => {
    try {
      const updated = await financeService.updateTag(id, data);
      setTags((prev) =>
        prev
          .map((t) => (t.id === id ? updated : t))
          .sort((a, b) => a.nome.localeCompare(b.nome))
      );
      return { success: true, data: updated };
    } catch (err) {
      console.error("Erro ao atualizar tag:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao atualizar a tag",
      };
    }
  };

  const removeTag = async (id) => {
    try {
      await financeService.deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Erro ao excluir tag:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Erro ao excluir a tag",
      };
    }
  };

  return { tags, loading, addTag, editTag, removeTag };
};

export default useTags;
