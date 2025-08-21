
export async function getFreePlanStatus(): Promise<{ success: boolean; data: { hasUsedFreePlan: boolean; canCreateFreePlan: boolean } }> {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch('/api/plans/free-status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar status do plano gratuito');
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Erro ao verificar status do plano gratuito:', error);
    return { 
      success: false, 
      data: { hasUsedFreePlan: false, canCreateFreePlan: true } 
    };
  }
}

