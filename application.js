import { define, render, html } from "heresy";

import Todo from "./esm/todo/index";
import samWrapper from "./sam";

define('Todo', Todo);

const renderer = (state) => {
  const appEl = document.querySelector("#todo-app");
  render(appEl, html`<Todo .data=${state} .intents=${samWrapper.intents} />`)
}


samWrapper.setRenderer(renderer);
samWrapper.start();
