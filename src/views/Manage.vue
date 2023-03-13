<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, i) in songs"
              :key="song.docId"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppUpload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { songsCollection, auth } from "@/includes/firebase";
// import useUserStore from "@/stores/user";
export default {
  name: "Manage",
  components: {
    AppUpload,
    CompositionItem,
  },

  data() {
    return {
      songs: [],
      // if true nous devrions essayer d'empêcher l'utilisateur de naviguer
      unsavedFlag: false,
    };
  },
  //we want to retrieve the list of songs the user has uploaded so far should be requested before the component gets loaded on the page
  async created() {
    // this function will return the documents it finds
    // Querying the data base by calling the where function
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get();

    // this function bich ynajem luser yet7akem fi l songs li 3malelhom upload
    // bich mapa les songs li 3malelhom upload fi lfirebase fi l page manage
    snapshot.forEach(this.addSong);
  },

  methods: {
    // hedhi bich ki nbadel esm l8oneya tetsajel
    // modified_name  jeya mil upload component
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },

    // this function is to push songs in the songs array
    //updating the list of of  songs after an upload
    addSong(document) {
      const song = {
        ...document.data(),
        docId: document.id,
      };

      this.songs.push(song);
    },

    // use this function bich nis2lo l user idha howa met2aked y7eb yo5rej mil page
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },

  // use this navigation garde bich nis2lo l user idha howa met2aked y7eb yo5rej mil page
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
  // this function is because we want to cancelling Uploads with Refs
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.concelUploads();
  //   next();
  // },

  // to protect the path bich matnajem tod5el ken ki ta3mel login ma3neha bil authentication status
  // we used the beforeRouteEnter guard to check if the user was authenticated

  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore();
  //   //we are going to check if the user is logged in the navigation guard
  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "home" });
  //   }
  // },
};
</script>
