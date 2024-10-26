import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  } catch (error) {
    console.error('Gemini API başlatılamadı:', error);
    return false;
  }
};

export const generateRecipe = async (
  ingredients: string,
  mealType: string,
  peopleCount: string,
  cookingMethod: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Lütfen önce API anahtarını girin');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Lütfen şu bilgilere göre bir yemek tarifi oluştur:
    - Malzemeler: ${ingredients}
    - Öğün: ${mealType}
    - Kişi Sayısı: ${peopleCount}
    - Pişirme Yöntemi: ${cookingMethod}

    Tarifi şu formatta ver:
    1. Malzeme Listesi
    2. Hazırlama Süresi
    3. Pişirme Süresi
    4. Adım Adım Hazırlanışı
    5. Servis Önerisi
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Tarif oluşturma hatası:', error);
    throw new Error('Tarif oluşturulamadı. Lütfen tekrar deneyin.');
  }
};