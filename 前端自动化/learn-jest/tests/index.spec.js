const add = require("../add");
const bar = require("../bar");
const foo = require("../foo");
const User = require("../User");

//为了让jest直到其他函数有没有被调用，所以我们模拟一个函数调用的假象，当函数被调用时会告诉jest一些信息让他知道这个函数被调用了
jest.mock("../bar.js", () => {
  //模拟模块
  return jest.fn();
});

//验证函数返回值是否在预期之内
it("add", () => {
  const a = 1;
  const b = 1;
  const result = add(a, b);
  expect(result).toBe(2);
});

//验证其他函数是否被调用
it("foo", () => {
  foo();
  expect(bar).toBeCalled(); //bar函数被调用了
});

//验证函数是否修改状态成功
it("user", () => {
  const user = new User();
  user.setName("xiaohong");
  expect(user.getName()).toBe("xiaohong");
});

const can1 = {
  flavor: "grapefruit",
  ounces: 12,
};
const can2 = {
  flavor: "grapefruit",
  ounces: 12,
};

describe("the La Croix cans on my desk", () => {
  test("have all the same properties", () => {
    expect(can1).toEqual(can2);//toEqual是有相同属性和值  深比较
  });
  test("are not the exact same can", () => {
    expect(can1).not.toBe(can2);//严格相等===
  });
});
