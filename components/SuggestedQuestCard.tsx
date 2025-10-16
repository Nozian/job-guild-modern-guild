import React from 'react';
import { Quest, User } from '../types';
import { SparklesIcon } from './icons/Icons';

interface SuggestedQuestCardProps {
  quest: Quest;
  client?: User;
  reason: string;
  onSelectQuest: (questId: number) => void;
  onSelectUser: (userId: number) => void;
}

export const SuggestedQuestCard: React.FC<SuggestedQuestCardProps> = ({ quest, client, reason, onSelectQuest, onSelectUser }) => {
  const handleClientClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (client) {
      onSelectUser(client.id);
    }
  };

  return (
    <div 
        className="h-full rounded-lg p-0.5 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        onClick={() => onSelectQuest(quest.id)}
    >
        <div className="bg-amber-50 rounded-md p-4 h-full flex flex-col">
            {/* AI Reason Bubble */}
            <div className="relative mb-4">
                <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                    <p className="text-sm text-amber-900">
                        <span className="font-bold">AIのおすすめ理由:</span> {reason}
                    </p>
                </div>
                {/* Bubble Pointer */}
                <div className="absolute left-4 -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" style={{filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.05))'}}></div>
            </div>

            {/* Quest Details */}
            <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
                    quest.status === '募集中' ? 'bg-green-600' : 
                    quest.status === '進行中' ? 'bg-blue-600' : 'bg-gray-500'
                }`}>
                    {quest.status}
                </span>
                <div className="text-right">
                    <div className="font-bold text-lg text-amber-900">{quest.reward}</div>
                    <div className="text-xs text-amber-700">謝礼</div>
                </div>
            </div>
            
            <h3 className="text-md font-bold text-amber-900 mb-2">{quest.title}</h3>

            {client && (
                <div className="flex items-center mb-4 cursor-pointer" onClick={handleClientClick}>
                    <img src={client.avatarUrl} alt={client.name} className="h-6 w-6 rounded-full mr-2 border border-amber-200"/>
                    <span className="text-xs font-medium text-amber-800 hover:underline">{client.name}</span>
                </div>
            )}
            
            <div className="mt-auto text-center">
                 <p className="text-sm font-semibold text-amber-700 hover:text-amber-900">詳細を見る →</p>
            </div>
        </div>
    </div>
  );
};
