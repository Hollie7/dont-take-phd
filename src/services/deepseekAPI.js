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


// deepseekAPI.js

// 辅助函数：延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 辅助函数：带重试的 fetch
const fetchWithRetry = async (url, options, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // 如果是 429 (太多请求) 或 5xx 服务器错误，重试
      if (response.status === 429 || response.status >= 500) {
        console.warn(`Attempt ${i + 1} failed with status ${response.status}, retrying...`);
        if (i < retries - 1) {
          await delay(delayMs * (i + 1)); // 指数退避
          continue;
        }
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`Attempt ${i + 1} timeout, retrying...`);
      } else {
        console.warn(`Attempt ${i + 1} failed:`, error.message);
      }
      
      if (i === retries - 1) {
        throw error;
      }
      
      await delay(delayMs * (i + 1));
    }
  }
};


// 原有的 generateAdvisorProfile 函数（添加重试）
export const generateAdvisorProfile = async (description, language = 'zh') => {
  try {
    const systemPrompt = language === 'zh' 
      ? `你是一个创意的导师档案生成器。基于用户提供的简短描述，生成一个详细的、有趣的导师档案。

要求：
1. 档案应该真实可信，但可以适当夸张有趣
2. 性格特征要鲜明，有记忆点
3. 研究兴趣要具体，不要太泛泛
4. 必须返回有效的JSON格式

返回格式示例：
{
  "name": "李明",
  "title": "副教授",
  "institution": "某某大学计算机学院",
  "field": "人工智能与机器学习",
  "research_interests": ["深度学习理论", "计算机视觉", "强化学习"],
  "personality": "工作狂，凌晨2点还在回邮件。对学生要求严格但公平，喜欢和学生一起debug到深夜。",
  "lab_style": "每周2次组会，鼓励失败，强调'fail fast, learn faster'。实验室氛围轻松但产出要求高。",
  "expectations": ["有扎实的编程基础", "不怕困难，抗压能力强", "主动性强，能独立推进项目"],
  "famous_quote": "PhD is not about being smart, it's about being persistent.",
  "gender": "male"
}`
      : `You are a creative advisor profile generator. Based on a brief description, generate a detailed and interesting advisor profile.

Requirements:
1. Profile should be realistic but can be moderately exaggerated for interest
2. Personality traits should be distinctive and memorable
3. Research interests should be specific, not too general
4. Must return valid JSON format

Return format example:
{
  "name": "John Smith",
  "title": "Associate Professor",
  "institution": "Example University, CS Department",
  "field": "Artificial Intelligence and Machine Learning",
  "research_interests": ["Deep Learning Theory", "Computer Vision", "Reinforcement Learning"],
  "personality": "Workaholic who replies to emails at 2 AM. Demanding but fair with students, enjoys debugging together late at night.",
  "lab_style": "Two group meetings per week, encourages failure, emphasizes 'fail fast, learn faster'. Relaxed atmosphere but high output expectations.",
  "expectations": ["Strong programming foundation", "Resilient and able to handle pressure", "Proactive and can drive projects independently"],
  "famous_quote": "PhD is not about being smart, it's about being persistent.",
  "gender": "male"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: description }
    ];

    console.log('Calling DeepSeek API for profile generation...');
    
    const response = await fetchWithRetry('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    }, 3, 2000); // 重试3次，每次延迟2秒

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }
    
    const advisorProfile = JSON.parse(data.choices[0].message.content);
    
    // 验证必需字段
    const requiredFields = ['name', 'title', 'institution', 'field', 'research_interests', 'personality', 'lab_style', 'expectations', 'famous_quote', 'gender'];
    const missingFields = requiredFields.filter(field => !advisorProfile[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return advisorProfile;
  } catch (error) {
    console.error('Error generating advisor profile:', error);
    throw new Error(`生成失败: ${error.message}`);
  }
};

// 改进的 generateAdvisorFromURL 函数
export const generateAdvisorFromURL = async (url, language = 'zh') => {
  try {
    // Step 1: 使用 Jina Reader 获取网页内容
    console.log('Fetching webpage content from:', url);
    const jinaURL = `https://r.jina.ai/${url}`;
    
    const jinaResponse = await fetchWithRetry(jinaURL, {}, 3, 2000);
    const webContent = await jinaResponse.text();
    
    console.log('Webpage content length:', webContent.length);
    
    if (webContent.length < 100) {
      throw new Error('网页内容太短，可能是无效的URL或网页无法访问');
    }
    
    // Step 2: 用 DeepSeek 提取结构化信息
    const systemPrompt = language === 'zh' 
      ? `你是一个专业的信息提取助手。请从以下网页内容中提取导师的详细信息，并以JSON格式返回。

要求：
1. 提取导师的姓名、职位、机构、研究领域、研究兴趣等
2. 提取性格特征（从文字风格、研究描述等推断）
3. 推断实验室风格和对学生的期待
4. 如果找不到某些信息，用合理的推测填充
5. 必须返回有效的JSON格式

返回格式示例：
{
  "name": "张三",
  "title": "教授",
  "institution": "某某大学",
  "field": "人工智能与机器学习",
  "research_interests": ["深度学习", "计算机视觉", "自然语言处理"],
  "personality": "严谨认真，注重细节，对学生要求高但也很支持",
  "lab_style": "每周组会，鼓励创新，强调论文产出",
  "expectations": ["有扎实的数学基础", "熟悉Python和深度学习框架", "能独立思考和解决问题"],
  "famous_quote": "Research is about asking the right questions.",
  "gender": "male"
}`
      : `You are a professional information extraction assistant. Extract detailed advisor information from the following webpage content and return it in JSON format.

Requirements:
1. Extract name, title, institution, research field, research interests
2. Infer personality traits from writing style and research descriptions
3. Infer lab style and expectations for students
4. Use reasonable assumptions for missing information
5. Must return valid JSON format

Return format example:
{
  "name": "John Smith",
  "title": "Professor",
  "institution": "Example University",
  "field": "Artificial Intelligence and Machine Learning",
  "research_interests": ["Deep Learning", "Computer Vision", "Natural Language Processing"],
  "personality": "Rigorous and detail-oriented, high expectations but very supportive",
  "lab_style": "Weekly meetings, encourages innovation, emphasizes paper publications",
  "expectations": ["Strong mathematical foundation", "Proficient in Python and deep learning frameworks", "Ability to think independently"],
  "famous_quote": "Research is about asking the right questions.",
  "gender": "male"
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `网页内容：\n\n${webContent.slice(0, 10000)}` }
    ];

    console.log('Calling DeepSeek API for information extraction...');
    
    const apiResponse = await fetchWithRetry('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    }, 3, 2000);

    const data = await apiResponse.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }
    
    const advisorProfile = JSON.parse(data.choices[0].message.content);
    
    // 验证必需字段
    const requiredFields = ['name', 'title', 'institution', 'field', 'research_interests', 'personality', 'lab_style', 'expectations', 'famous_quote', 'gender'];
    const missingFields = requiredFields.filter(field => !advisorProfile[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('Generated advisor profile:', advisorProfile);
    return advisorProfile;
    
  } catch (error) {
    console.error('Error generating advisor from URL:', error);
    
    // 提供更友好的错误信息
    if (error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络后重试');
    } else if (error.message.includes('timeout') || error.name === 'AbortError') {
      throw new Error('请求超时，请重试');
    } else if (error.message.includes('网页内容太短')) {
      throw new Error('无法访问该网页，请检查URL是否正确');
    } else {
      throw new Error(`生成失败: ${error.message}`);
    }
  }
};

// 导出现有的 evaluateStudentResponse 函数...
// (保持原有代码)