'use server';

import sql from './lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export interface Message {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

// 1. Inscription d'un utilisateur
export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    throw new Error("Tous les champs sont obligatoires.");
  }

  try {
    // Hachage sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${hashedPassword})
    `;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw new Error("Ce pseudo est déjà pris ou une erreur est survenue.");
  }
}

// 2. Connexion d'un utilisateur
export async function loginUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    throw new Error("Tous les champs sont obligatoires.");
  }

  try {
    const users = await sql`
      SELECT id, username, password_hash FROM users WHERE username = ${username}
    `;

    if (users.length === 0) {
      throw new Error("Utilisateur introuvable.");
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error("Mot de passe incorrect.");
    }

    // Création d'un cookie de session simple stockant l'ID utilisateur
    const cookieStore = await cookies();
    cookieStore.set('session_user_id', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: '/',
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
}

// 3. Récupérer l'utilisateur connecté via le cookie
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (!userId) return null;

    const users = await sql`
      SELECT id, username FROM users WHERE id = ${userId}
    `;

    return users.length > 0 ? users[0] : null;
  } catch {
    return null;
  }
}

// 4. Déconnexion
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('session_user_id');
}

// 5. Récupérer tous les messages avec les vrais pseudos liés
export async function getMessages(): Promise<Message[]> {
  try {
    const rows = await sql`
      SELECT messages.id, users.username, messages.content, messages.created_at 
      FROM messages 
      JOIN users ON messages.user_id = users.id 
      ORDER BY messages.created_at ASC 
      LIMIT 50
    `;
    
    return rows.map((row) => ({
      id: Number(row.id),
      username: String(row.username),
      content: String(row.content),
      created_at: new Date(String(row.created_at)).toLocaleTimeString(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return [];
  }
}

// 6. Envoyer un message en associant l'ID de l'utilisateur connecté
export async function sendMessage(content: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;

  if (!userId) {
    throw new Error("Vous devez être connecté pour envoyer un message.");
  }

  if (!content.trim()) return;

  try {
    await sql`
      INSERT INTO messages (user_id, content) 
      VALUES (${userId}, ${content})
    `;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw new Error("Impossible d'envoyer le message.");
  }
}