// DeepSeek API 服务

const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

/**
 * 生成导师档案
 */
export const generateAdvisorProfile = async (description) => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: `你是PhD导师生成器。以JSON格式回复（不含markdown）：
{
  "name": "导师姓名",
  "title": "职称",
  "institution": "机构",
  "field": "研究领域",
  "research_interests": ["兴趣1", "兴趣2", "兴趣3"],
  "personality": "性格特点",
  "lab_style": "实验室风格",
  "expectations": ["期待1", "期待2", "期待3"],
  "famous_quote": "座右铭"
}` 
        },
        { role: "user", content: `生成${description}的PhD导师档案` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content ?? "";
  const clean = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
};

/**
 * 评估学生回答
 */
export const evaluateStudentResponse = async (userMessage, conversationHistory, advisorProfile, satisfaction, turnCount) => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: `你是${advisorProfile.name}，${advisorProfile.title}，研究${advisorProfile.field}。
性格：${advisorProfile.personality}
研究兴趣：${advisorProfile.research_interests.join('、')}
期待：${advisorProfile.expectations.join('；')}

评分标准：
+15到+20：深思熟虑、契合研究
+5到+10：有思考但不够深入
-5到0：含糊表面
-10到-20：没准备或不切实际

当前满意度：${satisfaction}/100，回合：${turnCount + 1}/7

JSON回复（无markdown）：
{
  "satisfaction_change": <-20到+20整数>,
  "next_question": "下个问题",
  "should_end": <true/false>,
  "end_type": "offer/rejection/continue"
}` 
        },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content ?? "";
  const clean = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
};