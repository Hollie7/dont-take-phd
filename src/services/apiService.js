// AI API service
// All LLM calls go through /api/chat (Vercel serverless function) so API keys stay server-side.

// Helper: sleep for a given number of milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: fetch with automatic retry on timeout or server errors (429, 5xx)
const fetchWithRetry = async (url, options, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // Retry on rate limit or server errors
      if (response.status === 429 || response.status >= 500) {
        console.warn(`Attempt ${i + 1} failed with status ${response.status}, retrying...`);
        if (i < retries - 1) {
          await delay(delayMs * (i + 1));
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

// Calls the serverless proxy — geo detection and API key selection happen server-side
const callAI = async (messages, options = {}) => {
  const response = await fetchWithRetry('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
      ...(options.response_format && { response_format: options.response_format }),
    }),
  }, 3, 2000);

  return response.json();
};

// Returns the system prompt for advisor generation based on language
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

// Returns the system prompt for student response evaluation based on language
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

// Evaluates the student's response and returns satisfaction change + next question
export const evaluateStudentResponse = async (
  userMessage,
  conversationHistory,
  advisorProfile,
  satisfaction,
  turnCount,
  language = 'zh'
) => {
  const data = await callAI(
    [
      {
        role: 'system',
        content: getEvaluationPrompt(advisorProfile, satisfaction, turnCount, language)
      },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ],
    { temperature: 0.7, max_tokens: 1000, response_format: { type: 'json_object' } }
  );

  const responseText = data.choices?.[0]?.message?.content ?? '';
  const clean = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean);
};

// Generates an advisor profile from a text description
export const generateAdvisorProfile = async (description, language = 'zh') => {
  try {
    console.log('Calling API for profile generation...');
    const data = await callAI(
      [
        { role: 'system', content: getAdvisorGenerationPrompt(language) },
        { role: 'user', content: getAdvisorGenerationUserPrompt(description, language) }
      ],
      { temperature: 0.8, response_format: { type: 'json_object' } }
    );

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    const advisorProfile = JSON.parse(data.choices[0].message.content);

    const requiredFields = ['name', 'title', 'institution', 'field', 'research_interests', 'personality', 'lab_style', 'expectations', 'gender'];
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

// Generates an advisor profile by scraping and parsing a faculty webpage via Jina Reader
export const generateAdvisorFromURL = async (url, language = 'zh') => {
  try {
    // Step 1: Fetch webpage text via Jina Reader + scrape raw image URLs in parallel
    console.log('Fetching webpage content from:', url);
    const jinaURL = `https://r.jina.ai/${url}`;

    const [jinaResponse, scrapeResponse] = await Promise.all([
      fetchWithRetry(jinaURL, {}, 3, 2000),
      fetch(`/api/scrape-photo?url=${encodeURIComponent(url)}`).catch(() => null),
    ]);
    const webContent = await jinaResponse.text();

    console.log('Webpage content length:', webContent.length);

    if (webContent.length < 100) {
      throw new Error('网页内容太短，可能是无效的URL或网页无法访问');
    }

    // Append scraped image URLs so the AI can select the best profile photo
    const scrapeData = scrapeResponse?.ok ? await scrapeResponse.json() : { imgs: [] };
    const imgListText = scrapeData.imgs.length > 0
      ? `\n\nImages found on the page (pick the most likely personal headshot for photo_url):\n${scrapeData.imgs.slice(0, 20).map((u, i) => `${i + 1}. ${u}`).join('\n')}`
      : '';

    console.log('Scraped image count:', scrapeData.imgs.length);

    // Step 2: Extract structured advisor info from the page content
    const systemPrompt = language === 'zh'
      ? `你是一个专业的信息提取助手。请从以下网页内容中提取导师的详细信息，并以JSON格式返回。

要求：
1. 提取导师的姓名、职位、机构、研究领域、研究兴趣等
2. 提取性格特征（从文字风格、研究描述等推断）
3. 推断实验室风格和对学生的期待
4. 如果找不到某些信息，用合理的推测填充
5. 从末尾提供的图片URL列表中选择最可能是个人照片的URL填入photo_url，找不到则设为null
6. 必须返回有效的JSON格式

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
  "gender": "male",
  "photo_url": "https://example.com/photo.jpg"
}`
      : `You are a professional information extraction assistant. Extract detailed advisor information from the following webpage content and return it in JSON format.

Requirements:
1. Extract name, title, institution, research field, research interests
2. Infer personality traits from writing style and research descriptions
3. Infer lab style and expectations for students
4. Use reasonable assumptions for missing information
5. From the image URL list provided at the end, pick the one most likely to be a personal headshot for photo_url; set to null if none found
6. Must return valid JSON format

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
  "gender": "male",
  "photo_url": "https://example.com/photo.jpg"
}`;

    console.log('Calling API for information extraction...');
    const data = await callAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `网页内容：\n\n${webContent.slice(0, 9000)}${imgListText}` }
      ],
      { temperature: 0.7, response_format: { type: 'json_object' } }
    );

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response format');
    }

    const advisorProfile = JSON.parse(data.choices[0].message.content);

    const requiredFields = ['name', 'title', 'institution', 'field', 'research_interests', 'personality', 'lab_style', 'expectations', 'gender'];
    const missingFields = requiredFields.filter(field => !advisorProfile[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Resolve relative photo_url (e.g. "/assets/img/photo.jpg") against the input URL
    if (advisorProfile.photo_url) {
      try {
        advisorProfile.photo_url = new URL(advisorProfile.photo_url, url).href;
      } catch {
        advisorProfile.photo_url = null;
      }
    }

    console.log('Generated advisor profile:', advisorProfile);
    return advisorProfile;

  } catch (error) {
    console.error('Error generating advisor from URL:', error);

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
