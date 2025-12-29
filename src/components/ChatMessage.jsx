import React from 'react';
import { User, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ChatMessage = ({ message, advisorName }) => {
  const { t } = useLanguage();
  const isAdvisor = message.role === 'advisor';

  return (
    <div className={`mb-4 ${isAdvisor ? 'text-left' : 'text-right'}`}>
      <div className={`inline-block max-w-[80%] ${
        isAdvisor ? 'bg-indigo-700 border-indigo-900' : 'bg-blue-600 border-blue-800'
      } border-2 p-3 pixel-corners`}>
        <div className="flex items-start gap-2 mb-1">
          {isAdvisor ? (
            <GraduationCap className="w-5 h-5 text-yellow-400" />
          ) : (
            <User className="w-5 h-5 text-blue-200" />
          )}
          <p className="text-white text-sm font-bold">
            {isAdvisor ? advisorName : t('messages.you')}
          </p>
        </div>
        <p className="text-white text-sm">{message.content}</p>
        {message.satisfactionChange !== undefined && message.satisfactionChange !== 0 && (
          <p className={`text-xs mt-2 ${message.satisfactionChange > 0 ? 'text-green-300' : 'text-red-300'}`}>
            {message.satisfactionChange > 0 ? '+' : ''}{message.satisfactionChange} {t('messages.points')}
          </p>
        )}
      </div>
    </div>
  );
};