import { client } from '@/lib/redis-setup/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Custom hook pour créer une room
 * ⚠️ Doit être appelé dans un composant React (pas dans un onClick)
 */
export const useCreateRoom = () => {
  const router = useRouter();

  return useMutation({
    // Fonction pure : juste l'appel API
    mutationFn: async () => {
      const res = await client.room.create.post();
      return res;
    },

    // Effet secondaire en cas de succès (status 200-299)
    onSuccess: (res) => {
      if (res.data?.roomId) {
        router.push(`/room/${res.data.roomId}`);
      }
    },

    // Gestion d'erreur
    onError: (error) => {
      console.error('Failed to create room:', error);
      // TODO: Ajouter un toast notification ici
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({
      sender,
      text,
      roomId,
    }: {
      sender: string;
      text: string;
      roomId: string;
    }) => {
      // Eden Treaty: premier arg = body, deuxième arg = options (query, headers...)
      await client.messages.post(
        { sender, text }, // ← body
        { query: { roomId } } // ← query params
      );
    },

    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });
};

export const useFetchMessages = (roomId: string) => {
  return useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
  });
};

export const useGetTimeRemaining = (roomId: string) => {
  return useQuery({
    queryKey: ['ttl', roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });
};

export const useDestroyRoom = () => {
  return useMutation({
    mutationFn: async (roomId: string) => {
      await client.room.delete(null, { query: { roomId } });
    },

    onError: (error) => {
      console.error('Failed to destroy room:', error);
    },
  });
};

// ============ E2E ENCRYPTION - KEY EXCHANGE ============

/**
 * Envoyer sa clé publique au serveur pour l'échange E2E
 */
export const useSendPublicKey = () => {
  return useMutation({
    mutationFn: async ({
      roomId,
      publicKey,
    }: {
      roomId: string;
      publicKey: string;
    }) => {
      await client.room.keys.post({ publicKey }, { query: { roomId } });
    },

    onError: (error) => {
      console.error('Failed to send public key:', error);
    },
  });
};

/**
 * Récupérer la clé publique de l'autre user
 */
export const useGetOtherPublicKey = (roomId: string) => {
  return useQuery({
    queryKey: ['publicKey', roomId],
    queryFn: async () => {
      const res = await client.room.keys.get({ query: { roomId } });
      return res.data;
    },
    // Réessayer toutes les 2 secondes si l'autre user n'est pas encore là
    refetchInterval: (query) => {
      // Arrêter de refetch si on a la clé
      if (query.state.data?.otherPublicKey) return false;
      return 2000;
    },
  });
};
