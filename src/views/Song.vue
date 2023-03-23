<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="
            () => {
              newSong(song);
              isPlaying = !isPlaying;
            }
          "
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <!-- <i class="fas fa-play"></i> -->
          <i v-if="isPlaying" class="fas fa-pause"></i>
          <i v-else class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, "currency", "ja") }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc("song.comment_count", song.comment_count, {
              count: song.comment_count,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 rounded mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_msg }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docId"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";

import { mapState, mapActions } from "pinia";
// the map state fun will help us  whith mapping the state  to the computed proprties
import usePlayerStore from "@/stores/player";

import useUserStore from "@/stores/user";
export default {
  name: "Song",

  data() {
    return {
      song: {},
      isPlaying: false,
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_msg: "Please wait! Your comment is bing submussion.",
      comments: [], // 3malna erray li bich n7oto fih lcommontaret mte3 l users
      sort: "1",
    };
  },

  computed: {
    // ma tet7alo l commentaire ella maykoun 3amel login makenech tetna7a
    ...mapState(useUserStore, ["userLoggedIn"]),
    sortedComments() {
      //The sort() method sorts the elements of an array in place and returns the reference to the same array, now sorted
      //so we need slice becose The slice() method returns a shallow copy of a portion of an array into a new array object
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          // bich ne5dmo mta3 latest w oldest
          // nater7o date jdida mil 9dima bich na3rfo anehi li ajad date
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        // nater7o date le9dima mil jdida bich na3rfo anehi  li a9dem date
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  //will make the requests when component is created we can do that by defining the created life cycle function in the component
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    // idha l padh ma5demech wela majech id wela mich mawjoud hezni lil page home
    if (!docSnapshot.exists) {
      this.$route.push({ name: "home" });
      return;
    }

    // query parameter mta3 l comment loula mich kima mta3 thenya ya hot loula ya thenya
    const { sort } = this.$route.query;
    this.sort = sort === "1" || sort === "2" ? sort : "1";

    // bich n5azno data li jetna fi song object 3la tri9 data()
    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    // the context object containts methods and properties about our form
    //create a store named palyer and create the satate and action the colled the mapaction and the player store in the songs function
    ...mapActions(usePlayerStore, ["newSong"]),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_msg =
        "Please wait! Your comment is bing submussion 2.";
      console.log(auth, "hhhhhhhhhhh");
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName, //the cuurenUser object hold information obout the user currently logged in
        uid: auth.currentUser.uid, // stored the id to help identify who submitted the comment
      };

      await commentsCollection.add(comment);

      // bich kol ma na3mlo commontaire tzid 1 ma3neha 9adech 3malna mi commontaire
      this.song.comment_count += 1;
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });

      // this to reload the comment if a new comment was submitted
      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_msg = "Comment added!";
      // the resertForm function will reset the vlues in the form to their original values
      resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection
        .where("sid", "==", this.$route.params.id)
        .get();

      this.comments = [];

      // bich nmapiw les commontaire mte3na fi tableau
      snapshots.forEach((doc) => [
        // bich na3mlo push lil comentaret mte3na fi object bich nposhiw l id data
        this.comments.push({
          docId: doc.id,
          ...doc.data(),
        }),
      ]);
    },
  },
  watch: {
    //the watcher form  updating the route if the query parameter is already matches(tatataba9o) the sort value
    sort(newVal) {
      // the new value for the property we are watching we need to apdate the route
      // checing if the new value matches the query parameter
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
