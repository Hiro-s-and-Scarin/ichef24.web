export const initiateGoogleAuth = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://ichef24-api-3.onrender.com'}google/login`
}

export const initiateFacebookAuth = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://ichef24-api-3.onrender.com'}facebook/login`
}
