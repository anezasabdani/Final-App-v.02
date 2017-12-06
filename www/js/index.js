'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

console.clear();

/************************************
* IMPORTS
************************************/

var _React = React;
var Component = _React.Component;
var _uuid = uuid;
var v4 = _uuid.v4;
var _Redux = Redux;
var createStore = _Redux.createStore;
var combineReducers = _Redux.combineReducers;
var _ReactRedux = ReactRedux;
var connect = _ReactRedux.connect;
var Provider = _ReactRedux.Provider;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/************************************
* ACTION CREATORS
************************************/

// These are actions that will be passed to store.dispatch()
var addTodo = function addTodo(text) {
  return {
    type: 'ADD_TODO',
    id: v4(),
    text: text
  };
};

var toggleTodo = function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
    id: id
  };
};

var removeTodo = function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id: id
  };
};

var setVisibilityFilter = function setVisibilityFilter(filter) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
};

/************************************
* REDUCERS 
************************************/

/* todos ***************************/
var todos = function todos() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_TODO':
      // Return the current array and use todo reducer to add a new todo object to the end. 'undefined' is passed because a new todo doesn't require state, and 'ADD_TODO' is passed as the action.
      return [].concat(state, [
      //
      todo(undefined, action)]);
    case 'TOGGLE_TODO':
      // Take each item in todos and pass it through the todo reducer with 'TOGGLE_TODO' as the action.
      return state.map(function (t) {
        return todo(t, action);
      });
    case 'REMOVE_TODO':
      var index = undefined;
      state.map(function (t, i) {
        if (t.id === action.id) {
          index = i;
        }
      });
      return [].concat(state.slice(0, index), state.slice(index + 1));
    default:
      return state;
  }
};

var todo = function todo(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // Return a new todo with these values. It then gets added to the array used in 'ADD_TODO' in the todos reducer.
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      // Return the original state if the IDs DON'T match.
      if (state.id !== action.id) {
        return state;
      }
      return _extends({}, state, {
        completed: !state.completed
      });
    default:
      return state;
  }
};
/* visibilityFilter ****************/
var visibilityFilter = function visibilityFilter() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? 'SHOW_ALL' : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

var todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});

/************************************
* PRESENTATIONAL COMPONENTS
************************************/

/* <Todo /> ************************/
var Todo = function Todo(_ref) {
  var onClick = _ref.onClick;
  var completed = _ref.completed;
  var text = _ref.text;
  var id = _ref.id;
  return React.createElement(
    'li',
    {
      onClick: onClick,
      className: "todo" + (completed ? " todo-completed" : "")
    },
    React.createElement('i', { className: "fa " + (completed ? 'fa-dot-circle-o' : 'fa-circle-o') }),
    text,
    React.createElement(RemoveButton, { value: id })
  );
};

/* <TodoList /> ********************/
var TodoList = function TodoList(_ref2) {
  var todos = _ref2.todos;
  var onTodoClick = _ref2.onTodoClick;

  return React.createElement(
    ReactCSSTransitionGroup,
    {
      id: 'TodoList',
      component: 'ul',
      transitionName: 'todo',
      transitionEnterTimeout: 500,
      transitionLeaveTimeout: 500
    },
    todos.map(function (todo) {
      return React.createElement(Todo, _extends({
        id: todo.id,
        key: todo.id
      }, todo, {
        onClick: function onClick() {
          return onTodoClick(todo.id);
        }
      }));
    })
  );
};

/* <Link /> ************************/
var Link = function Link(_ref3) {
  var active = _ref3.active;
  var children = _ref3.children;
  var _onClick = _ref3.onClick;

  if (active) {
    return React.createElement(
      'span',
      null,
      children
    );
  }
  return React.createElement(
    'a',
    { href: '#',
      onClick: function onClick(e) {
        e.preventDefault();
        _onClick();
      } },
    children
  );
};

