import React, { useState, useMemo, useEffect } from 'react';
import { QuestCard } from './QuestCard';
import { SuggestedQuestCard } from './SuggestedQuestCard';
import { Quest, Tag, User, QuestStatus } from '../types';
import { Card } from './common/Card';
import { JAPAN_PREFECTURES } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { SparklesIcon } from './icons/Icons';

interface QuestBoardProps {
    quests: Quest[];
    users: User[];
    currentUser: User | null;
    onSelectQuest: (questId: number) => void;
    onSelectUser: (userId: number) => void;
    onCreateQuest: (newQuest: Omit<Quest, 'id' | 'participants' | 'status'>) => void;
    onRequestAuth: () => void;
}

interface AISuggestion {
    questId: number;
    reason: string;
}

const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }, [text]);
  
    return <p className="font-semibold text-amber-800">{displayedText}</p>;
};


export const QuestBoard: React.FC<QuestBoardProps> = ({ quests, users, currentUser, onSelectQuest, onSelectUser, onCreateQuest, onRequestAuth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Set<Tag>>(new Set());
    const [selectedPrefecture, setSelectedPrefecture] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [tags, setTags] = useState('');
    const [prefecture, setPrefecture] = useState(currentUser?.prefecture || JAPAN_PREFECTURES[12]);

    // AI Suggestions state
    const [suggestedQuests, setSuggestedQuests] = useState<AISuggestion[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);


    const allTags = useMemo(() => {
        const tags = new Set<Tag>();
        quests.forEach(quest => quest.requiredTags.forEach(tag => tags.add(tag)));
        return Array.from(tags);
    }, [quests]);

    const handleTagClick = (tag: Tag) => {
        setSelectedTags(prev => {
            const newTags = new Set(prev);
            if (newTags.has(tag)) {
                newTags.delete(tag);
            } else {
                newTags.add(tag);
            }
            return newTags;
        });
    };

    const filteredQuests = useMemo(() => {
        return quests.filter(quest => {
            const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) || quest.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = selectedTags.size === 0 || quest.requiredTags.some(tag => selectedTags.has(tag));
            const matchesPrefecture = selectedPrefecture === '' || quest.prefecture === selectedPrefecture;
            return matchesSearch && matchesTags && matchesPrefecture;
        });
    }, [quests, searchTerm, selectedTags, selectedPrefecture]);
    
    const handleToggleForm = () => {
        if (!currentUser) {
            onRequestAuth();
        } else {
            setPrefecture(currentUser.prefecture || JAPAN_PREFECTURES[12]);
            setIsFormVisible(!isFormVisible);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            onRequestAuth();
            return;
        }
        if (!title.trim() || !description.trim() || !reward.trim() || !prefecture) {
            alert('すべての項目を入力してください。');
            return;
        }
        onCreateQuest({
            title,
            description,
            clientId: currentUser.id,
            reward,
            requiredTags: tags.split(',').map(t => `#${t.trim()}`).filter(t => t.length > 1),
            prefecture,
        });
        // Reset form
        setTitle('');
        setDescription('');
        setReward('');
        setTags('');
        setPrefecture(currentUser.prefecture || JAPAN_PREFECTURES[12]);
        setIsFormVisible(false);
    };

    const handleGenerateSuggestions = async () => {
        if (!currentUser) return;

        setIsGenerating(true);
        setSuggestedQuests([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const openQuests = quests.filter(q => q.status === QuestStatus.Open && !q.participants.includes(currentUser.id) && q.clientId !== currentUser.id);

            if (openQuests.length === 0) {
                alert("おすすめできるクエストが現在ありません。");
                setIsGenerating(false);
                return;
            }

            const simplifiedQuests = openQuests.map(q => ({
                id: q.id,
                title: q.title,
                description: q.description,
                requiredTags: q.requiredTags
            }));

            const prompt = `
                以下はギルドメンバーのプロフィールです:
                - スキル: ${currentUser.skills.join(', ')}

                以下は現在募集中のクエストのリストです:
                ${JSON.stringify(simplifiedQuests)}

                このメンバーのスキルに基づいて、リストの中から最大3つまで、最適なクエストをおすすめしてください。
                それぞれのクエストについて、なぜそれが彼/彼女に合っているのか、パーソナライズされた短い理由を添えてください。
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                description: 'List of quest recommendations.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        questId: {
                                            type: Type.NUMBER,
                                            description: 'The ID of the recommended quest.'
                                        },
                                        reason: {
                                            type: Type.STRING,
                                            description: 'A short, personalized reason for the recommendation.'
                                        }
                                    },
                                    required: ['questId', 'reason']
                                }
                            }
                        },
                        required: ['recommendations']
                    }
                }
            });
            const resultText = response.text;
            const result = JSON.parse(resultText);
            setSuggestedQuests(result.recommendations);

        } catch (error) {
            console.error("Error generating quest suggestions:", error);
            alert("AIによるおすすめの生成中にエラーが発生しました。");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <Card className="mb-8">
                 <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-amber-900 mb-2">クエストボード</h2>
                        <p className="text-amber-800">街の困りごとやお願いが集まる掲示板です。</p>
                    </div>
                    <button
                        onClick={handleToggleForm}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-full hover:bg-amber-700 transition-transform hover:scale-105"
                    >
                        {isFormVisible ? '依頼フォームを閉じる' : '新しいクエストを依頼する'}
                    </button>
                </div>
                {isFormVisible && (
                     <form onSubmit={handleSubmit} className="mt-6 border-t-2 border-amber-200 pt-6">
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-lg font-semibold text-amber-800 mb-2">依頼タイトル</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="例：カフェの新メニューのチラシ作成" className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-lg font-semibold text-amber-800 mb-2">依頼内容</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="依頼の詳しい内容を書いてください" className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" rows={4} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             <div>
                                <label htmlFor="reward" className="block text-lg font-semibold text-amber-800 mb-2">謝礼</label>
                                <input id="reward" type="text" value={reward} onChange={e => setReward(e.target.value)} placeholder="例：当店のお食事券3000円分" className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" required />
                            </div>
                            <div>
                                <label htmlFor="prefecture" className="block text-lg font-semibold text-amber-800 mb-2">都道府県</label>
                                <select id="prefecture" value={prefecture} onChange={e => setPrefecture(e.target.value)} className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" required>
                                    {JAPAN_PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="mb-6">
                            <label htmlFor="tags" className="block text-lg font-semibold text-amber-800 mb-2">希望スキル (カンマ区切り)</label>
                            <input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="例: Webデザイン, 写真撮影" className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600" />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                            依頼を投稿する
                        </button>
                    </form>
                )}
            </Card>

            {currentUser && (
                <div className="bg-amber-100/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-200 p-6 mb-8">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                        <SparklesIcon className="h-8 w-8 text-amber-700"/>
                        <h2 className="text-2xl font-bold text-amber-900">ギルドマスターからの密命</h2>
                    </div>

                    {isGenerating && (
                        <div className="flex flex-col items-center justify-center p-6 text-amber-800 min-h-[100px]">
                            <TypingEffect text="AIがあなたにぴったりのクエストを探しています..." />
                        </div>
                    )}

                    {!isGenerating && suggestedQuests.length === 0 && (
                        <div className="text-center">
                            <p className="text-amber-800 mb-4">あなたのスキルに合ったクエストをAIが探します。</p>
                            <button
                                onClick={handleGenerateSuggestions}
                                disabled={isGenerating}
                                className="bg-sky-600 text-white font-bold py-2 px-6 rounded-full hover:bg-sky-700 transition-transform hover:scale-105 inline-flex items-center gap-2 shadow-md"
                            >
                                <SparklesIcon className="h-5 w-5"/>
                                AIに相談する
                            </button>
                        </div>
                    )}
                    
                    {!isGenerating && suggestedQuests.length > 0 && (
                       <div>
                            <div className="flex overflow-x-auto space-x-6 pb-4">
                                {suggestedQuests.map(suggestion => {
                                    const quest = quests.find(q => q.id === suggestion.questId);
                                    if (!quest) return null;
                                    const client = users.find(u => u.id === quest.clientId);

                                    return (
                                        <div key={suggestion.questId} className="flex-shrink-0 w-[320px]">
                                            <SuggestedQuestCard
                                                quest={quest}
                                                client={client}
                                                reason={suggestion.reason}
                                                onSelectQuest={onSelectQuest}
                                                onSelectUser={onSelectUser}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                             <div className="text-center mt-6">
                                <button
                                    onClick={handleGenerateSuggestions}
                                    disabled={isGenerating}
                                    className="bg-sky-600 text-white font-bold py-2 px-6 rounded-full hover:bg-sky-700 transition-transform hover:scale-105 inline-flex items-center gap-2 shadow-md"
                                >
                                    <SparklesIcon className="h-5 w-5"/>
                                    もう一度相談する
                                </button>
                            </div>
                       </div>
                    )}
                </div>
            )}

            <div className="bg-amber-100/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-8 border border-amber-300">
                <h2 className="text-xl font-bold text-amber-900 mb-4">クエストを探す</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="キーワードで検索..."
                        className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={selectedPrefecture}
                        onChange={(e) => setSelectedPrefecture(e.target.value)}
                         className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                    >
                        <option value="">すべての都道府県</option>
                        {JAPAN_PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.has(tag) ? 'bg-amber-600 text-white' : 'bg-white text-amber-800 border border-amber-400 hover:bg-amber-200'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuests.map(quest => {
                    const client = users.find(user => user.id === quest.clientId);
                    return (
                        <QuestCard
                            key={quest.id}
                            quest={quest}
                            client={client}
                            onSelectQuest={onSelectQuest}
                            onSelectUser={onSelectUser}
                        />
                    );
                })}
            </div>
        </div>
    );
};
