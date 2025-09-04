import { api } from "@/src/lib/api/api";

export async function getFreePlanStatus(): Promise<{ success: boolean; data: { hasUsedFreePlan: boolean; canCreateFreePlan: boolean } }> {
  try {
    const response = await api.get('/plans/free-status');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { 
      success: false, 
      data: { hasUsedFreePlan: false, canCreateFreePlan: true } 
    };
  }
}

export async function getUserPlanStatus(): Promise<{ success: boolean; data: any }> {
  try {
    const response = await api.get('/plans/user-status');
    // O backend retorna false se não tem plano ou o objeto do plano se tem
    const planData = response.data.data;
    return { success: true, data: planData };
  } catch (error) {
    return { 
      success: false, 
      data: null 
    };
  }
}

