export default {
  acceptors: [
    model => proposal => {
      const {
        clearCompleted,
        showActive,
        showCompleted,
        showAll,
        deletingTodosDone
      } = proposal;

      let items = model.getItems();

      if (clearCompleted) {
        let deletedTodos = [];
        Object.keys(items).forEach(key => {
          if (items[key].completed) {
            deletedTodos.push(items[key]);
          }
        });

        model.deletingTodos = true;
        model.deletedTodos = deletedTodos;
      }

      if (showActive) {
        model.displayActive = true;
        model.displayCompleted = false;
        model.displayAll = false;
      }

      if (showCompleted) {
        model.displayActive = false;
        model.displayCompleted = true;
        model.displayAll = false;
      }

      if (showAll) {
        model.displayAll = true;
        model.displayActive = false;
        model.displayCompleted = false;
      }

      if (deletingTodosDone) {
        Object.keys(items).forEach(key => {
          if (items[key].completed) {
            delete items[key];
          }
        });

        model.deletingTodos = false;
        model.deletedItems = null;
      }

      return model;
    }
  ]
}
