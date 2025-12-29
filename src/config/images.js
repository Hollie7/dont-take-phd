// 导师表情图片配置
export const ADVISOR_IMAGES = {
  male: {
    happy: 'https://i.ibb.co/dwr31LYJ/Chat-GPT-Image-Dec-27-2025-07-49-46-PM.png',
    thinking: 'https://i.ibb.co/PzTnMzSn/Chat-GPT-Image-Dec-27-2025-07-58-57-PM.png',
    sad: 'https://i.ibb.co/jkTsQFK8/Chat-GPT-Image-Dec-27-2025-07-59-18-PM.png',
    neutral: 'https://i.ibb.co/PzTnMzSn/Chat-GPT-Image-Dec-27-2025-07-58-57-PM.png'
  },
  female: {
    happy: 'https://i.ibb.co/9HtSXwRH/Chat-GPT-Image-Dec-27-2025-07-56-05-PM.png',
    thinking: 'https://i.ibb.co/2G1S0Yz/Chat-GPT-Image-Dec-29-2025-03-11-44-PM.png',
    sad: 'https://i.ibb.co/VcW1cRBG/Chat-GPT-Image-Dec-29-2025-03-11-41-PM.png',
    neutral: 'https://i.ibb.co/2G1S0Yz/Chat-GPT-Image-Dec-29-2025-03-11-44-PM.png'
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