import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";
import Song from "@/views/Song.vue";

import useUserStore from "@/stores/user";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "about",
    //alias: "/manage",// the path opning but wiyh /manage and /manage-music
    path: "/about", //exemple.com/about
    component: About,
  },
  {
    name: "manage",
    path: "/manage-music", //exemple.com/about
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log("manage route guard");
      next();
    },
    meta: { requiresAuth: true }, //from Route Meta Fields
  },
  {
    path: "/manage",
    redirect: { name: "manage" }, // ici je veux dire aller ay path /manage-music quand quelqu'un ecrit /manage comme path
  },
  {
    // creating a dynamic route by using :id
    name: "song",
    path: "/song/:id",
    component: Song,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" }, // when path doesn't exist go to the home path
  },
];

const router = createRouter({
  //use this option to  enable history mode in the browser
  //createWebHistory : the vue router library for generate the object
  history: createWebHistory(import.meta.env.BASE_URL),
  //seconde proprty : this property will be an array of paths a  user can access in our app
  routes,
  // stayl mta3 link illi activer(route)
  linkExactActiveClass: "text-yellow-500",
});

// to brotect the path bich matnajem tod5el ken ki ta3mel login ma3neha bil authentication status
// kol ma na3mel logout w ena fi lmanage tarja3 lil home
router.beforeEach((to, from, next) => {
  // console.log(to.meta);

  // meta.requiresAuth mawjoud fi l path manage lfou9
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  //we are going to check if the user is logged in the navigation guard
  const store = useUserStore();
  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
