import { computed, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { IResponse } from "@app-types/api";
import type { IUserNote } from "@app-types/user";
import { authHeader, handleAxiosErrors } from "@utils/axios";
import { getUserTypeForRoute } from "@utils/helpers";

const BASE_URL = getUserTypeForRoute("notes");

/**
 * Pinia store to manage user notes
 */
export const useUserNotesStore = defineStore("user-notes", () => {
  /** Array of *user `note`* objects */
  const notes = ref<IUserNote[]>([]);

  /** `boolean` to represent if the notes have been fetched from backend or not */
  const didFetchNotes = ref(false);

  /** total `number` of notes stored in state */
  const totalNotes = computed(() => notes.value.length);

  /**
   * Fetches all the user notes from backend API.
   * Stores them in `notes`.
   *
   * @param {number} userId - ID of the user
   */
  const getAllNotes = async (userId: number) => {
    try {
      const response = await axios.get<IResponse<IUserNote[]>>(
        `${BASE_URL}?user_id=${userId}`,
        { headers: authHeader() }
      );

      notes.value = [...response.data.data!];
      didFetchNotes.value = true;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Adds a new *user `note`* to the database.
   * Pushes it to local `notes`.
   *
   * @param {number} user_id - ID of the user
   * @param {string} title - title for the new note
   * @param {string} description - description of the new note
   */
  const addNote = async (
    user_id: number,
    title: string,
    description: string
  ) => {
    try {
      const response = await axios.post<IResponse<IUserNote>>(
        `${BASE_URL}`,
        { user_id, title, description },
        { headers: authHeader() }
      );

      notes.value.push(response.data.data!);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  /**
   * Removes a *note* from the Database.
   * Also removes it from local state.
   *
   * @param {number} noteId - ID of the note to remove
   */
  const deleteNote = async (noteId: number) => {
    try {
      const response = await axios.delete<IResponse<undefined>>(
        `${BASE_URL}/${noteId}`,
        { headers: authHeader() }
      );

      notes.value = notes.value.filter((note) => note.id !== noteId);

      if (!response.data.success) throw response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) handleAxiosErrors(e);
      else throw e;
    }
  };

  return {
    notes,
    didFetchNotes,
    totalNotes,
    getAllNotes,
    addNote,
    deleteNote,
  };
});
