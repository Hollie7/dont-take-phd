// DeepSeek API 服务

const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

/**
 * 获取系统提示词（根据语言）
 */
const getAdvisorGenerationPrompt = (language) => {
  const prompts = {
    zh: `你是PhD导师生成器。以JSON格式回复（不含markdown）：
{
  "name": "导师姓名",
  "gender": "male或female",
  "title": "职称",
  "institution": "机构",
  "field": "研究领域",
  "research_interests": ["兴趣1", "兴趣2", "兴趣3"],
  "personality": "性格特点",
  "lab_style": "实验室风格",
  "expectations": ["期待1", "期待2", "期待3"],
  "famous_quote": "座右铭"
}`,
    en: `You are a PhD advisor generator. Reply in JSON format (without markdown):
{
  "name": "Advisor name",
  "gender": "male or female",
  "title": "Academic title",
  "institution": "Institution",
  "field": "Research field",
  "research_interests": ["Interest 1", "Interest 2", "Interest 3"],
  "personality": "Personality traits",
  "lab_style": "Lab management style",
  "expectations": ["Expectation 1", "Expectation 2", "Expectation 3"],
  "famous_quote": "Motto or famous quote"
}`
  };
  return prompts[language] || prompts.zh;
};

const getAdvisorGenerationUserPrompt = (description, language) => {
  return language === 'en' 
    ? `Generate a PhD advisor profile for: ${description}`
    : `生成${description}的PhD导师档案`;
};

/**
 * 生成导师档案
 */
export const generateAdvisorProfile = async (description, language = 'zh') => {
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
          content: getAdvisorGenerationPrompt(language)
        },
        { 
          role: "user", 
          content: getAdvisorGenerationUserPrompt(description, language)
        }
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
 * 获取评估系统提示词（根据语言）
 */
const getEvaluationPrompt = (advisorProfile, satisfaction, turnCount, language) => {

  console.log("get evaluation prompt");
  console.log(language);

  const prompts = {
    zh: `你是${advisorProfile.name}，${advisorProfile.title}，研究${advisorProfile.field}。
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
}`,

    en: `You are ${advisorProfile.name}, ${advisorProfile.title}, researching ${advisorProfile.field}.
Personality: ${advisorProfile.personality}
Research interests: ${advisorProfile.research_interests.join(', ')}
Expectations: ${advisorProfile.expectations.join('; ')}

Scoring criteria:
+15 to +20: Well thought-out, aligns with research
+5 to +10: Shows thinking but lacks depth
-5 to 0: Vague and superficial
-10 to -20: Unprepared or unrealistic

Current satisfaction: ${satisfaction}/100, Round: ${turnCount + 1}/7

Reply in JSON (no markdown):
{
  "satisfaction_change": <integer from -20 to +20>,
  "next_question": "Next question",
  "should_end": <true/false>,
  "end_type": "offer/rejection/continue"
}`
  };

  return prompts[language] || prompts.zh;
};

/**
 * 评估学生回答
 */
export const evaluateStudentResponse = async (
  userMessage, 
  conversationHistory, 
  advisorProfile, 
  satisfaction, 
  turnCount, 
  language = 'zh'
) => {

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
          content: getEvaluationPrompt(advisorProfile, satisfaction, turnCount, language)
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