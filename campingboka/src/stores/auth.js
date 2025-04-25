import { defineStore } from 'pinia';
import { auth }        from '@/tools/firebase.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
  }),
  actions: {
    async signIn(email, password) {
      this.loading = true;
      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        this.user    = cred.user;
        return cred.user;
      } finally {
        this.loading = false;
      }
    },
    async signOut() {
      await auth.signOut();
      this.user = null;
    },
    setUser(u) {
      this.user    = u;
      this.loading = false;
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
  }
});