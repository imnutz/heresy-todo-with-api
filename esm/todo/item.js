export default {

  extends: 'li',

  mappedAttributes: ['value'],
  onvalue() { this.render(); },

  onclick(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('delete', {bubbles: true, detail: {id: this.value.id}}));
  },

  render() {
    const {completed, title} = this.value;
    this.classList.toggle('completed', completed);
    this.html`
    <div class="view">
      <input
        class="toggle" type="checkbox"
        checked=${completed}
      >
      <label>${title}</label>
      <button class="destroy" onclick=${this}></button>
    </div>`;
  }
};
