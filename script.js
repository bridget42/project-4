// our user array--- each user is an object
let users = [];

// load users from localStorage when page starts---it only stores strings. We get the string and parse it back to an array.
function loadUsers() {

    const storedUsers = localStorage.getItem('users');

    if (storedUsers) {

        users = JSON.parse(storedUsers);    // If there is data, convert from JSON string to JavaScript array

    } else {

        users = [       // If no data, create some example users
            { id: 1, fullName: 'Ham Kaggawa', userName: 'Ham', email: 'kaggawaham@gmail.com', password: 'haam123', role: 'Admin', status: 'Active' },
            { id: 2, fullName: 'Ruth Tusiime', userName: 'Ruth', email: 'ruthtusiime@gmail.com', password: 'ruth256', role: 'Attendant', status: 'Active' },
            { id: 3, fullName: 'Bridget Ruth', userName: 'Bridget', email: 'bridgetruth@gmail.com', password: 'bridget42', role: 'Manager', status: 'Inactive' },
        ];
        saveUsers();    // saves defaults to localStorage
    }
}    // Save the users array to localStorage

function saveUsers() {     // Convert the array to a JSON string and store it under the key 'users'

    localStorage.setItem('users', JSON.stringify(users));
}

loadUsers();   // Call loadUsers immediately so we have data to work with

// validation
function isUsernameTaken(username) {
    return users.some(user => user.username === username);
}

function isEmailTaken(email) {
    return users.some(user => user.email === email);
}

function doPasswordsMatch(password, confirm) {
    return password === confirm;
}

//get references to DOM elements we'll update often
const userListE1 = document.getElementById('userList');
const userCountE1 = document.getElementById('userCount');

// render table based on current users array
function renderUsers(usersToRender = users) {

    userListE1.innerHTML = '';   // clear the table body first

    // Use map to create an array of HTML strings, then join them into one string
    const rows = usersToRender.map(user => {

        const roleClass = `role-${user.role}`;

        return `<tr class="${role.class}">
  <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td> 

            <button class="editBtn" data-id="${user.id}">Edit</button>
             <button class="deleteBtn" data-id="${user.id}">Delete</button>
</td>
</tr>`;
    }).join('');   //jpin the array of strings into one

     // insert rows into the table

 userListE1.innerHTML = rows;
  // udpate the total user count display

  userCountE1.textContent = users.length;

  // Attach event listeners to the new buttons
  attachButtonListeners();
}       

renderUsers();

function attachButtonListeners() {

     document.querySelectorAll('.deleteBtn').forEach(btn => {

        btn.addEventListener('click', (e) => {

            const userId = parseInt(e.target.getAttribute('data-id')); //gets user id from button

            deleteUser(userId);
        });
     });     // For edit, we'll just open a prompt for simplicity

     document.querySelectorAll('editBtn').forEach(btn => {
        
        btn.addEventListener('click' , (e) => {

            const userId = parseInt(e.target.getAttribute('data-id'));

            editUser(userId);
        });
     });
}

//add user
const userForm = document.getElementById('userForm');

userForm.addEventListener('submit', (e) => {
    e.preventDefault();   //prevent page reload

    const fullName = document.getElementById('fullName').value.trim();
     const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
       const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;
         const role = document.getElementById('role').value;
          const status = document.getElementById('status').value;

          //validation
if (!fullName || !username || !email || !password || !confirm) {
    alert('Please fill all the fields');
    return;
}

if (!doPasswordsMatch(doPasswordsMatch, confirm)) {
    alert('Passwords do not match');
    return;
}

if (isUsernameTaken(username)) {
    alert('Username already taken');
    return;
}

if (isEmailTaken(email)) {
    alert('Email already taken');
    return;
}

// Create new user object with a unique id 
const newUser ={
    id: Date.now(),
    fullName,
    username,
    email,
    password,
    role,
    status,
};

 // Add to users array
    users.push(newUser);

    // Save to localStorage
    saveUsers();

    // Re-render the table to include the new user
    renderUsers();

    // Reset the form
    userForm.reset();
});

//delete user
 function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
users = users.filter(user => user.id !== id);   // Use filter to create a new array without the user with that id
 
saveUsers();
renderUsers();
    }
 }
  
 //edit user
 function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const newRole = prompt('Enter new role (Attendant, Manager, Admin):', user.role);
    if (newRole && ['Attendant', 'Manager', 'Admin'].includes(newRole)) {
        user.role = newRole;
    }

       const newStatus = prompt('Enter new status (Active, Inactive):', user.status);
    if (newStatus && ['Active', 'Inactive'].includes(newStatus)) {
        user.status = newStatus;
    }
     
    saveUsers();
    renderUsers();
 }

 //search
 const searchInput = document.getElementById('search');

 searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {    // If search is empty, show all users
        renderUsers(users);
        return;
    }

     // Filter users: check if any field contains the search term
     const filtered = users.filter(user => {
        return user.fullName.toLowerCase().includes(searchTerm) ||
        user.userName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm);
     });

     renderUsers();      // Render only the filtered users
 });
