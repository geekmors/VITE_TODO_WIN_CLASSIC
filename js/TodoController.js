import * as uuid from 'uuid'
import { store_get, store_set } from './store'

// the TODO APP's local storage key
export const APP_KEY = '84cdca864e94b6ee2081ff3059624326'

export let total = todos => todos.length
export let completed = todos => todos.filter(item => item.state).length
export let progress = todos => { 
	let total_completed = completed(todos)
	let total_todos = total(todos)

	return total_todos > 0 ? ( completed(todos) / total(todos) * 100 ) : 0
}
// our TodoItem data structure
export class TodoItem{
    constructor({state = false, todo = '', timestamp = (new Date().toISOString())}){
        this.id = uuid.v4()
        this.state = state ?? false
        this.todo = todo ?? ''
        this.timestamp = timestamp
    }
}

// removes a todo item from the list in local storage
export function removeItem(id){
    let data = store_get(APP_KEY)
    data = data.filter(item => item.id != id)
    store_set(APP_KEY, data)
}

// toggles the state of a todo item
export function toggleTodoItemState(id){
    let data = store_get(APP_KEY)
    
    for(let item of data){

        if(item.id == id){
            item.state = !item.state
            break
        }
    }

    store_set(APP_KEY, data) // update the store

}
export function NewTodo(todo){
    let todoItem = new TodoItem({ todo })
    let data = store_get(APP_KEY)
    data.push(todoItem)
    store_set(APP_KEY, data)
}
