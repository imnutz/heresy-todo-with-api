import API from "./api";

const getAllTodosAction = () => {
  return API.getTodos().then(todos => {
    const transformedTodos = todos.reduce((hash, todo) => {
      hash[todo.id] = todo;

      return hash;
    }, {});

    return {
      apiItems: transformedTodos
    };
  });
}

const createTodoAction = (value) => {
  return {
    todo: value
  };
}

const saveTodoAction = todo => {
  return API.createTodo(todo).then(newTodo => {
    return {
      todoCreated: true,
      ...newTodo
    };
  });
}

const markTodoAction = todo => {
  return API.updateTodo(todo).then(updatedTodo => {
    return {
      markingOneDone: true,
      ...updatedTodo
    };
  });
}

const markAllTodosAction = (todos) => {
  const promises = Object.keys(todos).map(key => {
    return markTodoAction(todos[key]);
  });

  return Promise.all(promises).then(res => ({ markingAllDone: true }));
}

const apiDeleteTodoAction = (todo) => {
  return API.deleteTodo(todo).then(() => ({ deletingTodoDone: true }));
}

const apiDeleteTodosAction = (todos) => {
  const promises = todos.map(apiDeleteTodoAction);

  return Promise.all(promises).then(() => ({ deletingTodosDone: true }));
}

const markDoneAction = (id, checked) => ({ markOne: true, id, checked });
const markAllDoneAction = (checked) => ({ markAll: true, checked });
const deleteTodoAction = (id) => ({ deleteTodo: true, id });

const clearCompletedAction = () => ({ clearCompleted: true });
const showActiveAction = () => ({ showActive: true });
const showCompletedAction = () => ({ showCompleted: true });
const showAllAction = () => ({ showAll: true });

export default (sam) => {
  const nap = (model) => () => {
    if (model.creatingTodo) {
      saveTodo(model.newTodo);
      return true;
    } else if (model.markingOne) {
      markTodo(model.markedTodo);
      return true;
    } else if (model.markingAll) {
      markAllTodos(model.items);
      return true;
    } else if (model.deletingTodo) {
      apiDeleteTodo(model.deletedTodo);
      return true;
    } else if (model.deletingTodos) {
      apiDeleteTodos(model.deletedTodos);
      return true;
    }

    return false;
  }
  sam.addNAPs([nap]);

  const { intents } = sam.getIntents([
    getAllTodosAction,
    createTodoAction,
    saveTodoAction,
    markDoneAction,
    markAllDoneAction,
    deleteTodoAction,
    clearCompletedAction,
    showActiveAction,
    showCompletedAction,
    showAllAction,
    markTodoAction,
    markAllTodosAction,
    apiDeleteTodoAction,
    apiDeleteTodosAction
  ]);

  const [
    getAllTodos,
    createTodo,
    saveTodo,
    markDone,
    markAllDone,
    deleteTodo,
    clearCompleted,
    showActive,
    showCompleted,
    showAll,
    markTodo,
    markAllTodos,
    apiDeleteTodo,
    apiDeleteTodos
  ] = intents;

  return {
    getAllTodos,
    createTodo,
    markDone,
    markAllDone,
    deleteTodo,
    clearCompleted,
    showActive,
    showCompleted,
    showAll
  };
}
