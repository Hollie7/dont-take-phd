import React from 'react';
import { User, GraduationCap, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ChatMessage = ({ message, advisorName, audioUrl }) => {
  const { t } = useLanguage();
  const isAdvisor = message.role === 'advisor';

  return (
    <div className={`mb-4 ${isAdvisor ? 'text-left' : 'text-right'}`}>
      <div className={`inline-block max-w-[80%] ${
        isAdvisor ? 'bg-gray-50 border-gray-100' : 'bg-gray-900 border-gray-800'
      } border rounded-2xl p-4 shadow-sm`}>
        <div className="flex items-start gap-2 mb-2">
          {isAdvisor ? (
            <GraduationCap className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
          ) : (
            <User className="w-4 h-4 text-gray-100 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm font-medium ${isAdvisor ? 'text-gray-900' : 'text-white'}`}>
            {isAdvisor ? advisorName : t('messages.you')}
          </p>
        </div>
        <p className={`text-sm leading-relaxed ${isAdvisor ? 'text-gray-700' : 'text-gray-100'}`}>
          {message.content}
        </p>
        {message.satisfactionChange !== undefined && message.satisfactionChange !== 0 && (
          <p className={`text-xs mt-2 font-medium ${message.satisfactionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {message.satisfactionChange > 0 ? '+' : ''}{message.satisfactionChange} {t('messages.points')}
          </p>
        )}
        {audioUrl && (
          <button
            onClick={() => new Audio(audioUrl).play()}
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Volume2 className="w-3 h-3" />
            {t('voice.replay')}
          </button>
        )}
      </div>
    </div>
  );
};