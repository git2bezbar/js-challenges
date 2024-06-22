import type { Note } from '../services/types';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NoteState {
  notes: Array<Note>;
  addNote: (note: Note) => void;
  removeNote: (uuid: Note['uuid']) => void;
  updateNote: (note: Note) => void;
  getNote: (uuid: Note['uuid']) => Note | undefined;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note: Note) => set((state: NoteState) => {
        note.createdAt = new Date();
        note.updatedAt = new Date();
        return { notes: [...state.notes, note] };
      }),
      removeNote: (uuid: Note['uuid']) => set((state: NoteState) => ({
        notes: state.notes.filter((note) => note.uuid !== uuid)
      })),
      updateNote: (note: Note) => set((state: NoteState) => {
        const oldNote = state.notes.find((n) => n.uuid === note.uuid);
        if (!oldNote) {
          return state;
        }
        note = { ...oldNote, ...note, updatedAt: new Date() };
        const notes = state.notes.map((n) => (n.uuid === note.uuid ? note : n));
        return { notes };
      }),
      getNote: (uuid: Note['uuid']) => {
        const { notes } = get();
        return notes.find((note) => note.uuid === uuid);
      },
    }),
    {
      name: 'notes',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
