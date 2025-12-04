'use server';

import { revalidatePath } from 'next/cache';

export async function createContestAction(formData: FormData) {
  // This is a server action placeholder
  // In production, you'd call your API here with proper authentication
  revalidatePath('/organizer/contests');
  return { success: true };
}

export async function updateContestAction(id: string, formData: FormData) {
  revalidatePath(`/organizer/contests/${id}`);
  revalidatePath('/organizer/contests');
  return { success: true };
}

export async function deleteContestAction(id: string) {
  revalidatePath('/organizer/contests');
  return { success: true };
}

export async function transitionWorkflowAction(contestId: string, toStep: string, userId: string) {
  revalidatePath(`/organizer/contests/${contestId}`);
  return { success: true };
}

export async function executeRulesAction(contestId: string, userId: string) {
  revalidatePath(`/organizer/contests/${contestId}`);
  return { success: true };
}

export async function assignJuryAction(contestId: string) {
  revalidatePath(`/organizer/contests/${contestId}`);
  return { success: true };
}

export async function calculateScoresAction(contestId: string) {
  revalidatePath(`/organizer/contests/${contestId}`);
  return { success: true };
}
