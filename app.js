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


// FORM HANDLING + VALIDATION
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

    document.getElementById("display-name").textContent = updatedProfile.name;
    document.getElementById("display-email").textContent = updatedProfile.email;
    document.getElementById("display-color").textContent = updatedProfile.color;
});


// ------------------------------
// TASK LIST (ARRAY OF OBJECTS)
// ------------------------------

let tasks = [];

const taskList = document.getElementById("taskList");

function renderTasks(taskArray) {

    taskList.innerHTML = "";

    taskArray.map(task => {

        const li = document.createElement("li");

        li.textContent = task.text;

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


// ADD TASK
document.getElementById("addTaskBtn").addEventListener("click", () => {

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

    taskInput.value = "";

    // JSON conversion simulation
    const jsonData = JSON.stringify(tasks);
    console.log("Saved JSON:", jsonData);

    const parsedData = JSON.parse(jsonData);
    console.log("Loaded JSON:", parsedData);
});


// SORT TASKS
document.getElementById("sortTasks").addEventListener("click", () => {

    tasks.sort((a, b) => a.text.localeCompare(b.text));

    renderTasks(tasks);
});


// FILTER COMPLETED
document.getElementById("showCompleted").addEventListener("click", () => {

    const completed = tasks.filter(task => task.completed);

    renderTasks(completed);
});


// SHOW ALL
document.getElementById("showAll").addEventListener("click", () => {

    renderTasks(tasks);
});

const apiList = document.getElementById("apiDataList");
const statusMessage = document.getElementById("statusMessage");

// FETCH USERS
async function fetchUsers() {

    statusMessage.textContent = "Loading data...";
    apiList.innerHTML = "";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (data.length === 0) {
            statusMessage.textContent = "No results found";
            return;
        }

        statusMessage.textContent = "";

        displayUsers(data);

    } catch (error) {
        statusMessage.textContent = "Error loading data. Please try again.";
        console.error(error);
    }
}

function displayUsers(users) {

    apiList.innerHTML = "";

    users.forEach(user => {

        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${user.name}</strong>
            <button class="details-btn">See Details</button>
            <div class="details" style="display:none;">
                Email: ${user.email} <br>
                Company: ${user.company.name}
            </div>
        `;

        // TOGGLE DETAILS
        li.querySelector(".details-btn").addEventListener("click", () => {
            const details = li.querySelector(".details");

            details.style.display =
                details.style.display === "none" ? "block" : "none";
        });

        apiList.appendChild(li);
    });
}

document.getElementById("loadUsers").addEventListener("click", fetchUsers);
