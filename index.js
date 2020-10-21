function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}
/**
 * Characteristics of a Pure function
 * 1) Always return the same result if the same arguments are passed in
 * 2) They depend only on the arguments passed into them
 * 3) Never produce any side effects
 */
// function createStore(reducer) {
//   // The Store should have four parts
//   // 1. The State
//   // 2. Get the state (getState)
//   // 3. Listen to changes on the state (subscribe)
//   // 4. Update the state (dispatch)

//   let state;
//   let listeners = [];

//   const getState = () => state;

//   const subscribe = (listener) => {
//     listeners.push(listener);
//     return () => {
//       listeners = listeners.filter((l) => l !== listener);
//     };
//   };

//   const dispatch = (action) => {
//     // call todos
//     state = reducer(state, action);
//     // loop over listeners and inform them the state has been updated
//     listeners.forEach((listener) => listener());
//   };

//   return {
//     getState,
//     subscribe,
//     dispatch,
//   };
// }

// App code
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const RECEIVE_DATA = 'RECEIVE_DATA';


function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}
function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA, 
    todos,
    goals
  }
}

function handleDeleteTodo(todo) {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo))
      alert('Error occurred ! Try again !')
    });
  }
}


function handleDeleteGoal(id) {
  
}

function handleAddGoal(goal) {
  
}

function checkAndDispatch(store, action) {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea ");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea ");
  }

  return store.dispatch(action);
}

const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea ");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea ");
  }

  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log('The new state: ', store.getState());
  console.groupEnd();

  return result;
};

const thunk = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch);
  }
  return next(action);
}


// Reducer function
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      // Cant' use state.push() because it would mutate the state
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      // carefult not to mute the state
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    case RECEIVE_DATA:  
      return action.todos;

    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);  
    case RECEIVE_DATA:  
      return action.goals;

    default:
      return state;
  }
}

function loading(state = true, action) {
  switch(action.type) {
    case RECEIVE_DATA:
      return false;
    default: 
      return state;
  }
}
/**
 * Our goal for the store is to look lik this
 * {
 *  todos: [],
 *  goals: []
 * }
 *
 */
// function app(state = {}, action) {
//   return {
//     todos: todos(state.todos, action),
//     goals: goals(state.goals, action),
//   };
// }



const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(thunk, checker, logger)
);

