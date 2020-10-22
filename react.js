function List(props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => props.toggle && props.toggle(item.id)}
            style={{ textDecoration: item.complete ? 'line-through' : 'none' }}
          >
            {item.name}
          </span>
          <button onClick={() => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  );
}



// class ConnectedTodos extends React.Component {
//   render() {
//    return ( 
//     <Context.Consumer>
//         {(store) => {
//           const {todos} = store.getState();
//           return <Todos todos={todos} dispatch={store.dispatch}/>
//         }}
//       </Context.Consumer>
//     )
//   }
// }

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    this.props.dispatch(handleAddTodo(
      this.input.value,
      () => this.input.value = ''
    ));
  };
  removeItem = (todo) => {
    this.props.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (id) => {
    this.props.dispatch(handleToggle(id));
  };

  render() {
    return (
      <div>
        <h1>Todo List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Todo</button>
        <List
          remove={this.removeItem}
          items={this.props.todos}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}

const ConnectedTodos = connect((state) => ({
  todos: state.todos
}))(Todos);





// class ConnectedGoals extends React.Component {
//   render() {
//     return (
//       <Context.Consumer>
//         {
//           (store) => {
//             const {goals} = store.getState();
//             return (
//                 <Goals goals={goals} dispatch={store.dispatch}/>
//               )
//           }
//         }
//       </Context.Consumer>
        
//     )
//   }
// }


class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    this.props.dispatch(handleAddGoal(
      this.input.value,
      () => this.input.value = ''  
    ));
  };
  removeItem = (goal) => {
   this.props.dispatch(handleDeleteGoal(goal));
  };

  render() {
    return (
      <div>
        <h1>Goals</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List remove={this.removeItem} items={this.props.goals} />
      </div>
    );
  }
}
const ConnectedGoals = connect((state) => ({
  goals: state.goals
}))(Goals);



class App extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;    
    dispatch(handleInitialData());
  }

  render() {
    const { loading } = this.props;
    if (loading) return <h3>Loading...</h3>
    return (
      <div>
        <ConnectedTodos/>
        <ConnectedGoals/>
      </div>
    );
  }
}

// class ConnectedApp extends React.Component {
//   render() {
//     return (
//       <Context.Consumer>
//         {(store) => (
//           <App store={store}/>
//         )}
//       </Context.Consumer>
//     )
//   }
// }


function connect(mapStateToProps) {
  return (Component) => {
    
    class Receiver extends React.Component {
      componentDidMount() {
        const {subscribe} = this.props.store;
        this.unsubscribe = subscribe(() => this.forceUpdate());
      }

      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const {dispatch, getState} = this.props.store;
        const state = getState();
        const stateNeeded = mapStateToProps(state);
        
        return <Component {...stateNeeded} dispatch={dispatch}/>
      }
    }

    class ConnectedComponent extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {(store) => <Receiver store={store}/>}
          </Context.Consumer>
        )
      }
    }

    return ConnectedComponent;
  }
}


const Context = React.createContext();

const ConnectedApp = connect((state) => ({
  loading: state.loading
}))(App);

class Provider extends React.Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>, 
  document.getElementById('app')
);

