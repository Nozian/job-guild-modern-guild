
import React from 'react';
import { Tag } from '../../types';

interface TagChipProps {
  tag: Tag;
}

export const TagChip: React.FC<TagChipProps> = ({ tag }) => {
  return (
    <span className="bg-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
      {tag}
    </span>
  );
};
