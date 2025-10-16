import React, { useState } from 'react';
import { Quest, User, ProjectTask as TaskType, ChatMessage as ChatMessageType } from '../types';
import { Card } from './common/Card';
import { TagChip } from './common/TagChip';
import { PROJECT_CHAT } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon } from './icons/Icons';


interface ProjectRoomProps {
  quest: Quest;
  users: User[];
  currentUser: User | null;
  onSelectUser: (userId: number) => void;
  onUpdateQuest: (updatedQuest: Quest) => void;
  onRequestAuth: () => void;
}

const ChatMessage: React.FC<{ message: ChatMessageType, user?: User, isCurrentUser: boolean }> = ({ message, user, isCurrentUser }) => (
  <div className={`flex items-start gap-2.5 my-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
    <img className="w-8 h-8 rounded-full border border-amber-200" src={user?.avatarUrl} alt={user?.name} />
    <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-xl ${isCurrentUser ? 'bg-amber-200' : 'bg-stone-200'}`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
        <span className="text-sm font-normal text-gray-500">{new Date(message.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <p className="text-sm font-normal py-2.5 text-gray-900">{message.message}</p>
    </div>
  </div>
);

const TaskItem: React.FC<{ task: TaskType; onToggle: (id: number) => void }> = ({ task, onToggle }) => (
  <label className="flex items-center space-x-3 py-2 border-b border-amber-200">
    <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="form-checkbox h-5 w-5 text-amber-600 rounded focus:ring-amber-500" />
    <span className={`text-stone-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</span>
  </label>
);

export const ProjectRoom: React.FC<ProjectRoomProps> = ({ quest, users, currentUser, onSelectUser, onUpdateQuest, onRequestAuth }) => {
  const client = users.find(u => u.id === quest.clientId);
  const participants = users.filter(u => quest.participants.includes(u.id));

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>(PROJECT_CHAT);
  const [newMessage, setNewMessage] = useState('');

  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;
    const message: ChatMessageType = {
        id: Date.now(),
        userId: currentUser.id,
        message: newMessage,
        timestamp: new Date().toISOString(),
    };
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };

  const handleJoinQuest = () => {
    if (!currentUser) {
        onRequestAuth();
        return;
    }
    const updatedQuest = {
        ...quest,
        participants: [...quest.participants, currentUser.id]
    };
    onUpdateQuest(updatedQuest);
  };

  const handleGenerateTasks = async () => {
    setIsGeneratingTasks(true);
    setSuggestedTasks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `
        以下のクエストを達成するための具体的なタスクリストを提案してください。
        タイトル: ${quest.title}
        内容: ${quest.description}
        
        各タスクは簡潔で実行可能なものにしてください。
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['tasks']
          }
        }
      });
      const result = JSON.parse(response.text);
      setSuggestedTasks(result.tasks || []);
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("AIによるタスク提案中にエラーが発生しました。");
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleAcceptTasks = () => {
    const newTasks: TaskType[] = suggestedTasks.map((text, index) => ({
      id: Date.now() + index,
      text,
      completed: false,
    }));
    setTasks(newTasks);
    setSuggestedTasks([]);
  };
  
  const isQuestCompleted = quest.status === '完了';
  const canJoin = currentUser && currentUser.id !== quest.clientId && !quest.participants.includes(currentUser.id) && quest.status !== '完了';
  const canManageTasks = currentUser && (quest.participants.includes(currentUser.id) || quest.clientId === currentUser.id);

  return (
    <div className="space-y-6">
       {isQuestCompleted && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg" role="alert">
          <p className="font-bold text-lg">クエスト完了！</p>
          <p>おつかれさまでした！素晴らしい冒険でしたね。</p>
        </div>
      )}

      <Card>
        <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-2">{quest.title}</h2>
                <div className="flex items-center mb-4">
                <span className="text-sm text-stone-600 mr-4">依頼主:</span>
                {client && (
                    <button onClick={() => onSelectUser(client.id)} className="flex items-center">
                    <img src={client.avatarUrl} alt={client.name} className="h-8 w-8 rounded-full mr-2 border-2 border-amber-200"/>
                    <span className="text-sm font-medium text-amber-800 hover:underline">{client.name}</span>
                    </button>
                )}
                </div>
            </div>
            {canJoin && (
                <button 
                    onClick={handleJoinQuest}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-full hover:bg-green-700 transition-transform hover:scale-105"
                >
                    クエストに参加する
                </button>
            )}
        </div>
        <p className="text-stone-700 mb-4">{quest.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
            {quest.requiredTags.map(tag => <TagChip key={tag} tag={tag} />)}
        </div>
        <div className="text-right">
            <div className="font-bold text-2xl text-amber-900">{quest.reward}</div>
            <div className="text-sm text-amber-700">謝礼</div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h3 className="text-xl font-bold text-amber-900 mb-4">チャット</h3>
                <div className="h-96 overflow-y-auto p-2 bg-amber-50 rounded-lg flex flex-col">
                    {chatMessages.map(msg => {
                        const user = users.find(u => u.id === msg.userId);
                        return <ChatMessage key={msg.id} message={msg} user={user} isCurrentUser={currentUser?.id === msg.userId} />
                    })}
                </div>
                 <div className="mt-4 flex">
                    <input 
                        type="text" 
                        placeholder={currentUser ? "メッセージを入力..." : "チャットに参加するにはログインしてください"}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={!currentUser}
                        className="w-full px-4 py-2 rounded-l-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:bg-gray-100" />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!currentUser}
                        className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 transition-colors disabled:bg-gray-400">
                        送信
                    </button>
                </div>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <h3 className="text-xl font-bold text-amber-900 mb-4">参加メンバー</h3>
                <ul className="space-y-3">
                {participants.map(p => (
                    <li key={p.id} className="flex items-center cursor-pointer" onClick={() => onSelectUser(p.id)}>
                        <img src={p.avatarUrl} alt={p.name} className="h-10 w-10 rounded-full mr-3 border-2 border-amber-200"/>
                        <span className="font-medium text-stone-800 hover:underline">{p.name}</span>
                    </li>
                ))}
                 {participants.length === 0 && <p className="text-stone-600">まだ参加メンバーがいません。</p>}
                </ul>
            </Card>
             <Card>
                <h3 className="text-xl font-bold text-amber-900 mb-4">タスクリスト</h3>
                <div>
                    {tasks.length > 0 ? (
                        tasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} />)
                    ) : (
                         canManageTasks && (
                            <div className="text-center p-4">
                                <p className="text-stone-600 mb-4">まだタスクがありません。AIに提案してもらいましょう！</p>
                                <button
                                    onClick={handleGenerateTasks}
                                    disabled={isGeneratingTasks}
                                    className="bg-sky-600 text-white font-bold py-2 px-6 rounded-full hover:bg-sky-700 transition-transform hover:scale-105 inline-flex items-center gap-2"
                                >
                                    {isGeneratingTasks ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <SparklesIcon className="h-5 w-5"/>
                                    )}
                                    AIでタスクを提案
                                </button>
                            </div>
                        )
                    )}

                     {suggestedTasks.length > 0 && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <h4 className="font-semibold text-amber-800 mb-2">AIからのタスク提案</h4>
                            <ul className="list-disc list-inside space-y-1 text-stone-700">
                                {suggestedTasks.map((task, index) => <li key={index}>{task}</li>)}
                            </ul>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setSuggestedTasks([])} className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300">閉じる</button>
                                <button onClick={handleAcceptTasks} className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-700">承認する</button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};