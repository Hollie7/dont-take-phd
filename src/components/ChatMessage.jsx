import React from 'react';
import { User, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ChatMessage = ({ message, advisorName }) => {
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
      </div>
    </div>
  );
};