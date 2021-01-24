module.exports = {
  baseRequest: {
    id: {
      type: "string",
      description: "id 唯⼀键",
      required: true,
      example: "1",
    },
  },
  baseResponse: {
    code: { type: "integer", required: true, example: 0 },
    data: { type: "string", example: "请求成功" },
    errorMessage: { type: "string", example: "请求成功" },
  },
};
//jsdoc描述接口生成文档 限制请求格式和返回格式
//在这里限制了所有请求参数和返回值的通用限制条件供swagger使用
//Swagger 是⼀个规范和完整的框架，⽤于⽣成、描述、调⽤和可视化 RESTful ⻛格的 Web服务。