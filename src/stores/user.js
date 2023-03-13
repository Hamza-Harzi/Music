import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(v) {
      const userCred = await auth.createUserWithEmailAndPassword(
        v.email,
        v.password
      );
      await usersCollection.doc(userCred.user.uid).set({
        name: v.name,
        email: v.email,
        age: v.age,
        type: v.type,
        country: v.country,
      });

      await userCred.user.updateProfile({
        displayName: v.name,
      });

      this.userLoggedIn = true;
    },

    async authenticate(v) {
      await auth.signInWithEmailAndPassword(v.email, v.password);

      this.userLoggedIn = true;
    },

    async signOut() {
      await auth.signOut();

      this.userLoggedIn = false;
    },
  },
});
