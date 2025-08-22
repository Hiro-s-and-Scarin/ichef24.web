
export async function getRecipeById(id: string): Promise<{ success: boolean; data: any; message?: string }> {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`/api/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar receita');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    throw error;
  }
}



