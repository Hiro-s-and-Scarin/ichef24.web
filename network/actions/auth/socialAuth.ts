export const initiateGoogleAuth = async () => {
  // Redireciona para o endpoint de login do Google no backend
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://ichef24-api-3.onrender.com'}/google/login`
}

export const initiateFacebookAuth = async () => {
  // Redireciona para o endpoint de login do Facebook no backend
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://ichef24-api-3.onrender.com'}/facebook/login`
}

 