
import React from 'react';
import { User } from '../types';
import { Card } from './common/Card';
import { TagChip } from './common/TagChip';
import { QuestIcon, WisdomIcon, LocationIcon } from './icons/Icons';

interface ProfilePageProps {
  user: User;
  currentUser: User | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentUser }) => {
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <div className="flex flex-col items-center relative">
            {isOwnProfile && (
              <button className="absolute top-2 right-2 bg-amber-200 text-amber-800 px-3 py-1 text-sm rounded-full hover:bg-amber-300">
                編集
              </button>
            )}
            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full mb-4 border-4 border-amber-200 shadow-md"/>
            <h2 className="text-2xl font-bold text-amber-900">{user.name}</h2>
            {user.prefecture && (
                <div className="flex items-center text-stone-600 mt-2">
                    <LocationIcon className="h-4 w-4 mr-1"/>
                    <span>{user.prefecture}</span>
                </div>
            )}
            <p className="text-stone-600 mt-4 text-center">{user.bio}</p>
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 text-center border-b-2 border-amber-200 pb-2">できること</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {user.skills.map(skill => <TagChip key={skill} tag={skill} />)}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <h3 className="text-xl font-bold text-amber-900 mb-4">冒険の書（活動記録）</h3>
          <div className="space-y-6">
            {user.activityLog.length > 0 ? user.activityLog.map((log) => (
              <div key={log.questId} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center mb-2">
                    <QuestIcon className="h-5 w-5 mr-2 text-amber-700"/>
                    <p className="font-semibold text-stone-800">{log.questTitle}</p>
                </div>
                <p className="text-sm text-stone-600 pl-7">「{log.feedback}」</p>
                <p className="text-xs text-stone-500 text-right mt-2">{log.timestamp}</p>
              </div>
            )) : (
              <p className="text-stone-600">まだ活動記録がありません。</p>
            )}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-amber-900 mb-4">ギルドの知恵袋への投稿</h3>
          <div className="space-y-6">
            {user.wisdomLog.length > 0 ? user.wisdomLog.map((log) => (
              <div key={log.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center mb-2">
                    <WisdomIcon className="h-5 w-5 mr-2 text-amber-700"/>
                    <p className="font-semibold text-stone-800">{log.problem}</p>
                </div>
                <p className="text-sm text-stone-600 pl-7">{log.solution}</p>
                <p className="text-xs text-stone-500 text-right mt-2">{log.timestamp}</p>
              </div>
            )) : (
              <p className="text-stone-600">まだ知恵袋への投稿がありません。</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};