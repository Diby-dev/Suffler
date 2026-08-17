import ChatRoom from './components/ChatRoom';
import { getMessages, getCurrentUser } from './actions';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Conversion propre pour correspondre aux propriétés attendues
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