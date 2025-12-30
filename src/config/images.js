// 导师表情图片配置
export const ADVISOR_IMAGES = {
  male: {
    happy: 'https://i.ibb.co/xKhQXGyw/Chat-GPT-Image-Dec-30-2025-09-05-49-PM.png',
    thinking: 'https://i.ibb.co/4n637wrd/Chat-GPT-Image-Dec-30-2025-09-05-52-PM.png',
    sad: 'https://i.ibb.co/Gv8k0wpN/Chat-GPT-Image-Dec-30-2025-09-08-20-PM.png',
    neutral: 'https://i.ibb.co/xKhQXGyw/Chat-GPT-Image-Dec-30-2025-09-05-49-PM.png'
  },
  female: {
    happy: 'https://i.ibb.co/jPXkDcVC/Chat-GPT-Image-Dec-30-2025-09-23-43-PM.png',
    thinking: 'https://i.ibb.co/1Gw24bD9/Chat-GPT-Image-Dec-30-2025-09-23-45-PM.png',
    sad: 'https://i.ibb.co/tMwZXrm2/Chat-GPT-Image-Dec-30-2025-09-23-47-PM.png',
    neutral: 'https://i.ibb.co/jPXkDcVC/Chat-GPT-Image-Dec-30-2025-09-23-43-PM.png'
  }
};

// 根据情绪和性别获取对应图片
export const getAdvisorImage = (emotion, isProcessing = false, gender = 'male') => {
  // 确保性别参数有效，默认为 male
  const validGender = (gender === 'female') ? 'female' : 'male';
  
  if (isProcessing) return ADVISOR_IMAGES[validGender].thinking;
  if (emotion === 'happy') return ADVISOR_IMAGES[validGender].happy;
  if (emotion === 'sad') return ADVISOR_IMAGES[validGender].sad;
  if (emotion === 'neutral') return ADVISOR_IMAGES[validGender].neutral;
  
  // 默认返回 thinking
  return ADVISOR_IMAGES[validGender].thinking;
};