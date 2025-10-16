import React, { useState, useMemo } from 'react';
import { WisdomCard } from './WisdomCard';
import { User, Tag, WisdomEntry as WisdomEntryType } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Card } from './common/Card';
import { ANONYMOUS_USER } from '../constants';

interface WisdomBoardProps {
    wisdoms: WisdomEntryType[];
    users: User[];
    currentUser: User | null;
    onSelectUser: (userId: number) => void;
    onCreateWisdom: (newWisdom: Omit<WisdomEntryType, 'id' | 'timestamp'>) => void;
    onRequestAuth: () => void;
}

export const WisdomBoard: React.FC<WisdomBoardProps> = ({ wisdoms, users, currentUser, onSelectUser, onCreateWisdom, onRequestAuth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Set<Tag>>(new Set());
    
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newProblem, setNewProblem] = useState('');
    const [newSolution, setNewSolution] = useState('');
    const [newTags, setNewTags] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const allTags = useMemo(() => {
        const tags = new Set<Tag>();
        wisdoms.forEach(wisdom => wisdom.tags.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
    }, [wisdoms]);

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

    const handleToggleForm = () => {
        setIsFormVisible(!isFormVisible);
    }
    
    const handleGenerateSolution = async () => {
        if (!newProblem.trim()) {
            alert('まずは課題を入力してください。');
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `課題: ${newProblem}`,
                config: {
                    systemInstruction: "あなたは地域の助け合いコミュニティ『現代リアルギルド』の賢者のような存在です。メンバーが抱える課題に対して、実用的で温かみのある解決策やライフハックを、簡潔な「〇〇 is... △△」という形式に沿って、解決策の部分だけを日本語で提案してください。",
                }
            });
            setNewSolution(response.text);
        } catch (error) {
            console.error("Error generating solution:", error);
            alert("AIによる解決策の生成中にエラーが発生しました。");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newProblem.trim() || !newSolution.trim()) {
            alert('課題と解決策の両方を入力してください。');
            return;
        }

        const authorId = currentUser ? currentUser.id : ANONYMOUS_USER.id;
        
        const newWisdom: Omit<WisdomEntryType, 'id' | 'timestamp'> = {
            authorId: authorId,
            problem: newProblem,
            solution: newSolution,
            tags: newTags.split(',').map(t => `#${t.trim()}`).filter(t => t.length > 1),
        };
        onCreateWisdom(newWisdom);
        // Reset form
        setNewProblem('');
        setNewSolution('');
        setNewTags('');
        setIsFormVisible(false);
    };

    const filteredWisdoms = useMemo(() => {
        return wisdoms.filter(wisdom => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = wisdom.problem.toLowerCase().includes(lowercasedSearchTerm) || wisdom.solution.toLowerCase().includes(lowercasedSearchTerm);
            const matchesTags = selectedTags.size === 0 || wisdom.tags.some(tag => selectedTags.has(tag));
            return matchesSearch && matchesTags;
        });
    }, [wisdoms, searchTerm, selectedTags]);

    return (
        <div>
            <Card className="mb-8">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-amber-900 mb-2">ギルドの知恵袋</h2>
                        <p className="text-amber-800">日々の活動で得た知恵やライフハックを共有しましょう。</p>
                    </div>
                    <button
                        onClick={handleToggleForm}
                        className="bg-amber-600 text-white font-bold py-2 px-6 rounded-full hover:bg-amber-700 transition-transform hover:scale-105"
                    >
                        {isFormVisible ? 'フォームを閉じる' : '新しい知恵を投稿する'}
                    </button>
                </div>
                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="mt-6 border-t-2 border-amber-200 pt-6">
                         {!currentUser && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md mb-4 text-sm">
                                <p>現在ログインしていません。「匿名さん」として投稿されます。</p>
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="problem" className="block text-lg font-semibold text-amber-800 mb-2">Q. 課題・お悩み</label>
                            <input
                                id="problem"
                                type="text"
                                value={newProblem}
                                onChange={e => setNewProblem(e.target.value)}
                                placeholder="例：チームの意見がまとまらない"
                                className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                required
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="solution" className="block text-lg font-semibold text-amber-800 mb-2">A. 解決策・ライフハック</label>
                            <textarea
                                id="solution"
                                value={newSolution}
                                onChange={e => setNewSolution(e.target.value)}
                                placeholder="AIに相談するか、自分で解決策を入力..."
                                className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                                rows={4}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleGenerateSolution}
                                disabled={isGenerating}
                                className="absolute bottom-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-600 disabled:bg-gray-400 flex items-center"
                            >
                                {isGenerating ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : '🤖'}
                                AIに相談する
                            </button>
                        </div>
                        
                        <div className="mb-6">
                             <label htmlFor="tags" className="block text-sm font-medium text-amber-800 mb-1">関連タグ (カンマ区切り)</label>
                             <input
                                id="tags"
                                type="text"
                                value={newTags}
                                onChange={e => setNewTags(e.target.value)}
                                placeholder="例：家庭菜園, 料理"
                                className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                            投稿する
                        </button>
                    </form>
                )}
            </Card>

            <div className="bg-amber-100/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-8 border border-amber-300">
                <input
                    type="text"
                    placeholder="キーワードで知恵を検索..."
                    className="w-full px-4 py-2 rounded-md border border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                {filteredWisdoms.map(wisdom => {
                    const author = users.find(user => user.id === wisdom.authorId);
                    return (
                        <WisdomCard
                            key={wisdom.id}
                            wisdom={wisdom}
                            author={author}
                            onSelectUser={onSelectUser}
                        />
                    );
                })}
            </div>
        </div>
    );
};