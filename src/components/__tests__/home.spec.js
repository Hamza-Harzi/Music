import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";

describe("Home.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (message) => message, // 3arefna hedhi mta3 translate {{ $t("home.hey") }} ili fil home.vue
        },
      },
    });

    const items = component.findAllComponents(SongItem); //the find all components function will search for all song item component in the home component

    expect(items).toHaveLength(songs.length); // we will check if the items array is aqual to the length of the songs array

    items.forEach((wrapper, i) => {
      //  create a test that compare the value of the song prop to the item it corresponds to in the array
      expect(wrapper.props().song).toStrictEqual(songs[i]); // bich y3adi l props lmawjouda fi songItem.vue props: ["song"],
    });
  });
});
