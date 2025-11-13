import { invokeLLM } from "./_core/llm";

/**
 * معالج الأوامر المحاسبية بالذكاء الاصطناعي
 */
export async function processAccountingCommand(message: string, userId: number) {
  try {
    // استخدام LLM لفهم الأمر وتحويله إلى إجراء محاسبي
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت مساعد محاسبي ذكي. مهمتك تحليل الأوامر المحاسبية بالعربية وتحويلها إلى إجراءات.
          
الإجراءات المتاحة:
1. create_journal_entry - إنشاء قيد يومي
2. create_receipt_voucher - إنشاء سند قبض
3. create_payment_voucher - إنشاء سند صرف
4. query_balance - الاستعلام عن رصيد
5. generate_report - إنشاء تقرير

يجب أن ترد بـ JSON فقط بهذا الشكل:
{
  "action": "اسم الإجراء",
  "data": { البيانات المطلوبة },
  "response": "رد نصي للمستخدم"
}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "accounting_action",
          strict: true,
          schema: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: [
                  "create_journal_entry",
                  "create_receipt_voucher",
                  "create_payment_voucher",
                  "query_balance",
                  "generate_report",
                  "clarification_needed",
                ],
              },
              data: {
                type: "object",
                additionalProperties: true,
              },
              response: {
                type: "string",
              },
            },
            required: ["action", "response"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(typeof content === 'string' ? content : "{}");
    return result;
  } catch (error) {
    console.error("[AI Processor] Error:", error);
    return {
      action: "error",
      response: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
    };
  }
}
