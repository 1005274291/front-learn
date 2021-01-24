module.exports = {
  createUserRequest: {
    mobile: {
      type: "string",
      required: true,
      description: "⼿机号",
      example: "18801731528",
      format: /^1[34578]\d{9}$/,
    },
    password: {
      type: "string",
      required: true,
      description: "密码",
      example: "111111",
    },
    realName: {
      type: "string",
      required: true,
      description: "姓名",
      example: "Tom",
    },
  },
};
//对于controller文件夹下user.js下的createUserRequest来匹配
