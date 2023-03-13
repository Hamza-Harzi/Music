<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <!-- the expression will check if the showform proprty is false -->
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSongs"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <!-- the expression will check if the showform proprty is true -->
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";
export default {
  name: "CompositionItem",
  //props to passing data from the parent component "manage.vue" to this child component
  props: {
    song: {
      type: Object,
      required: true,
    },
    // jeya mil manage component
    updateSong: {
      type: Function,
      required: true,
    },
    // jeya mil manage component
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Updating song info.",
    };
  },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Please wait! Updating song info.";

      // the doc function allows to select a document by its side will pass in the ID
      // the doc function will return an object where we can access its data
      // the update function will allow us to update any of the properties inside it

      try {
        console.log(this.song, "fdfffdfdf");
        await songsCollection.doc(this.song.docId).update(values);
        console.log(this.song.docID, "tttttttttttttttt");
      } catch (error) {
        console.log(error, "hjjihihih");
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Something went wrong! Try again later";
        console.log(this.alert_message, "hvhvhvghvghvghcghcgh");
        return;
      }
      // jeya mil manage component
      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success!";
    },

    //this function is to deleting songs from storage/database
    async deleteSongs() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();
      await songsCollection.doc(this.song.docId).delete();

      this.removeSong(this.index);
    },
  },
};
</script>
