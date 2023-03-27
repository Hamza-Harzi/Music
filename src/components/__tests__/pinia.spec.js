import { setActivePinia, createPinia } from "pinia";
import useUserStore from "@/stores/user";

//mock a promise by firebase
vi.mock("@/includes/firebase", () => ({
  // the vi.mock function allows us to mock a dependency
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));

describe("stores", () => {
  //the before each function will run a function before a test is executed
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticates user", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true); // this assertion will test if the property is false
    await store.authenticate({}); //run the func
    expect(store.userLoggedIn).toBe(true);
  });
});
