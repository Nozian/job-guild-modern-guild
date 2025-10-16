import React from 'react';
import { QuestIcon, UserIcon, WisdomIcon, InfoIcon } from './icons/Icons';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (view: 'quest-board' | 'about' | 'profile' | 'wisdom') => void;
  onProfileClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onProfileClick, currentUser, onLogout }) => {
  return (
    <header className="bg-[#6f4e37] shadow-lg sticky top-0 z-50 text-amber-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 
          className="text-2xl font-bold tracking-wider cursor-pointer"
          onClick={() => onNavigate('quest-board')}
        >
          現代リアルギルド
        </h1>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => onNavigate('quest-board')}
            className="flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors"
            aria-label="クエスト"
          >
            <QuestIcon className="h-6 w-6 mb-1"/>
            <span className="hidden md:inline">クエスト</span>
          </button>
          <button 
            onClick={() => onNavigate('wisdom')}
            className="flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors"
            aria-label="知恵袋"
          >
            <WisdomIcon className="h-6 w-6 mb-1"/>
            <span className="hidden md:inline">知恵袋</span>
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className="flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors"
            aria-label="ギルドについて"
          >
            <InfoIcon className="h-6 w-6 mb-1"/>
            <span className="hidden md:inline">ギルドについて</span>
          </button>
          <div className="flex items-center space-x-2">
            {currentUser && (
              <div className="text-sm hidden sm:block">
                <p>{currentUser.name}さん</p>
              </div>
            )}
            <button 
              onClick={onProfileClick}
              className="flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors"
              aria-label={currentUser ? 'マイページ' : 'ログイン'}
            >
              <UserIcon className="h-6 w-6 mb-1"/>
              <span className="hidden md:inline">{currentUser ? 'マイページ' : 'ログイン'}</span>
            </button>
             {currentUser && (
               <button 
                onClick={onLogout}
                className="hidden md:block px-3 py-2 rounded-md text-sm font-medium bg-amber-700 hover:bg-amber-800 transition-colors"
                >
                ログアウト
               </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};