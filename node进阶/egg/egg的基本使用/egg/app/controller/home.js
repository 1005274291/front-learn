'use strict';

const Controller = require('egg').Controller;
//实现了约定优于定义的思想，每一个Controller都继承egg的controller，并挂载到app上
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg!!!!!!!!!';
  }
}

module.exports = HomeController;
