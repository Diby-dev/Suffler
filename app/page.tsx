import { getCurrentUser, getMessages } from './actions';
import ChatRoom from './components/ChatRoom';
import HomeClient from './components/HomeClient';

export default async function Page() {
  const user = await getCurrentUser();

  // Si l'utilisateur est déjà connecté, on l'oriente directement vers le chat
  if (user) {
    const currentUser = {
      id: Number(user.id),
      username: String(user.username),
    };
    const initialMessages = await getMessages();

    return (
      <main>
        <ChatRoom initialMessages={initialMessages} currentUser={currentUser} />
      </main>
    );
  }

  // Sinon, on affiche la nouvelle page d'accueil cinématique
  return <HomeClient />;
}