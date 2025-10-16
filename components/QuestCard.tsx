
import React from 'react';
import { Quest, User } from '../types';
import { TagChip } from './common/TagChip';
import { Card } from './common/Card';
import { LocationIcon } from './icons/Icons';

interface QuestCardProps {
  quest: Quest;
  client?: User;
  onSelectQuest: (questId: number) => void;
  onSelectUser: (userId: number) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, client, onSelectQuest, onSelectUser }) => {
  const handleClientClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (client) {
      onSelectUser(client.id);
    }
  };

  return (
    <Card interactive={true} onClick={() => onSelectQuest(quest.id)}>
      <div className="flex flex-col h-full">
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
        
        <h3 className="text-lg font-bold text-amber-900 mb-2">{quest.title}</h3>

        {client && (
          <div className="flex items-center mb-1 cursor-pointer" onClick={handleClientClick}>
            <img src={client.avatarUrl} alt={client.name} className="h-8 w-8 rounded-full mr-2 border-2 border-amber-200"/>
            <span className="text-sm font-medium text-amber-800 hover:underline">{client.name}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-stone-600 mb-4">
            <LocationIcon className="h-4 w-4 mr-1"/>
            <span>{quest.prefecture}</span>
        </div>

        <p className="text-sm text-stone-700 mb-4 flex-grow">{quest.description.substring(0, 100)}...</p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {quest.requiredTags.map(tag => <TagChip key={tag} tag={tag} />)}
        </div>
      </div>
    </Card>
  );
};