import { realtime } from '@/lib/realtime-setup/realtime';
import { handle } from '@upstash/realtime';

export const GET = handle({ realtime });
