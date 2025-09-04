import { api } from "@/src/lib/api/api";

export async function getRecipeById(id: string): Promise<{ success: boolean; data: any; message?: string }> {
  try {
    const response = await api.get(`/recipes/${id}`);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { 
      success: false, 
      data: null, 
      message: error.response?.data?.message || 'Erro ao buscar receita' 
    };
  }
}



