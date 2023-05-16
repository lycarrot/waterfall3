import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import waterFall3 from "../core";
import mockList from "../mock/lists.json";

describe("waterFall.vue", () => {
  it("create waterFall3", () => {
    const wrapper = mount({
      components: {
        waterFall3,
      },
      template: `<water-fall3 ref="waterfall" :lists="lists"></water-fall3>`,
      created() {
        this.lists = mockList;
      },
    });
    expect(wrapper.classes()).toContain("waterfall-scroll");
  });
});
