export default {
  acceptors: [
    model => (proposal) => {
      if (proposal.todo) {
        model.creatingTodo = true;
        model.newTodo = {
          title: proposal.todo,
          completed: false
        }
      } else if (proposal.todoCreated) {
        const { id, title, completed } = proposal;
        model.items[id] = {
          id,
          title,
          completed
        }
        model.creatingTodo = false;
        model.newTodo = null;
      }

      return model;
    }
  ]
}
