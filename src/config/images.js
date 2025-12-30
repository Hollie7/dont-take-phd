// 导师表情图片配置
export const ADVISOR_IMAGES = {
  male: {
    happy: 'https://i.ibb.co/vxrfpgFz/Chat-GPT-Image-Dec-30-2025-05-56-34-PM.png',
    thinking: 'https://i.ibb.co/1Jbjv3pD/Chat-GPT-Image-Dec-30-2025-05-56-38-PM.png',
    sad: 'https://i.ibb.co/pvQYWB6m/Chat-GPT-Image-Dec-30-2025-05-56-40-PM.png',
    neutral: 'https://i.ibb.co/vxrfpgFz/Chat-GPT-Image-Dec-30-2025-05-56-34-PM.png'
  },
  female: {
    happy: 'https://i.ibb.co/Z6jm4CHW/Chat-GPT-Image-Dec-30-2025-06-15-58-PM.png',
    thinking: 'https://i.ibb.co/S4bf0VK2/Chat-GPT-Image-Dec-30-2025-06-16-01-PM.png',
    sad: 'https://i.ibb.co/KcDjj2Dr/Chat-GPT-Image-Dec-30-2025-06-16-03-PM.png',
    neutral: 'https://i.ibb.co/Z6jm4CHW/Chat-GPT-Image-Dec-30-2025-06-15-58-PM.png'
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