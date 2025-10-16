
import React from 'react';
import { WisdomEntry, User } from '../types';
import { TagChip } from './common/TagChip';
import { Card } from './common/Card';

interface WisdomCardProps {
  wisdom: WisdomEntry;
  author?: User;
  onSelectUser: (userId: number) => void;
}

export const WisdomCard: React.FC<WisdomCardProps> = ({ wisdom, author, onSelectUser }) => {
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (author) {
      onSelectUser(author.id);
    }
  };

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <span className="text-amber-700 font-bold text-lg">Q.</span>
          <h3 className="inline ml-2 text-lg font-bold text-amber-900">{wisdom.problem}</h3>
        </div>

        <div className="mb-4 flex-grow">
          <span className="text-stone-600 font-bold text-lg">A.</span>
          <p className="inline ml-2 text-stone-700">{wisdom.solution}</p>
        </div>

        {author && (
          <div 
            className="flex items-center mb-4 cursor-pointer w-fit" 
            onClick={handleAuthorClick}
            aria-label={`View profile of ${author.name}`}
            >
            <img src={author.avatarUrl} alt={author.name} className="h-8 w-8 rounded-full mr-2 border-2 border-amber-200"/>
            <span className="text-sm font-medium text-amber-800 hover:underline">{author.name}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {wisdom.tags.map(tag => <TagChip key={tag} tag={tag} />)}
        </div>
      </div>
    </Card>
  );
};
