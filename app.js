// PROFILE CLOSURE (stores profile data privately)
function createProfileManager() {

    let profile = {
        name: "Your Name",
        email: "your@email.com",
        color: "#ADD8E6"
    };

    return {

        updateProfile(name, email, color) {

            profile.name = name;
            profile.email = email;
            profile.color = color;
        },

        getProfile() {

            return profile;
        }
    };
}

const profileManager = createProfileManager();


// ------------------------------
// FORM HANDLING + VALIDATION
// ------------------------------

document.getElementById("profileForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const color = document.getElementById("color").value;

    if (name === "") {

        alert("Please enter your name");
        return;
    }

    if (!email.includes("@")) {

        alert("Please enter a valid email");
        return;
    }

    profileManager.updateProfile(name, email, color);

    const updatedProfile = profileManager.getProfile();

    document.getElementById("display-name").textContent =
        updatedProfile.name;

    document.getElementById("display-email").textContent =
        updatedProfile.email;

    document.getElementById("display-color").textContent =
        updatedProfile.color;
});


// ------------------------------
// TASK LIST
// ------------------------------

let tasks = [];

const taskList = document.getElementById("taskList");

function renderTasks(taskArray) {

    taskList.innerHTML = "";

    taskArray.forEach(task => {

        const li = document.createElement("li");

        li.textContent = task.text;

        // Toggle completed status
        li.onclick = () => {

            task.completed = !task.completed;

            renderTasks(tasks);
        };

        if (task.completed) {

            li.style.textDecoration = "line-through";
        }

        taskList.appendChild(li);
    });
}


// ------------------------------
// ADD TASK + SAVE TO EXPRESS API
// ------------------------------

document.getElementById("addTaskBtn").addEventListener("click", async () => {

    const taskInput = document.getElementById("taskInput");

    if (taskInput.value.trim() === "") {

        alert("Please enter a task");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        completed: false
    };

    tasks.push(newTask);

    renderTasks(tasks);

    // SAVE TASK TO BACKEND
    try {

        await fetch("https://personal-dashboard-project.onrender.com/api/items", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: taskInput.value
            })
        });

        console.log("Task saved to backend");

    } catch (error) {

        console.error("Failed to save task:", error);
    }

    taskInput.value = "";

    // JSON conversion simulation
    const jsonData = JSON.stringify(tasks);
    console.log("Saved JSON:", jsonData);

    const parsedData = JSON.parse(jsonData);
    console.log("Loaded JSON:", parsedData);
});


// ------------------------------
// SORT TASKS
// ------------------------------

document.getElementById("sortTasks").addEventListener("click", () => {

    tasks.sort((a, b) => a.text.localeCompare(b.text));

    renderTasks(tasks);
});


// ------------------------------
// FILTER COMPLETED TASKS
// ------------------------------

document.getElementById("showCompleted").addEventListener("click", () => {

    const completedTasks = tasks.filter(task => task.completed);

    renderTasks(completedTasks);
});


// ------------------------------
// SHOW ALL TASKS
// ------------------------------

document.getElementById("showAll").addEventListener("click", () => {

    renderTasks(tasks);
});


// ------------------------------
// EXPRESS API FETCHING
// ------------------------------

const apiList = document.getElementById("apiDataList");
const statusMessage = document.getElementById("statusMessage");


// FETCH ITEMS FROM EXPRESS BACKEND
async function fetchItems() {

    statusMessage.textContent = "Loading data...";

    apiList.innerHTML = "";

    try {

        const response = await fetch(
            "https://personal-dashboard-project.onrender.com/api/items"
        );

        if (!response.ok) {

            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data.length === 0) {

            statusMessage.textContent = "No items found";

            return;
        }

        statusMessage.textContent = "";

        displayItems(data);

    } catch (error) {

        statusMessage.textContent =
            "Server connection failed. Please try again.";

        console.error(error);
    }
}


// ------------------------------
// DISPLAY ITEMS
// ------------------------------

function displayItems(items) {

    apiList.innerHTML = "";

    items.forEach(item => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${item.text}</strong>
            <p>Status: ${item.completed ? "Completed" : "Pending"}</p>
        `;

        apiList.appendChild(li);
    });
}


// ------------------------------
// LOAD DATA BUTTON
// ------------------------------

document.getElementById("loadUsers").addEventListener(
    "click",
    fetchItems
);