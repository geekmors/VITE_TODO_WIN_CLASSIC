import { store_get } from './store'
import {NewTodo, removeItem, toggleTodoItemState, APP_KEY, completed, total, progress} from './TodoController'

// custom event to be used for re-rendering the todo list
let renderTodoEvent = new CustomEvent('render_todo', {
    bubbles: true,
    cancelable: true,
    composed: false
})
function TopBar(id, state){
    let div = document.createElement('div')
    div.classList.add('top-bar', state?'completed' : 'incomplete')
    div.innerHTML = `
        <button class="top-bar-button window-style is_done ${state ? 'completed' : ''}">
            ${
                state
                ? '<i class="bi bi-check-square-fill"></i>'
                : '<i class="bi bi-square"></i>'
            }
        </button>
        <button class="top-bar-button window-style remove">
            <i class="bi bi-x-lg"></i>
        </button>
    `
    div.getElementsByClassName('remove')[0].addEventListener('click', function(e){
        removeItem(id)
        document.body.dispatchEvent(renderTodoEvent)
    })
    div.getElementsByClassName('is_done')[0].addEventListener('click', function(e){
        toggleTodoItemState(id)
        document.body.dispatchEvent(renderTodoEvent)
    })
    return div
}
function Todo(todo, state){
    let div = document.createElement('div')
    div.innerHTML = `
        <p class="todo-content ${state?'completed':''}">${todo ?? 'N/A'}</p>
    `
    return div
}
/**
 * 
 * @param {TodoItem} todoItem 
 */
function TodoItemComponent(todoItem){
    let div = document.createElement('div')
    div.classList.add('todo-item', 'window-style', todoItem.state ? 'completed' : 'incomplete')
    div.appendChild(TopBar(todoItem.id, todoItem.state))
    div.appendChild(Todo(todoItem.todo, todoItem.state))
    return div
}

function StatItem(item){
    let todos = store_get(APP_KEY)
   console.log(todos, item.compute(todos)) 
	
	let computed_value = item.compute(todos)
    let div = document.createElement('div')
    div.classList.add('bar-item','window-style')
    div.setAttribute('title', item.description(computed_value) ?? '')
    div.innerHTML = `${item.title} [${computed_value}]`
    return div
}

function BottomBarComponent(){
    
    let stats = [
        {
            title:'Total',
            compute: total,
            description: (computed_value)=>`${computed_value} todo items in todo list`
        },
        {
            title:'Completed',
            compute: completed,
            description: (computed_value) => `You have completed ${computed_value} todo items`
        },
        {
            title:'Progress',
            compute: todos => progress(todos) + '%',
            description: (computed_value) => `${computed_value} of todo items have been competed`
        }
    ]

    let bottomBar = document.getElementsByClassName('bottom-bar')[0]
    bottomBar.innerHTML = ''

    for(let item of stats){
        bottomBar?.appendChild(StatItem(item))
    }
    
}

export function Render(){
    let listContainer = document.getElementById('TodoList')
    listContainer.innerHTML = ''
    let todoListItems = store_get(APP_KEY)
    
    for(let todoItem of todoListItems){
        listContainer.appendChild(TodoItemComponent(todoItem))
    }
    
    BottomBarComponent()
}

document.body.addEventListener('render_todo', function(e){
    Render()
})

let newTodoForm = document.getElementById('CreateTodoForm')

newTodoForm.addEventListener('submit', function(e){
    e.preventDefault()
    let todoInput = document.getElementById('todo_input')
    
    if(!todoInput.value){
        newTodoForm.classList.add('error')
        return
    }

    NewTodo(todoInput.value)
    todoInput.value = ''
    document.body.dispatchEvent(renderTodoEvent)
})
