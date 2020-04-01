import {ref} from 'heresy';

import Header from './header.js';
import Main from './main.js';
import Footer from './footer.js';

export default {

  // declaration + local components + CSS
  extends: 'section',
  includes: {Header, Main, Footer},

  mappedAttributes: ["data"],
  ondata() { this.render(); },

  style: (self /*, Header, Main, Footer*/) => `
    ${self} ul.completed > li:not(.completed),
    ${self} ul.active > li.completed {
      display: none;
    }
  `,

  // lifecycle events
  oninit() {
    this.header = ref();
    this.main = ref();
    this.footer = ref();
  },

  // render view
  render() {
    const tot = getCount(this.data.items);

    this.html`
      <Header class="header" ref=${this.header} onchange=${this} />
      <Main class="main" ref=${this.main} onchange=${this} ondelete=${this} .data=${this.data}/>
      <Footer class="footer" ref=${this.footer} count=${tot} onclick=${this}/>
    `;
  },

  // events handling
  onchange(event) {
    const {currentTarget, target} = event;
    switch (currentTarget) {
      case this.header.current:
        const value = target.value.trim();
        this.intents.createTodo(value);
        target.value = '';
        break;
      case this.main.current:
        if (target.className === 'toggle-all') {
          this.intents.markAllDone(target.checked)
        } else {
          const {value} = target.closest('li');
          this.intents.markDone(value.id, target.checked);
        }
        break;
    }
  },

  ondelete(evt) {
    const { id } = evt.detail;

    this.intents.deleteTodo(id);
  },

  onclick(event) {
    const {currentTarget, target} = event;
    switch (currentTarget) {
      case this.footer.current:
        if (target.className === 'clear-completed')
          this.intents.clearCompleted()
        else if (target.hash && !target.classList.contains('selected')) {
          currentTarget.querySelector('a.selected').classList.remove('selected');
          target.classList.add('selected');

          if (target.classList.contains('active')) {
            this.intents.showActive();
          } else if (target.classList.contains('completed')) {
            this.intents.showCompleted();
          } else if (target.classList.contains('all')) {
            this.intents.showAll();
          }
        }
        break;
    }
  }
};

function getCount(items) {
  return Object.keys(items).filter(key => !items[key].completed).length;
}