/* <Header /> **********************/
var Header = function Header() {
  return React.createElement(
    'p',
    { id: 'Header' },
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ALL' },
      React.createElement('i', { className: 'fa fa-list' })
    ),
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ACTIVE' },
      React.createElement('i', { className: 'fa fa-circle-o' })
    ),
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_COMPLETED' },
      React.createElement('i', { className: 'fa fa-dot-circle-o' })
    )
  );
};

/* <TodoApp /> *********************/
var TodoApp = function TodoApp() {
  return React.createElement(
    'div',
    { id: 'TodoApp' },
    React.createElement(Header, null),
    React.createElement(VisibleTodoList, null),
    React.createElement(AddTodo, null)
  );
};

/************************************
* CONTAINER COMPONENTS
************************************/

/* <VisibleTodoList /> *************/

// Function to ascertain which Todos should be shown.
var getVisibleTodos = function getVisibleTodos(todos, filter) {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      // Return a filtered array of items whose completed value = true
      return todos.filter(function (t) {
        return t.completed;
      });
    case 'SHOW_ACTIVE':
      // Return a filtered array of items whose completed value = false
      return todos.filter(function (t) {
        return !t.completed;
      });
  }
};
// Gives <VisibleTodoList /> the state that it needs
var mapStateToTodoListProps = function mapStateToTodoListProps(state) {
  return {
    todos: getVisibleTodos(
    // Current todos and visibilityFilter
    state.todos, state.visibilityFilter)
  };
};
// Gives <VisibleTodoList /> the props that it needs
var mapDispatchToTodoListProps = function mapDispatchToTodoListProps(dispatch) {
  return {
    onTodoClick: function onTodoClick(id) {
      dispatch(toggleTodo(id));
    }
  };
};
// Creates <VisibleTodoList />
var VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

/* <FilterLink /> ******************/

// Gives <FilterLink /> the state that it needs
var mapStateToLinkProps = function mapStateToLinkProps(state, ownProps) {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
// Gives <FilterLink /> the props that it needs
var mapDispatchToLinkProps = function mapDispatchToLinkProps(dispatch, ownProps) {
  return {
    onClick: function onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};
var FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

/************************************
* OTHER COMPONENTS
************************************/

/* <AddTodo /> *********************/
var AddTodo = function AddTodo(_ref4) {
  var dispatch = _ref4.dispatch;

  var input = undefined;
  return React.createElement(
    'form',
    { id: 'AddTodo', className: 'add-todo', onSubmit: function onSubmit(e) {
        e.preventDefault();
        if (input.value.length > 0) {
          dispatch(addTodo(input.value));
          input.value = '';
        }
      } },
    React.createElement('input', { type: 'text', ref: function ref(node) {
        input = node;
      }, placeholder: 'Add a todo...' }),
    React.createElement(
      'button',
      { type: 'submit' },
      React.createElement('i', { className: 'fa fa-plus' })
    )
  );
};
// Connect() without any parameters creates a container that doesn't subscribe to the store, but will pass dispatch to the component that it wraps.
AddTodo = connect()(AddTodo);

var RemoveButton = function RemoveButton(_ref5) {
  var value = _ref5.value;
  var dispatch = _ref5.dispatch;

  return React.createElement('i', { className: 'fa fa-times',
    onClick: function onClick() {
      dispatch(removeTodo(value));
    } });
};
RemoveButton = connect()(RemoveButton);

/************************************
* REACT RENDER
************************************/

var configureStore = function configureStore() {
  var persistedState = loadState();
  var store = createStore(todoApp, persistedState);

  store.subscribe(_.throttle(function () {
    saveState({
      todos: store.getState().todos
    });
  }, 1000));

  return store;
};

var Root = function Root(_ref6) {
  var store = _ref6.store;
  return React.createElement(
    Provider,
    { store: store },
    React.createElement(TodoApp, null)
  );
};

var loadState = function loadState() {
  try {
    var serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

var saveState = function saveState(state) {
  try {
    var serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Ignore errors.
  }
};

var store = configureStore();

ReactDOM.render(React.createElement(Root, { store: store }), document.getElementById('root'));