const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = filterSelect.value === 'all'
        ? tasks
        : filterSelect.value === 'completed'
            ? tasks.filter(task => task.completed)
            : tasks.filter(task => !task.completed);

    const sortedTasks = sortSelect.value === 'newest'
        ? filteredTasks.sort((a, b) => b.id - a.id)
        : filteredTasks.sort((a, b) => a.id - b.id);

    sortedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', task.completed);
        taskItem.style.animation = 'fadeIn 0.5s ease-in-out';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            const newText = prompt('Enter new task text', task.text);
            if (newText !== null) {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            deleteButton.style.animation = 'shake 0.5s ease-in-out';
        });

        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(actionsContainer);

        taskList.appendChild(taskItem);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
        addTaskButton.style.animation = 'pulse 0.5s ease-in-out';
    }
});

filterSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

renderTasks();