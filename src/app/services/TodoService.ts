/// <reference path="../../../typings/tsd.d.ts" />
import {bind, Inject} from 'angular2/di';

// Using TypeScript we can define our state interface
interface ITodo {
  value: string;
  created_at: Date;
  completed?: boolean;
}
interface ITodoState {
  todos: Array<ITodo>
}

// We can also make a TodoStore to manage cache/localStorage
let initialTodoState:ITodoState = {
  todos: [
    { value: 'finish example', created_at: new Date() },
    { value: 'add tests',      created_at: new Date() },
    { value: 'include development environment', created_at: new Date() },
    { value: 'include production environment',  created_at: new Date() }
  ]
};

// Our Todo Service that uses Store helper class for managing our state
export class TodoService {
  // we shouldn't access ._state or ._setState outside of the class
  _state: ITodoState;
  constructor(@Inject('initialTodoState') state: ITodoState) {
    // use Store class as a helper
    this._state = state;
  }

  get(type?: string) {
    return (type) ? this._state[type] : this._state;
  }

  set(prop: any, value?: any) {
    // .set({ todos: [] }) one argument to replace all of the state
    // .set('todos', [])   two arguments only to replace a property in our state
    this._state = (value === undefined) ? prop : Object.assign({}, {
      [prop]: value
    });
  }

  add(todo) {
    // Async call to server then save state

    var todos = this.get('todos').slice(); // create array copy
    todos.push({
      value: todo,
      created_at: new Date()
    });

    // You can use .set to replace state
    this.set('todos', todos);
  }

  remove(index) {
    // Async call to server then save state

    var todos = this.get('todos').slice(); // create array copy
    todos.splice(index, 1);

    // Always Replace state
    this.set({
      todos: todos
    });

  }

}//TodoService

// export our injectables for this module
export var todoInjectables: Array<any> = [
  bind('initialTodoState').toValue(initialTodoState),
  bind(TodoService).toClass(TodoService)
];
