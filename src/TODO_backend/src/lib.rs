use ic_cdk::{export_candid, query, update, storage};
use std::cell::RefCell;
use candid::{CandidType, Deserialize};


#[derive(CandidType, Deserialize, Clone)]
struct Todo {
    todo_id: u64,
    title: String,
    description: String,
    status: bool,
}

thread_local! {
    static TODOS: RefCell<Vec<Todo>> = RefCell::new(Vec::new());
}

#[update]
fn set_task(title: String, description: String) -> u64 {
    let todo_id = TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        let todo_id = todos.len() as u64;
        todos.push(Todo {
            todo_id,
            title,
            description,
            status: false,
           

        });
        storage::stable_save((todos.clone(),)).expect("Could not save todos");
        todo_id
    });
    todo_id
}

#[query]
fn get_task() -> Vec<Todo> {
    TODOS.with(|todos| {
        storage::stable_restore::<(Vec<Todo>,)>().unwrap_or_else(|_| (Vec::new(),)).0
    })
}

#[update]
fn completed_task(todo_id: u64) {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        if let Some(todo) = todos.iter_mut().find(|todo| todo.todo_id == todo_id) {
            todo.status = true;
        }
        storage::stable_save((todos.clone(),)).expect("Could not save todos");
    });
}

#[update]
fn delete_task_by_id(todo_id: u64) -> String {
    let todos = storage::stable_restore::<(Vec<Todo>,)>().unwrap_or_else(|_| (Vec::new(),));
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        todos.retain(|todo| todo.todo_id != todo_id);
        storage::stable_save((todos.clone(),)).expect("Could not save todos");
    });
    "Todo removed".to_string()
}

#[update]
fn update_task(todo_id: u64, title: String, description: String) -> String {
    TODOS.with(|todos| {
        let mut todos = todos.borrow_mut();
        if let Some(todo) = todos.iter_mut().find(|todo| todo.todo_id == todo_id) {
            todo.title = title;
            todo.description = description;
            storage::stable_save((todos.clone(),)).expect("Could not save todos");
            return "Todo updated successfully".to_string();
        }
        "Todo not found".to_string()
    })
}

export_candid!();
