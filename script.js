// API Base URL
const API_URL = "http://localhost:3000/todos";

// DOM Elements
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const saveBtn = document.getElementById("saveBtn");
const todoList = document.getElementById("todoList");
const doneCount = document.getElementById("doneCount");
const progressCount = document.getElementById("progressCount");
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const dateEditInput = document.getElementById("dateEditInput");
const categoryEditInput = document.getElementById("categoryEditInput");
const cancelEditBtn = document.getElementById("cancelEdit");
const confirmEditBtn = document.getElementById("confirmEdit");

let currentEditId = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchTodos();
});

// Fetch all todos from API
async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    const todos = await response.json();
    renderTodos(todos);
    updateStats(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Render todos to DOM
function renderTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.dataset.id = todo.id;
    console.log(todo.title);
    li.innerHTML = `
            <span class="todo-text">${escapeHtml(todo.title)}</span>
            <span class="todo-text">${escapeHtml(todo.dueDate)}</span>
            <span class="todo-text">${escapeHtml(todo.category)}</span>
            <div class="todo-actions">
                <button class="action-btn btn-delete" title="Delete" data-action="delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
                <button class="action-btn btn-edit" title="Edit" data-action="edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></button>
                <button class="action-btn btn-complete" title="${
                  todo.completed ? "Mark Incomplete" : "Mark Complete"
                }" data-action="complete">
                    ${
                      todo.completed
                        ? "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-check2-square' viewBox='0 0 16 16'><path d='M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5z'/><path d='m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0'/></svg>"
                        : "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-app' viewBox='0 0 16 16'><path d='M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z'/></svg>"
                    }
                </button>
            </div>
        `;
    todoList.appendChild(li);
  });
}

// Update stats counters
function updateStats(todos) {
  const done = todos.filter((t) => t.completed).length;
  const inProgress = todos.filter((t) => !t.completed).length;
  doneCount.textContent = done;
  progressCount.textContent = inProgress;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Add new todo
async function addTodo(title, dueDate, category) {
  if (!title.trim()) return;
  //   if (!title.trim()) return;
  if (!category.trim()) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        completed: false,
        dueDate: dueDate,
        category: category,
      }),
    });

    if (response.ok) {
      todoInput.value = "";
      fetchTodos();
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// Delete todo
async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchTodos();
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// Toggle complete status
async function toggleComplete(id) {
  try {
    // First get the current todo
    const getResponse = await fetch(`${API_URL}/${id}`);
    const todo = await getResponse.json();

    // Toggle the completed status
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });

    if (response.ok) {
      fetchTodos();
    }
  } catch (error) {
    console.error("Error toggling todo:", error);
  }
}

// Open edit modal
async function openEditModal(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const todo = await response.json();

    currentEditId = id;
    editInput.value = todo.title;
    dateEditInput.value = todo.dueDate;
    categoryEditInput.value = todo.category;
    editModal.classList.add("active");
    editInput.focus();
  } catch (error) {
    console.error("Error opening edit modal:", error);
  }
}

// Close edit modal
function closeEditModal() {
  editModal.classList.remove("active");
  currentEditId = null;
  editInput.value = "";
}

// Save edited todo
async function saveEdit() {
  if (!currentEditId || !editInput.value.trim()) return;

  try {
    const response = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editInput.value.trim(),
      }),
    });

    if (response.ok) {
      closeEditModal();
      fetchTodos();
    }
  } catch (error) {
    console.error("Error saving edit:", error);
  }
}

// Event Listeners

// Save button click
saveBtn.addEventListener("click", () => {
  addTodo(todoInput.value, dateInput.value, categoryInput.value);
});

// Enter key to save
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo(todoInput.value);
  }
});

// Todo list action buttons (event delegation)
todoList.addEventListener("click", (e) => {
  const actionBtn = e.target.closest(".action-btn");
  if (!actionBtn) return;

  const todoItem = actionBtn.closest(".todo-item");
  const id = todoItem.dataset.id;
  const action = actionBtn.dataset.action;

  switch (action) {
    case "delete":
      deleteTodo(id);
      break;
    case "edit":
      openEditModal(id);
      break;
    case "complete":
      toggleComplete(id);
      break;
  }
});

// Modal buttons
cancelEditBtn.addEventListener("click", closeEditModal);
confirmEditBtn.addEventListener("click", saveEdit);

// Close modal on outside click
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && editModal.classList.contains("active")) {
    closeEditModal();
  }
});

// Enter key to save in edit modal
editInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveEdit();
  }
});

//Apply dark mode functionality
let darkmode = localStorage.getItem("darkmode");
const themeSwitch = document.getElementById("switchCheckDefault");
const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  themeSwitch.checked = true;
  localStorage.setItem('darkmode', 'active');
}
enableDarkmode();
const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  themeSwitch.checked = false;
  localStorage.removeItem('darkmode');
}
if(darkmode === 'active'){
  enableDarkmode();
}
themeSwitch.addEventListener("change", () => {
  darkmode = localStorage.getItem('darkmode');
  if (themeSwitch.checked) {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});

