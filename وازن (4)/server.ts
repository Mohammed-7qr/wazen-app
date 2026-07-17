import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized Gemini API client.");
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined or is placeholder. AI Assistant will run in fallback mock mode.");
}

// AI Advisor API Endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  const { transactions, budgets, goals, wallets, userName } = req.body;

  const prompt = `
أنت مستشار مالي ذكي وخبير متخصص في الثقافة المالية السعودية والخليجية، اسمك "مستشار وازن الذكي".
الرجاء تحليل البيانات المالية التالية للمستخدم ${userName || "عبدالرحمن محمد"}:

الرصيد الحالي والمحافظ:
${JSON.stringify(wallets || [], null, 2)}

المعاملات الأخيرة (الدخل والمصاريف):
${JSON.stringify(transactions || [], null, 2)}

الميزانيات المحددة والإنفاق الحالي:
${JSON.stringify(budgets || [], null, 2)}

الأهداف المالية الحالية:
${JSON.stringify(goals || [], null, 2)}

المطلوب منك هو تحليل هذه البيانات بدقة فائقة وتقديم تقييم مالي متكامل باللغة العربية الفصحى. يجب أن يتضمن التحليل:
1. نقاط القوة والضعف في سلوكه المالي.
2. تقييم مالي شامل (درجة من 100) بناءً على موازنة المصاريف مع الدخل والالتزام بالميزانية ومعدل الادخار الحالي.
3. قائمة بـ 3 نصائح عملية وذكية مخصصة وموجهة لنمطه لزيادة مدخراته.
4. كشف أي مخاطر مالية محتملة (مثال: مصاريف المطاعم عالية، نسبة الادخار أقل من 10%، السحب الزائد من بطاقة الائتمان).
5. توصية عامة ملهمة وداعمة لتحقيق أهدافه المالية والالتزام بالتحديات.

قم بصياغة الإجابة كاملة باللغة العربية وبصيغة JSON وفقاً للهيكل المطلوب.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { 
                type: Type.INTEGER, 
                description: "التقييم المالي العام من 100 كعدد صحيح" 
              },
              analysis: { 
                type: Type.STRING, 
                description: "تحليل عام وموجز ودقيق للوضع المالي الحالي باللغة العربية" 
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 نصائح مخصصة وعملية لزيادة الادخار وتقليص المصاريف باللغة العربية"
              },
              risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "مخاطر مالية تم كشفها (مثال: تزايد مصاريف المطاعم، تجاوز الميزانية، عدم الادخار الكافي) باللغة العربية"
              },
              recommendations: {
                type: Type.STRING,
                description: "توصية عامة ملهمة ومحددة لمساعدة المستخدم على بلوغ أهدافه وتحقيق التوازن المالي باللغة العربية"
              }
            },
            required: ["healthScore", "analysis", "tips", "risks", "recommendations"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        return res.json(JSON.parse(responseText.trim()));
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API error, falling back to smart Arabic mocked advice:", error);
      // Fallback is handled below
    }
  }

  // Fallback high-fidelity mocked response in Arabic based on user's actual data if possible
  const totalBalance = wallets?.reduce((sum: number, w: any) => sum + w.balance, 0) || 3250;
  const totalIncome = transactions?.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0) || 6000;
  const totalExpense = transactions?.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0) || 2450;
  const savingsRate = Math.round(((totalIncome - totalExpense) / (totalIncome || 1)) * 100);

  let healthScore = 75;
  let analysis = "وضعك المالي مستقر بشكل عام، ولكن هناك حاجة لضبط بعض النفقات المتكررة لزيادة نسبة الادخار.";
  let risks = [
    "مصاريف المطاعم والترفيه تشكل حوالي 25% من إجمالي نفقاتك الشهرية.",
    "الادخار الحالي ممتزج مع الحساب الجاري مما قد يدفعك للصرف منه دون وعي.",
    "ميزانية التسوق تجاوزت الحد المرسوم لها بنسبة 15% هذا الشهر."
  ];
  let tips = [
    "قم بإنشاء حصالة رقمية منفصلة للادخار وحوّل إليها 20% من دخلك فور استلام الراتب تلقائياً.",
    "استبدل تناول الطعام في الخارج بالوجبات المنزلية لمدة أسبوعين، وسيوفر لك هذا ما يقارب 400 ريال شهرياً.",
    "استخدم طريقة الأظرف الذكية أو المحافظ الرقمية لتقسيم ميزانية المشتريات والالتزام بها."
  ];
  let recommendations = "أنت تسير في الطريق الصحيح نحو تحقيق هدفك 'صندوق الطوارئ'! نوصيك بالالتزام بتحدي الميزانية المتبقي له 18 يوماً للحصول على مكافأة المستوى الخامس.";

  if (savingsRate < 10) {
    healthScore = 58;
    analysis = "نلاحظ أن نسبة ادخارك منخفضة جداً هذا الشهر (أقل من 10%). يتطلب وضعك إعادة تخطيط عاجلة لتقليل المصاريف الكمالية.";
  } else if (savingsRate >= 30) {
    healthScore = 88;
    analysis = "رائع جداً! أنت تحقق نسبة ادخار ممتازة تصل إلى 30% أو أكثر من دخلك الشهري. سلوكك المالي منضبط للغاية ومبشر بمستقبل مستقر.";
    risks = [
      "احتمالية بقاء مدخراتك دون استثمار يحميها من التضخم المالي.",
      "مخاطر بسيطة من انخفاض الحماس والالتزام بالتحديات الطويلة الأجل."
    ];
    tips = [
      "فكر في توجيه جزء من مدخراتك الحالية نحو صناديق استثمارية منخفضة المخاطر لنمو رأس مالك.",
      "استمر في تفعيل ميزة الاستقطاع التلقائي من الراتب الشهري.",
      "كافئ نفسك بمكافأة بسيطة وغير مكلفة عند إنهاء تحدي الشهر لتجديد الحماس المالي."
    ];
  }

  return res.json({
    healthScore,
    analysis,
    tips,
    risks,
    recommendations
  });
});

// AI Chat Endpoint for Direct Custom Queries
app.post("/api/gemini/chat", async (req, res) => {
  const { message, transactions, budgets, goals, wallets, userName } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const prompt = `
