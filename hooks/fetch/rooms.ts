import { client } from '@/lib/redis-setup/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Custom hook pour creer une room
 */
export const useCreateRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      return res;
    },

    onSuccess: (res) => {
      if (res.data?.roomId) {
        router.push(`/room/${res?.data?.roomId}`);
      }
    },

    onError: (error) => {
      console.error('Failed to create room:', error);
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
      await client.messages.post({ sender, text }, { query: { roomId } });
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

// ============ E2E ENCRYPTION - HYBRID KEY EXCHANGE (ECDH + KYBER) ============

/**
 * Cles publiques hybrides (ECDH + Kyber)
 */
export interface HybridPublicKeys {
  ecdh: string;
  kyber: string;
}

/**
 * Donnees recues de l'autre user
 */
export interface OtherKeyData {
  ecdh: string | null;
  kyber: string | null;
  kyberCiphertext: string | null;
}

/**
 * Envoyer ses cles publiques hybrides au serveur pour l'echange E2E
 */
export const useSendHybridPublicKeys = () => {
  return useMutation({
    mutationFn: async ({
      roomId,
      publicKeys,
    }: {
      roomId: string;
      publicKeys: HybridPublicKeys;
    }) => {
      await client.room.keys.post(
        {
          ecdhPublicKey: publicKeys.ecdh,
          kyberPublicKey: publicKeys.kyber,
        },
        { query: { roomId } }
      );
    },

    onError: (error) => {
      console.error('Failed to send hybrid public keys:', error);
    },
  });
};

/**
 * Envoyer le ciphertext Kyber (seulement pour l'initiateur)
 */
export const useSendKyberCiphertext = () => {
  return useMutation({
    mutationFn: async ({
      roomId,
      kyberCiphertext,
    }: {
      roomId: string;
      kyberCiphertext: string;
    }) => {
      await client.room.kyber.post({ kyberCiphertext }, { query: { roomId } });
    },

    onError: (error) => {
      console.error('Failed to send Kyber ciphertext:', error);
    },
  });
};

/**
 * Recuperer les cles publiques de l'autre user
 */
export const useGetOtherHybridPublicKeys = (roomId: string) => {
  return useQuery({
    queryKey: ['hybridPublicKeys', roomId],
    queryFn: async () => {
      const res = await client.room.keys.get({ query: { roomId } });
      return res.data as OtherKeyData | null;
    },
    // Reessayer toutes les 2 secondes si l'autre user n'est pas encore la
    refetchInterval: (query) => {
      const data = query.state.data;
      // Arreter de refetch si on a les deux cles
      if (data?.ecdh && data?.kyber) return false;
      return 2000;
    },
  });
};

/**
 * Recuperer le ciphertext Kyber (pour le destinataire)
 */
export const useGetKyberCiphertext = (roomId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['kyberCiphertext', roomId],
    queryFn: async () => {
      const res = await client.room.kyber.get({ query: { roomId } });
      return res.data as { kyberCiphertext: string | null } | null;
    },
    enabled,
    refetchInterval: (query) => {
      if (query.state.data?.kyberCiphertext) return false;
      return 2000;
    },
  });
};

// ============ LEGACY (COMPATIBILITE) ============

/**
 * @deprecated Utiliser useSendHybridPublicKeys a la place
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
      await client.room.keys.post(
        { ecdhPublicKey: publicKey, kyberPublicKey: '' },
        { query: { roomId } }
      );
    },

    onError: (error) => {
      console.error('Failed to send public key:', error);
    },
  });
};

/**
 * @deprecated Utiliser useGetOtherHybridPublicKeys a la place
 */
export const useGetOtherPublicKey = (roomId: string) => {
  return useQuery({
    queryKey: ['publicKey', roomId],
    queryFn: async () => {
      const res = await client.room.keys.get({ query: { roomId } });
      return res.data;
    },
    refetchInterval: (query) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((query.state.data as any)?.ecdh) return false;
      return 2000;
    },
  });
};
