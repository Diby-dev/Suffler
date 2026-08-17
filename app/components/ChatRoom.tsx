'use client';

import { useState, useTransition, useEffect } from 'react';
import { sendMessage, logoutUser, getMessages, Message } from '../actions';
import { useRouter } from 'next/navigation';
import ScrollBackground from './ScrollBackground';

interface ChatRoomProps {
  initialMessages: Message[];
  currentUser: { id: number; username: string };
}

function getUserColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'text-pink-400',
    'text-purple-400',
    'text-green-400',
    'text-yellow-400',
    'text-orange-400',
    'text-cyan-400',
    'text-red-400',
    'text-indigo-400'
  ];
  return colors[Math.abs(hash) % colors.length];
}

export default function ChatRoom({ initialMessages, currentUser }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputContent, setInputContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latestMessages = await getMessages();
        setMessages(latestMessages);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des messages", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const contentToSend = inputContent;
    setInputContent('');

    startTransition(async () => {
      try {
        await sendMessage(contentToSend);
        const latestMessages = await getMessages();
        setMessages(latestMessages);
        router.refresh();
      } catch {
        alert("Erreur lors de l'envoi du message.");
      }
    });
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="relative min-h-[150vh] flex flex-col text-white">
      {/* Fond animé par le scroll */}
      <ScrollBackground />

      {/* En-tête fixe */}
      <header className="sticky top-0 z-50 p-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Suffler</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-blue-600/80 backdrop-blur px-3 py-1 rounded-full">
            <strong>{currentUser.username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Bannière d'avertissement */}
      <div className="sticky z-40 bg-yellow-900/70 backdrop-blur-md border-b border-yellow-700/50 py-2 px-4 text-center text-xs text-yellow-200 flex justify-center items-center gap-2 shadow-inner">
        <span><strong>Chat Public :</strong> Tous les messages envoyés ici sont visibles par tout le monde. Restez prudent et évitez de partager des informations confidentielles !</span>
      </div>

      {/* Corps des messages avec fond semi-transparent pour la lisibilité */}
      <div className="flex-1 p-4 space-y-4 max-w-4xl mx-auto w-full my-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-300 bg-gray-900/60 backdrop-blur-md p-6 rounded-lg mt-10">Aucun message pour le moment. Soyez le premier à parler !</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.username === currentUser.username;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-lg max-w-xl shadow-lg backdrop-blur-md ${isMe ? 'bg-blue-950/70 border border-blue-700/50' : 'bg-gray-900/70 border border-gray-700/50'}`}>
                  <div className="flex justify-between items-center mb-1 gap-4">
                    <span className={`font-bold text-sm ${getUserColor(msg.username)}`}>
                      {msg.username} {isMe && '(Moi)'}
                    </span>
                    <span className="text-xs text-gray-400">{msg.created_at}</span>
                  </div>
                  <p className="text-gray-100 wrap-break-words">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formulaire d'envoi fixe en bas */}
      <form onSubmit={handleSendMessage} className="sticky bottom-0 z-50 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 flex gap-2 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Tapez votre message..."
          disabled={isPending}
          className="flex-1 p-2 rounded bg-gray-800/80 border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-50 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition disabled:opacity-50 shadow-lg"
        >
          {isPending ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}