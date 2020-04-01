import { SAM, api } from "sam-pattern";

import initialState from "./initial_state";

import header from "./header";
import init from "./init";
import main from "./main";
import footer from "./footer";

import setupAction from "./actions";

const todoSam = api(SAM);

const samWrapper = {
  header,
  init,
  main,
  footer,
  samApi: todoSam,

  setup() {
    // setup Model
    this.samApi.addInitialState(initialState);

    this.intents = setupAction(this.samApi);

    this.samApi.addComponent(this.header);
    this.samApi.addComponent(this.main);
    this.samApi.addComponent(this.init);
    this.samApi.addComponent(this.footer);

    // this.intents = {
    //   ...actions,
    //   clearCompleted,
    //   showActive,
    //   showCompleted,
    //   showAll,
    // };
  },

  setRenderer(renderer) {
    this.samApi.setRender(renderer);
  },

  start() {
    this.intents.getAllTodos();
  }
}

samWrapper.setup();

export default samWrapper;
