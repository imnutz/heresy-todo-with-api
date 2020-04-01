export default {
  acceptors: [
    model => (proposal) => {
      let items = model.getItems();

      const {
        id,
        checked,
        markOne,
        markAll,
        deleteTodo,
        markingOneDone,
        markingAllDone,
        deletingTodoDone
      } = proposal;
      if (markOne && id && items[id]) {
        items[id].completed = checked;

        model.markingOne = true;
        model.markedTodo = items[id];
      }

      if (markingOneDone) {
        model.markingOne = false;
        model.markedTodo = null;
      }

      if (markAll) {
        Object.keys(items).forEach(key => {
          items[key].completed = checked;
        });

        model.markingAll = true;
      }

      if (markingAllDone) {
        model.markingAll = false;
      }

      if (id && deleteTodo) {
        Object.keys(items).forEach(key => {
          if (items[key].id === id) {
            model.deletingTodo = true;
            model.deletedTodo = items[key];
            delete items[key];
          }
        });
      }

      if (deletingTodoDone) {
        model.deletingTodo = false;
        model.deletedTodo = null;
      }

      return model;
    }
  ]
}
