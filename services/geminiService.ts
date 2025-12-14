import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

const parseJSON = (text: string): any => {
  try {
    // Attempt to find a JSON block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Fallback: Try to find array brackets
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }

    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    return [];
  }
};

export const fetchLeads = async (domain: string): Promise<Lead[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    قوم بدور خبير استخراج بيانات ومحلل أعمال محترف. مهمتك هي العثور على عملاء محتملين وشركات منافسة بناءً على الدومين: "${domain}".

    يجب أن تستخدم Google Search بذكاء ومثابرة للبحث في:
    1. الشركات التي تستخدم نفس اسم الدومين ولكن بامتداات مختلفة (مثل .net, .org, .ae, .sa وغيرها).
    2. الشركات التي يحتوي رابط موقعها على جزء من اسم هذا الدومين.
    3. الشركات والمواقع المنافسة التي تعمل في نفس تخصص/مهنة الدومين "${domain}".

    *** تعليمات هامة جداً لاستخراج البريد الإلكتروني (CRITICAL EMAIL EXTRACTION): ***
    - المشكلة: أحياناً يتم تجاهل الإيميلات الموجودة في صفحات "Contact Us".
    - الحل المطلوب: عند العثور على شركة، ابحث **تحديداً** عن صفحة "اتصل بنا" أو "Contact Us" الخاصة بها في نتائج البحث.
    - استخدم استعلامات ضمنية مثل "site:${domain} email" أو "${domain} contact" أو "${domain} @".
    - ابحث عن الإيميلات الشائعة مثل info@, contact@, support@, sales@, hello@ المرتبطة بالدومين.
    - ابحث في حسابات التواصل الاجتماعي (Facebook, LinkedIn, Instagram, Twitter) الخاصة بالشركة، غالباً ما يكون الإيميل موجوداً في قسم الـ Bio أو About.
    - لا تُعد القيمة null إلا إذا استنفدت جميع محاولات البحث في الموقع وصفحات التواصل والادلة.

    المستهدف:
    حاول استخراج أكبر عدد ممكن من النتائج الحقيقية (نطمح لـ 50 نتيجة أو أكثر إذا أمكن).

    لكل نتيجة، يجب استخراج البيانات التالية بدقة:
    - اسم الشركة (Company Name)
    - الرابط الرئيسي للموقع (Website URL)
    - تخصص الشركة (Specialization)
    - الايميل الرسمي (Official Email) - *أولوية قصوى*.
    - اسم صاحب القرار/المدير (Decision Maker Name) - إذا توفر.
    - ايميل صاحب القرار (Decision Maker Email) - إذا توفر.
    - سبب التطابق (Why it matches): هل هو امتداد مختلف؟ أم منافس؟ أم اسم مشابه؟
    - نوع المصدر (Source Type): 'Similar Domain' | 'Competitor' | 'Partial Match' | 'Industry Match'

    تنسيق الإخراج:
    يجب أن تكون الإجابة **فقط** مصفوفة JSON تحتوي على الكائنات. لا تكتب أي مقدمات أو خاتمات.
    
    Format example:
    [
      {
        "companyName": "Tech Example Inc",
        "websiteUrl": "https://tech-example.net",
        "specialization": "Software Development",
        "officialEmail": "contact@tech-example.net",
        "decisionMakerName": "John Doe",
        "decisionMakerEmail": "john@tech-example.net",
        "matchReason": "Uses same domain name with .net extension",
        "sourceType": "Similar Domain"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const data = parseJSON(text);

    if (Array.isArray(data)) {
      return data as Lead[];
    } else {
      console.warn("API returned non-array JSON", data);
      return [];
    }
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
