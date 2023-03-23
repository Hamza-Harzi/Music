<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.listen") }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t("home.app_description") }}
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">{{ $t("home.hey") }}</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <!-- to loop my songs from the database i use v-for/ :key/ props/ components -->
          <app-song-item v-for="song in songs" :key="song.docId" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
//to speaking with firbase we need to import songscollection from firebase
import { songsCollection } from "@/includes/firebase";
import AppSongItem from "@/components/SongItem.vue";
import IconSecondary from "@/directives/icon-secondary";
export default {
  name: "Home",

  data() {
    return {
      //store respense data in songs
      songs: [],
      maxPerPage: 25,
      pendingRequest: false,
    };
  },
  components: {
    AppSongItem,
  },
  directives: {
    "icon-secondary": IconSecondary,
  },
  //request the data when the compent is created by using life cycle function
  async created() {
    // infinite scrolling "bich kol manzide 8oneya fi l base de donner nal9aha fi lhome"
    this.getSongs();
    // the scroll event is emitted whenever the user is scroll
    window.addEventListener("scroll", this.handleScroll);
  },
  // we use yhis function to remove EventListener
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow =
        Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      // i must use get func to take data from firebase
      if (this.pendingRequest) {
        // if this property is set to true we will stop further request
        return;
      }

      this.pendingRequest = true;
      let snapshots;
      if (this.songs.length) {
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docId)
          .get();

        snapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.maxPerPage) // limiting how much data we are requesting
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxPerPage) // limiting how much data we are requesting
          .get();
      }

      // loop document to push them in the array
      snapshots.forEach((document) => {
        this.songs.push({
          docId: document.id,
          ...document.data(),
        });
      });
      this.pendingRequest = false;
    },
  },
};
</script>
