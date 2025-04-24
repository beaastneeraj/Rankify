import { redirect } from 'next/navigation';
import { rankingYears } from '@/lib/config';

export async function GET() {
  redirect(`/ranking/${rankingYears[0]}`);
}
