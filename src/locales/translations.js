export const translations = {
  en: {
    // 首页
    title: "DON'T TAKE A PhD",
    subtitle: '"A PhD is not a shelter from reality,\nbut a life choice that requires careful consideration."',
    gameInfo: {
      title: "GAME INFO",
      point1: "Understand what advisors care about",
      point2: "Test your genuine research interest",
      point3: "Think if PhD is right for you",
      footer: "INSERT COIN TO START",
      tip: "💡 Tip: If generation fails, please try again later. Network fluctuations may affect generation speed."
    },

   input: {
    title: "DESCRIBE_YOUR_ADVISOR.exe",
    subtitle: "Enter a description or paste the advisor's homepage URL",
    modeText: "📝 Text Description",
    modeUrl: "🔗 Homepage URL",
    placeholder: `// Enter advisor description...
// Example: Young AI professor, pushy but nice
// Or: Theoretical scholar, hands-off style`,
    urlPlaceholder: "https://example.edu/~professor",
    urlExample: "Example",
    charCount: "[{count}/500]",
    button: "▶ START INTERVIEW",
    buttonGenerating: "GENERATING...",
    statusReady: "READY",
    statusOnline: "ONLINE"
  },

    footer: "▶ PRESS START TO BEGIN YOUR JOURNEY ◀",
    
    // 动画文字
    animations: {
      words: ['RESEARCH?', 'PUBLISH!', 'DEADLINE!', 'REVIEW...'],
      motivation: 'MOTIVATION',
      critical: 'CRITICAL!'
    },

    // 导师档案模态框
    advisorModal: {
      close: "Close",
      field: "Research Field",
      interests: "Research Interests",
      personality: "Personality",
      labStyle: "Lab Style",
      expectations: "Expectations for Students"
    },

    // 对话界面
    chat: {
      thinking: "Professor is thinking...",
      inputPlaceholder: "Type your response...",
      send: "Send",
      viewProfile: "View Profile",
      startOver: "Start Over",
      result: {
        accepted: "🎉 OFFER ACCEPTED!",
        rejected: "😢 APPLICATION REJECTED",
        acceptedMessage: "Congratulations! The professor thinks you're a good fit for their lab. Your answers show genuine research interest and clear goals.",
        rejectedMessage: "Unfortunately, the professor thinks there might be a mismatch. This doesn't mean you're not good enough - perhaps you need more preparation or to find a better-fit advisor."
      }
    },

    // 游戏输入
    gameInput: {
      placeholder: "Type your answer... (Enter to send)",
      send: "Send",
      hint: "💡 Watch the advisor's expression change with satisfaction"
    },

    // 聊天消息
    messages: {
      you: "You",
      advisor: "Advisor",
      points: "points"
    },

    // 介绍屏幕
    intro: {
      meetAdvisor: "Meet Your Advisor",
      subtitle: "Get to know your potential PhD advisor",
      viewDetails: "View Advisor Details",
      gameRules: "📚 Game Rules",
      rule1: "You will have an in-depth conversation with {name}",
      rule2: "Advisor's expression changes with satisfaction (😊 → 🤔 → 😔)",
      rule3: "Your answers will affect the advisor's satisfaction",
      rule4: "Finally get an offer or be rejected",
      advisorTraits: "Advisor Traits",
      advisorPersonality: "Personality:",
      researchField: "Research Field:",
      changeAdvisor: "Change Advisor",
      startInterview: "Start Interview",
      readyPrompt: "▶ Press start when ready",
      initialMessage: "Hello, I'm {name}. Tell me, why do you want to pursue a PhD?"
    },

    // 满意度条
    satisfaction: {
      veryLow: "Very Dissatisfied",
      low: "Dissatisfied", 
      medium: "Neutral",
      high: "Satisfied",
      veryHigh: "Very Satisfied",
      label: "Advisor Satisfaction"
    },


    // 结果屏幕
    result: {
      offer: {
        title: "🎉 Congratulations! Offer!",
        message: "{name} is very satisfied with you! You showed passion for {field} and adequate preparation.",
        button: "Play Again"
      },
      rejection: {
        title: "😢 Rejected",
        message: "{name} thinks there might be some gaps. Perhaps you need more preparation in {field}, or your research interests don't align well enough.",
        button: "Try Again"
      }
    },

    // 游戏中屏幕
    playing: {
      round: "Round {current}/{total}",
      satisfaction: "Satisfaction",
      viewProfile: "View Profile",
      thinking: "Professor is thinking..."
    },

    // 错误信息
    errors: {
      generateFailed: "Failed to generate advisor profile. Please try again.",
      networkError: "Network error. Please check your connection.",
      urlRequired: "Please enter a URL",
      invalidUrl: "Invalid URL format. Please enter a valid URL.",
      descriptionRequired: "Please enter a description"
    }
  },

  zh: {
    // 首页
    title: "DON'T TAKE A PhD",
    subtitle: '"读博不是逃避现实的避风港，\n而是需要深思熟虑的人生选择。"',
    gameInfo: {
      title: "GAME INFO",
      point1: "了解导师会关心什么问题",
      point2: "检验你对研究的真实兴趣",
      point3: "思考PhD是否真的适合你",
      footer: "INSERT COIN TO START",
      tip: "💡 提示：如果生成失败，请稍后重试。网络波动可能影响生成速度。"
    },

   input: {
      title: "DESCRIBE_YOUR_ADVISOR.exe",
      subtitle: "输入描述或粘贴导师的个人主页链接",
      modeText: "📝 文字描述",
      modeUrl: "🔗 主页链接",
      placeholder: `// 输入导师描述...
  // 例如：研究AI的年轻教授，push但nice
  // 或者：做理论的老学者，放养型`,
      urlPlaceholder: "https://example.edu/~professor",
      urlExample: "示例",
      charCount: "[{count}/500]",
      button: "▶ START INTERVIEW",
      buttonGenerating: "生成中...",
      statusReady: "READY",
      statusOnline: "ONLINE"
    },

    footer: "▶ PRESS START TO BEGIN YOUR JOURNEY ◀",

    // 动画文字
    animations: {
      words: ['研究?', '发文章!', '截止日!', '审稿...'],
      motivation: '动力值',
      critical: '危险!'
    },

    // 导师档案模态框
    advisorModal: {
      close: "关闭",
      field: "研究领域",
      interests: "研究兴趣",
      personality: "性格特点",
      labStyle: "实验室风格",
      expectations: "对学生的期待"
    },

    // 对话界面
    chat: {
      thinking: "导师正在思考...",
      inputPlaceholder: "输入你的回答...",
      send: "发送",
      viewProfile: "查看档案",
      startOver: "重新开始",
      result: {
        accepted: "🎉 获得 OFFER！",
        rejected: "😢 申请被拒绝",
        acceptedMessage: "恭喜！导师认为你很适合他的实验室。你的回答展现了真实的研究兴趣和清晰的目标。",
        rejectedMessage: "很遗憾，导师认为可能存在不匹配。这不代表你不够优秀——也许你需要更多准备，或者寻找更适合的导师。"
      }
    },

    // 游戏输入
    gameInput: {
      placeholder: "输入回答... (Enter发送)",
      send: "发送",
      hint: "💡 观察导师表情随满意度变化"
    },

    // 聊天消息
    messages: {
      you: "你",
      advisor: "导师",
      points: "分"
    },

     // 介绍屏幕
    intro: {
      meetAdvisor: "认识你的导师",
      subtitle: "了解你的潜在博士导师",
      viewDetails: "查看导师详细信息",
      gameRules: "📚 游戏说明",
      rule1: "你将与 {name} 进行深入对话",
      rule2: "导师表情会随着满意度实时变化（😊 → 🤔 → 😔）",
      rule3: "你的回答将影响导师的满意度",
      rule4: "最终获得offer或被拒绝",
      advisorTraits: "导师特征",
      advisorPersonality: "导师性格：",
      researchField: "研究领域：",
      changeAdvisor: "换导师",
      startInterview: "开始面试",
      readyPrompt: "▶ 准备好了就开始吧",
      initialMessage: "你好，我是{name}。请告诉我，你为什么想要攻读PhD？"
    },

    // 满意度条
    satisfaction: {
      veryLow: "非常不满意",
      low: "不满意",
      medium: "中立",
      high: "满意",
      veryHigh: "非常满意",
      label: "导师满意度"
    },

    // 结果屏幕
    result: {
      offer: {
        title: "🎉 恭喜！Offer!",
        message: "{name} 对你非常满意！你展现出了对{field}的热情和充分的准备。",
        button: "再玩一次"
      },
      rejection: {
        title: "😢 很遗憾",
        message: "{name} 认为可能存在一些差距。也许你需要在{field}方面有更多准备，或者你的研究兴趣还不够契合。",
        button: "再试一次"
      }
    },

    // 游戏中屏幕
    playing: {
      round: "第 {current}/{total} 轮",
      satisfaction: "满意度",
      viewProfile: "查看档案",
      thinking: "导师正在思考..."
    },

    // 错误信息
    errors: {
      generateFailed: "生成导师档案失败，请重试",
      networkError: "网络错误，请检查连接",
      urlRequired: "请输入URL",
      invalidUrl: "URL格式无效，请输入有效的URL",
      descriptionRequired: "请输入描述"
    }
  }
};