import NProgress from "nprogress";
// if the user visits a new page, we'll want to load in the progress bar
export default (router) => {
  router.beforeEach((to, from, next) => {
    // the beforeEach guard is called befor the route begins to load the  componnet
    NProgress.start(); // the start func is what will initialize the progress bar
    next();
  });

  router.afterEach(NProgress.done); // the after each guard is called whatever func we pass into it //the done function will force the progress bar to fill up the page
};
