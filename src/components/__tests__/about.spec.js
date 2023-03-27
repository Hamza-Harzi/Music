import About from "@/views/About.vue";
import { shallowMount } from "@vue/test-utils";
import { expect } from "vitest";
//we use describe function because it allows us to group one or more tests together
describe("About.vue", () => {
  test("renders inner text", () => {
    const wrapper = shallowMount(About); // the wrapper object represent the component // the shallowMount does the same thing as the mount fonction

    expect(wrapper.text()).toContain("about");
  });
});
