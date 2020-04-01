const ENDPOINT = "http://localhost:3000";

export default {
  getTodos() {
    return fetch(`${ENDPOINT}/todos`).then(response => response.json()).catch(e => console.error(e));
  },

  createTodo(todo) {
    return fetch(`${ENDPOINT}/todos`, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json());
  },

  updateTodo(todo) {
    return fetch(`${ENDPOINT}/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json());
  },

  deleteTodo(todo) {
    return fetch(`${ENDPOINT}/todos/${todo.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(response => response.json());
  }
}
