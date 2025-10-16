import React, { useState } from 'react';
import { User } from '../types';
import { Card } from './common/Card';
import { JAPAN_PREFECTURES } from '../constants';

interface AuthModalProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: Omit<User, 'id' | 'activityLog' | 'wisdomLog'>) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ users, onLogin, onRegister, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login state
  const [selectedUserId, setSelectedUserId] = useState<string>(users.length > 1 ? users[1].id.toString() : '');

  // Register state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [prefecture, setPrefecture] = useState(JAPAN_PREFECTURES[12]); // Default to Tokyo

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userToLogin = users.find(u => u.id === parseInt(selectedUserId, 10));
    if (userToLogin) {
      onLogin(userToLogin);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bio.trim()) {
        alert("名前と自己紹介は必須です。");
        return;
    }
    const newUser = {
      name,
      bio,
      avatarUrl: `https://picsum.photos/seed/${name}/200`,
      skills: skills.split(',').map(s => `#${s.trim()}`).filter(s => s.length > 1),
      prefecture,
    };
    onRegister(newUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-amber-900">ギルドへようこそ</h2>
            <button onClick={onClose} className="text-2xl font-bold text-stone-500 hover:text-stone-800" aria-label="閉じる">&times;</button>
        </div>
        
        <div className="border-b border-amber-300 mb-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button onClick={() => setActiveTab('login')} className={`px-4 py-2 font-medium text-lg rounded-t-lg ${activeTab === 'login' ? 'border-b-2 border-amber-600 text-amber-800' : 'text-stone-500 hover:text-amber-700'}`}>
              ログイン
            </button>
            <button onClick={() => setActiveTab('register')} className={`px-4 py-2 font-medium text-lg rounded-t-lg ${activeTab === 'register' ? 'border-b-2 border-amber-600 text-amber-800' : 'text-stone-500 hover:text-amber-700'}`}>
              新規登録
            </button>
          </nav>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <p className="text-sm text-stone-600 mb-4">(デモ用：ユーザーを選択してログインします。ゲスト（匿名さん）として利用を続ける場合は、このウィンドウを閉じてください。)</p>
              <label htmlFor="user-select" className="block text-sm font-medium text-amber-800 mb-1">ユーザー</label>
              <select 
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                {users.filter(u => u.id !== 0).map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors">
              ログイン
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">名前</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" required />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-amber-800 mb-1">自己紹介</label>
                <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" rows={3} required />
            </div>
            <div>
                <label htmlFor="prefecture" className="block text-sm font-medium text-amber-800 mb-1">都道府県</label>
                <select id="prefecture" value={prefecture} onChange={e => setPrefecture(e.target.value)} className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" required>
                    {JAPAN_PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="skills" className="block text-sm font-medium text-amber-800 mb-1">できること (カンマ区切り)</label>
                <input id="skills" type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="例: DIY, 料理, 写真撮影" className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
              登録する
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};