أنت "مستشار وازن المالي الذكي"، خبير مالي ذكي ودود ومتخصص في الثقافة المالية السعودية والخليجية.
يجيب هذا المستشار على استفسارات المستخدمين المالية ويوجههم لتحقيق التوازن والادخار بأسلوب مهني ومقنع.

بيانات المستخدم المالية الحالية لـ ${userName || "عبدالرحمن محمد"}:
- الرصيد الحالي والمحافظ: ${JSON.stringify(wallets || [])}
- الميزانيات: ${JSON.stringify(budgets || [])}
- الأهداف المالية: ${JSON.stringify(goals || [])}
- المعاملات الأخيرة: ${JSON.stringify(transactions || [])}

سؤال واستفسار المستخدم الحالي:
"${message}"

المطلوب منك:
1. الإجابة على استفسار المستخدم بالكامل وبشكل مخصص لبياناته المالية إن لزم الأمر.
2. استخدام لغة عربية فصحى مبسطة، دافئة وملهمة تناسب المجتمع السعودي (مع استخدام مصطلحات مثل: ريال، الاستقطاع التلقائي، الكماليات، صندوق الطوارئ).
3. تقديم نصائح عملية وخطوات واضحة وقابلة للتطبيق فوراً.
4. حافظ على إجابة منسقة وسهلة القراءة (استخدم الأسطر والفقرات والنقاط الواضحة والخط العريض عند الضرورة).

