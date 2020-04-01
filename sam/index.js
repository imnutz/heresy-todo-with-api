import { SAM, api } from "sam-pattern";

import initialState from "./initial_state";

import header from "./header_component";
import init from "./init_component";
import main from "./main_component";
import footer from "./footer_component";

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
