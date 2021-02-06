import { shallowMount } from "@vue/test-utils";
import Button from "../src/Button.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    // when
    const wrapper = shallowMount(Button);
    wrapper.get("button").trigger("click");//找到组件当中的对应元素触发事件
    console.log(wrapper.emitted());
    expect(wrapper.emitted("change")[0]).toEqual([1]);//验证触发事件的传参是否正确
  });
});