أجب مباشرة بنص الإجابة دون أي كود أو مقدمات برمجية.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (responseText) {
        return res.json({ response: responseText.trim() });
      } else {
        throw new Error("Empty response from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API error in chat endpoint, switching to fallback:", error);
    }
  }

  // Smart Arabic fallback based on keywords and user context
  const totalBalance = wallets?.reduce((sum: number, w: any) => sum + w.balance, 0) || 3250;
  const totalIncome = transactions?.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0) || 6000;
  const totalExpense = transactions?.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0) || 2450;
  const savingsRate = Math.round(((totalIncome - totalExpense) / (totalIncome || 1)) * 100);

  let responseText = "";
  const msgLower = message.toLowerCase();

  if (msgLower.includes("وفر") || msgLower.includes("توفير") || msgLower.includes("ادخار") || msgLower.includes("ادخر")) {
    responseText = `مرحباً بك يا ${userName || "عبدالرحمن"}! لتوفير المزيد من راتبك الحالي البالغ ${totalIncome.toLocaleString('ar-SA')} ريال، إليك خطة سريعة ومجربة من وازن:

1. **قاعدة 50/30/20 الذكية**:
   - **50% للاحتياجات الأساسية**: مثل الفواتير والإيجار والمقاضي الأساسية (${(totalIncome * 0.5).toLocaleString('ar-SA')} ريال).
   - **30% للمصاريف المرنة والكماليات**: مثل المطاعم والمقاهي والتسوق (${(totalIncome * 0.3).toLocaleString('ar-SA')} ريال).
   - **20% للادخار المباشر**: ننصحك بنقلها فوراً إلى محفظة الادخار الخاصة بك في وازن عند استلام الراتب (${(totalIncome * 0.2).toLocaleString('ar-SA')} ريال).

2. **الاستقطاع التلقائي**:
   تفعيل الحوالة التلقائية يوم نزول الراتب هو سر النجاح؛ لأن "ما تراه العين، تصرفه اليد".

3. **تفعيل تحديات وازن**:
   التزامك بالتحديات النشطة حالياً في تطبيق وازن سيساعدك على تحويل الادخار إلى لعبة ممتعة تكسب فيها نقاط خبرة (XP) وتصقل مهاراتك المالية!`;
  } else if (msgLower.includes("دين") || msgLower.includes("ديون") || msgLower.includes("قرض") || msgLower.includes("قروض")) {
    responseText = `أهلاً بك يا ${userName || "عبدالرحمن"}. التعامل مع الديون يتطلب خطة ذكية وثباتاً. إليك أفضل طريقتين للتخلص من القروض والالتزامات:

1. **طريقة كرة الثلج (Snowball Method)**:
   ابدأ بسداد الدين الأصغر قيمة أولاً مع دفع الحد الأدنى لبقية الديون. عند الانتهاء من الدين الأصغر، وجّه كامل المبالغ التي كنت تدفعها له لسداد الدين الذي يليه في الحجم وهكذا. تمنحك هذه الطريقة دافعاً نفسياً رهيباً للاستمرار!

2. **طريقة الانهيار الجليدي (Avalanche Method)**:
   ركز على سداد الدين ذي الفائدة الأعلى أولاً لتوفير أكبر قدر من الأموال على المدى الطويل، وهي الأفضل رياضياً من حيث التكلفة الكلية.

نصيحة وازن: تجنب تماماً استخدام بطاقات الائتمان للشراء الكمالي، وحاول تقليص مصاريف الترفيه لتوجيه الفائض لسداد الالتزامات أسرع.`;
  } else if (msgLower.includes("استثمار") || msgLower.includes("استثمر") || msgLower.includes("أسهم")) {
    responseText = `يا مرحباً يا ${userName || "عبدالرحمن"}. الاستثمار هو الخطوة الثانية بعد الادخار لتنمية ثروتك وحمايتها من التضخم المالي. قبل أن تبدأ بالاستثمار، تأكد من تنفيذ الآتي:

1. **صندوق الطوارئ أولاً**:
   تأكد من توفير مبلغ يغطي مصاريفك لمدة 3 إلى 6 أشهر في محفظة طوارئ آمنة ومستقلة قبل الدخول في أي قناة استثمارية.

2. **البداية بالصناديق الاستثمارية**:
   إذا كنت مبتدئاً، ننصحك بالاطلاع على الصناديق الاستثمارية المشتركة أو صناديق المؤشرات المتداولة (ETFs) والمحافظ الرقمية المرخصة من هيئة السوق المالية السعودية، فهي توفر تنوعاً كبيراً ومخاطر مدروسة مقارنة بالأسهم الفردية.

3. **الاستمرار والاستقطاع الشهري**:
   استثمر مبالغ صغيرة بشكل دوري (شهرياً مثلاً) للاستفادة من ميزة متوسط التكلفة وتجنب تقلبات السوق المفاجئة.`;
  } else if (msgLower.includes("ميزانية") || msgLower.includes("تخطيط") || msgLower.includes("تقسيم")) {
    responseText = `مرحباً يا ${userName || "عبدالرحمن"}. تخطيط الميزانية هو المفتاح الأساسي للتحكم بالمال بدلاً من أن يتسرب دون علمك!

بناءً على ميزانياتك الحالية، يبلغ معدل صرفك الحالي ${totalExpense.toLocaleString('ar-SA')} ريال من إجمالي دخلك البالغ ${totalIncome.toLocaleString('ar-SA')} ريال، وهو ما يعني أنك تدخر حوالي ${savingsRate}% من دخلك. هذا ممتاز ولكن يمكن تحسينه بالخطوات التالية:

1. **تحديد حد أقصى لكل فئة**:
   ادخل إلى صفحة "الميزانيات" في وازن وضع سقفاً شهرياً صارماً للكماليات (مثل المطاعم والتسوق).
2. **تتبع الصرف اليومي**:
   سجّل كل عملية فوراً في وازن لتراقب مؤشرات الاستهلاك وتتجنب المفاجآت بنهاية الشهر.
3. **مراجعة فواتير الاشتراكات**:
   ألغِ أي اشتراكات شهرية لا تستخدمها بانتظام (منصات بث، نوادي، تطبيقات... إلخ)، وستتفاجأ بحجم الوفر المالي!`;
  } else {
    responseText = `مرحباً بك يا ${userName || "عبدالرحمن"} في مركز استشارات وازن الذكي. 

بناءً على وضعك الحالي، رصيدك الإجمالي في المحافظ هو ${totalBalance.toLocaleString('ar-SA')} ريال. لقد قمت بصرف ${totalExpense.toLocaleString('ar-SA')} ريال من دخل قدره ${totalIncome.toLocaleString('ar-SA')} ريال خلال الفترة الأخيرة.

أنا هنا للإجابة على أي سؤال مالي يدور في ذهنك ومساعدتك على اتخاذ قرارات مالية حكيمة تلائم نمط حياتك. 

يمكنك سؤالي عن:
- كيف أضع خطة ميزانية مناسبة لراتبي؟
- ما هي الطريقة المثلى لسداد الديون والالتزامات؟
- كيف أبدأ الاستثمار بمبالغ بسيطة في السعودية؟
- نصائح مخصصة لتقليل مصاريف فئة معينة (مثل المطاعم أو التسوق).`;
  }

  return res.json({ response: responseText });
});

// Serve Vite dev server or static build assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for all routes in SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
