import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { QuestBoard } from './components/QuestBoard';
import { ProfilePage } from './components/ProfilePage';
import { AboutPage } from './components/AboutPage';
import { ProjectRoom } from './components/ProjectRoom';
import { WisdomBoard } from './components/WisdomBoard';
import { AuthModal } from './components/AuthModal';
import { USERS as initialUsers, QUESTS as initialQuests, WISDOM_ENTRIES as initialWisdoms, ANONYMOUS_USER } from './constants';
import { User, Quest, WisdomEntry, QuestStatus } from './types';

type View = 'quest-board' | 'about' | 'profile' | 'project-room' | 'wisdom';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('quest-board');
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [wisdoms, setWisdoms] = useState<WisdomEntry[]>(initialWisdoms);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
    setSelectedQuestId(null);
    setSelectedUserId(null);
  }, []);

  const handleSelectQuest = useCallback((questId: number) => {
    setSelectedQuestId(questId);
    setCurrentView('project-room');
  }, []);

  const handleSelectUser = useCallback((userId: number) => {
    setSelectedUserId(userId);
    setCurrentView('profile');
  }, []);
  
  const handleLogin = (user: User) => {
      setCurrentUser(user);
      setAuthModalOpen(false);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      handleNavigate('quest-board');
  };

  const handleRegister = (newUser: Omit<User, 'id' | 'activityLog' | 'wisdomLog'>) => {
      const user: User = {
          ...newUser,
          id: Date.now(),
          activityLog: [],
          wisdomLog: []
      };
      setUsers(prev => [...prev, user]);
      setCurrentUser(user);
      setAuthModalOpen(false);
  };

  const handleProfileClick = () => {
    if (currentUser) {
      handleSelectUser(currentUser.id);
    } else {
      setAuthModalOpen(true);
    }
  };
  
  const onRequestAuth = () => {
    setAuthModalOpen(true);
  }

  const handleQuestUpdate = (updatedQuest: Quest) => {
    setQuests(quests.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  };

  const handleQuestCreate = (newQuest: Omit<Quest, 'id' | 'participants' | 'status'>) => {
    const quest: Quest = {
      ...newQuest,
      id: Date.now(),
      participants: [],
      status: QuestStatus.Open,
      prefecture: newQuest.prefecture,
    };
    setQuests(prev => [quest, ...prev]);
    handleNavigate('quest-board');
  };
  
  const handleWisdomCreate = (newWisdom: Omit<WisdomEntry, 'id' | 'timestamp'>) => {
    const wisdom: WisdomEntry = {
      ...newWisdom,
      id: Date.now(),
      timestamp: new Date().toISOString().split('T')[0],
    };
    setWisdoms(prev => [wisdom, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'quest-board':
        return <QuestBoard 
          quests={quests} 
          users={users}
          currentUser={currentUser}
          onSelectQuest={handleSelectQuest} 
          onSelectUser={handleSelectUser}
          onCreateQuest={handleQuestCreate}
          onRequestAuth={onRequestAuth}
           />;
      case 'about':
        return <AboutPage />;
      case 'wisdom':
        return <WisdomBoard 
          wisdoms={wisdoms} 
          users={users}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onCreateWisdom={handleWisdomCreate}
          onRequestAuth={onRequestAuth}
          />;
      case 'profile':
        const user = users.find(u => u.id === selectedUserId) ?? currentUser ?? ANONYMOUS_USER;
        return <ProfilePage user={user} currentUser={currentUser} />;
      case 'project-room':
        const selectedQuest = quests.find(q => q.id === selectedQuestId);
        if (!selectedQuest) {
            return <div>クエストが見つかりません。</div>
        }
        return <ProjectRoom 
                quest={selectedQuest} 
                users={users}
                currentUser={currentUser}
                onSelectUser={handleSelectUser} 
                onUpdateQuest={handleQuestUpdate}
                onRequestAuth={onRequestAuth}
                />;
      default:
        return <div>ページが見つかりません。</div>;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
        <Header 
            onNavigate={handleNavigate} 
            onProfileClick={handleProfileClick}
            currentUser={currentUser}
            onLogout={handleLogout}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
        </main>
        {isAuthModalOpen && (
            <AuthModal 
                users={users}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onClose={() => setAuthModalOpen(false)}
            />
        )}
    </div>
  );
};

export default App;