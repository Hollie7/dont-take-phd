// 导师表情图片配置
// 在生产环境中，替换这些URL为你的实际图片地址

export const ADVISOR_IMAGES = {
  happy: 'https://i.ibb.co/dwr31LYJ/Chat-GPT-Image-Dec-27-2025-07-49-46-PM.png',
  thinking: 'https://i.ibb.co/PzTnMzSn/Chat-GPT-Image-Dec-27-2025-07-58-57-PM.png',
  sad: 'https://i.ibb.co/jkTsQFK8/Chat-GPT-Image-Dec-27-2025-07-59-18-PM.png'
};

// 根据情绪获取对应图片
export const getAdvisorImage = (emotion, isProcessing = false) => {
  if (isProcessing) return ADVISOR_IMAGES.thinking;
  if (emotion === 'happy') return ADVISOR_IMAGES.happy;
  if (emotion === 'sad') return ADVISOR_IMAGES.sad;
  return ADVISOR_IMAGES.thinking;
};