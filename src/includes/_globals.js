import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export default {
  install(app) {
    // glob() are a feature for searching for files with patterns
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true,
    }); // the import meta object is available in all javascript files

    // this function will convert each property to an array where the first item is in the array contains the key
    // the first item will have the file path and the module item will store the componnets
    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );
      //console.log(path, componentName);

      app.component(`Base${componentName}`, module.default);
    });
  },
};
