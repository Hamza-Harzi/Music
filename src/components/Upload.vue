<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">{{ $t("upload.upload") }}</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <!-- creating the uploader with add drag and drop support -->
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from "@/includes/firebase";
export default {
  name: "Upload",
  // i18n.locale = 'fr';
  //props to passing data from the parent component "manage.vue" to this child component
  props: ["addSong"],

  data() {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      this.is_dragover = false;
      // this syntax is converting an object to an array
      console.log($event);
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files] // if the event  was a drag and drop event
        : [...$event.target.files]; // if the event  was a drag and drop events in the select file input

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        if (!navigator.onLine) {
          // if they're online we will let them proceed with uploading a file if they are offline we will output an error to let them know they can't upload files in the conditionl
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            text_class: "text-red-400",
          });
          return;
        }

        // bich tnageme t5asen l7ajet li 3maltelhom upload fi l firebase
        const storageRef = storage.ref(); //music-b2ecc.appspot.com
        // ligne 81 bich ta3mel file esmo songs fi l storage fi lfirebase
        const songsRef = storageRef.child(`songs/${file.name}`); //music-b2ecc.appspot.com/songs/exemple.mp3
        const task = songsRef.put(file); // tis function will initialize the upload process
        //if a new upload is initiated we will want to push it into this array
        //we accomplished that by storing the value returned by the push function minus one
        const uploadIndex =
          this.uploads.push({
            task, // pushing this because we may need to reference the task outside of the loop
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;
        // subtract one from the length to get the index for that latest item in the array
        // we calculated the progress by using these snapshot object
        // the snapshot object represents the current status of the upload
        // this function will let us listen to events on the object
        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // this calculation to get the pecentagr of  how much has been uploaded so far
            this.uploads[uploadIndex].current_progress = progress;
          },
          (error) => {
            // this function called when the upload is a error(l function hedhi tetsama additional aero fun)
            this.uploads[uploadIndex].variant = "bg-red-400"; // ki ysir error fi lupload lcouleur yetbadel red
            this.uploads[uploadIndex].icon = "fas fa-times"; // ki ysir error fi lupload licon tetbadel
            this.uploads[uploadIndex].text_class = "text-red-400"; // ki ysir error fi lupload lcouleur mta3 text yetbadel yetbadel red
            console.log(error);
          },
          async () => {
            // this function called when the upload is a success(l function hedhi tetsama additional aero fun)

            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            // reference provide the properties and methods  for interacting with the document
            const songRef = await songsCollection.add(song); // use the collection object to add the song
            // snopshat are read only object  of the data in the document
            // lezem n3adi reference fi west snopshat w ba3ed n3ayetlo fi l anction bich te5dem
            const songSnopshat = await songRef.get();
            // pass the document reference to the manage
            this.addSong(songSnopshat);

            this.uploads[uploadIndex].variant = "bg-green-400";
            this.uploads[uploadIndex].icon = "fas fa-check";
            this.uploads[uploadIndex].text_class = "text-green-400";
          }
        );
      });
      console.log(files);
    },
    concelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel(); //this function bich tfasa5 l 3matlo upload to Firebase
      });
    },
    // run before the component is unmounted / will have access to the data method and computed
    beforeUnmount() {
      this.uploads.forEach((upload) => {
        upload.task.cancel(); //this function will cease(bich twa9ef) upload operations to Firebase
      });
    },
  },
};
</script>
