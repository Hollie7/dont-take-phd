import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Lightbulb, BookOpen, Brain, GraduationCap } from 'lucide-react';
import { generateAdvisorProfile } from '../services/deepseekAPI';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: ['#a78bfa', '#c4b5fd', '#fbbf24', '#fb923c'][Math.floor(Math.random() * 4)]
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => cancelAnimationFrame(animate);
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />;
};

export const InitScreen = ({ onAdvisorGenerated }) => {
  const [advisorInput, setAdvisorInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!advisorInput.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const profile = await generateAdvisorProfile(advisorInput.trim());
      onAdvisorGenerated(profile);
    } catch (error) {
      alert('生成导师档案失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <div className="max-w-2xl w-full bg-purple-800 border-4 border-purple-600 p-8 pixel-corners shadow-2xl relative z-10">
        {/* 顶部装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
        
        <div className="text-center mb-6">
          {/* 图标组合 */}
          <div className="relative inline-block mb-4">
            {/* <Sparkles className="w-16 h-16 mx-auto text-yellow-400 animate-pulse" /> */}
            <GraduationCap className="w-16 h-16 mx-auto text-yellow-400 animate-pulse" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2 pixel-text tracking-wider">
            Don't Take a PhD
          </h1>
          
          {/* 副标题装饰 */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-purple-400"></div>
            <BookOpen className="w-4 h-4 text-purple-300" />
            <div className="w-12 h-0.5 bg-purple-400"></div>
          </div>
          
          {/* 警示名言 */}
          <div className="bg-purple-950 border-2 border-purple-500 p-4 pixel-corners mb-4 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-800 px-3">
              <Brain className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-purple-200 text-sm italic leading-relaxed">
              "读博不是逃避现实的避风港，<br/>
              而是需要深思熟虑的人生选择。"
            </p>
          </div>
          
          <p className="text-purple-300 text-sm">
            在决定申请PhD之前，先和你的"理想导师"聊聊吧
          </p>
        </div>

        {/* 应用目的说明 - 增强样式 */}
        <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-5 rounded mb-4 border-2 border-purple-500 relative overflow-hidden">
          {/* 装饰性背景图案 */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-600 opacity-10 rounded-full -ml-8 -mb-8"></div>
          
          <h2 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2 relative z-10">
            <Lightbulb className="w-5 h-5" />
            这个游戏能帮你什么？
          </h2>
          <ul className="text-purple-200 text-sm space-y-2 relative z-10">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span>了解导师会关心什么问题</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span>检验你对研究的真实兴趣</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span>思考PhD是否真的适合你</span>
            </li>
          </ul>
        </div>

        {/* Textarea 增加边框效果 */}
        <div className="relative mb-4">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 blur pixel-corners"></div>
          <textarea
            value={advisorInput}
            onChange={(e) => setAdvisorInput(e.target.value)}
            placeholder="描述你想申请的导师类型（最好包含研究方向/学科领域）

例如：
- 做CV的年轻AP，每天12点还在回邮件，但人很nice
- 研究认知心理学的教授，温柔但DDL卡得死死的
- 研究社会学的青椒，佛系，你要有自己的想法"
            className="relative w-full bg-purple-950 border-2 border-purple-500 text-white p-4 pixel-corners resize-none h-48 placeholder-purple-400 text-sm focus:border-purple-400 focus:outline-none transition-colors"
          />
        </div>
        
        {/* 按钮增强效果 */}
        <button
          onClick={handleGenerate}
          disabled={!advisorInput.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-purple-900 font-bold py-4 px-6 border-4 border-yellow-700 pixel-corners disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成导师档案
            </>
          )}
        </button>

        {/* 底部提示 - 增加图标 */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-8 h-0.5 bg-purple-600"></div>
          <p className="text-purple-400 text-xs text-center">
            💡 描述越详细，生成的导师档案越贴近你的想象
          </p>
          <div className="w-8 h-0.5 bg-purple-600"></div>
        </div>

        {/* 底部装饰条 */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400"></div>
      </div>
    </div>
  );
};