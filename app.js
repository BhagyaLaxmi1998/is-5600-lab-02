document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM Loaded. Starting App...");

  // Check if userContent and stockContent exist
  if (typeof userContent === "undefined") {
    console.error("❌ userContent is not defined. Check if 'data/users.js' is included BEFORE app.js");
    return;
  }
  if (typeof stockContent === "undefined") {
    console.error("❌ stockContent is not defined. Check if 'data/stocks-complete.js' is included BEFORE app.js");
    return;
  }

  // Parse JSON safely
  let userData, stocksData;
  try {
    userData = JSON.parse(userContent);
    stocksData = JSON.parse(stockContent);
  } catch (err) {
    console.error("❌ Error parsing JSON:", err);
    return;
  }

  console.log("✅ Users Loaded:", userData);
  console.log("✅ Stocks Loaded:", stocksData);

  const userList = document.querySelector('.user-list');
  const portfolioList = document.querySelector('.portfolio-list');
  const saveButton = document.querySelector('#saveButton');
  const deleteButton = document.querySelector('#deleteButton');

  if (!userList) {
    console.error("❌ Could not find element with class '.user-list' in index.html");
    return;
  }

  /** ------------------------------
   * Render User List
   * ------------------------------ */
  function generateUserList(users, stocks) {
    console.log("🔄 Rendering user list...");
    userList.innerHTML = '';

    if (!Array.isArray(users) || users.length === 0) {
      userList.innerHTML = '<li style="color:red;">No users found in data/users.js</li>';
      console.warn("⚠️ No user data available.");
      return;
    }

    users.forEach(({ user, id }) => {
      const li = document.createElement('li');
      li.innerText = `${user.lastname}, ${user.firstname}`;
      li.id = id;
      li.style.cursor = 'pointer';
      li.style.padding = '6px 10px';
      li.style.margin = '3px 0';
      li.style.background = '#eef4ff';
      li.style.borderRadius = '6px';
      li.addEventListener('mouseenter', () => (li.style.background = '#cce5ff'));
      li.addEventListener('mouseleave', () => (li.style.background = '#eef4ff'));
      userList.appendChild(li);
    });

    // Attach event handler for clicks
    userList.addEventListener('click', (e) => handleUserClick(e, users, stocks));
  }

  /** ------------------------------
   * Populate Form
   * ------------------------------ */
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }

  /** ------------------------------
   * Handle User Click
   * ------------------------------ */
  function handleUserClick(event, users, stocks) {
    const userId = event.target.id;
    const selected = users.find(u => u.id == userId);
    if (!selected) return;
    console.log("👤 Selected User:", selected.user.firstname, selected.user.lastname);
    populateForm(selected);
    renderPortfolio(selected, stocks);
  }

  /** ------------------------------
   * Render Portfolio
   * ------------------------------ */
  function renderPortfolio(user, stocks) {
    portfolioList.innerHTML = '';
    const { portfolio } = user;
    portfolio.forEach(({ symbol, owned }) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.justifyContent = 'space-between';
      container.style.border = '1px solid #ccc';
      container.style.borderRadius = '6px';
      container.style.padding = '6px';
      container.style.margin = '4px 0';
      container.style.background = '#f9f9f9';

      const symbolEl = document.createElement('p');
      symbolEl.textContent = symbol;

      const sharesEl = document.createElement('p');
      sharesEl.textContent = `Shares: ${owned}`;

      const btn = document.createElement('button');
      btn.textContent = 'View';
      btn.id = symbol;
      btn.style.background = '#007bff';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.padding = '3px 8px';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => viewStock(symbol, stocks));

      container.appendChild(symbolEl);
      container.appendChild(sharesEl);
      container.appendChild(btn);
      portfolioList.appendChild(container);
    });
  }

  /** ------------------------------
   * View Stock Info
   * ------------------------------ */
  function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) return;
    console.log("📊 Viewing stock:", symbol);

    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    document.querySelector('#logo').src = `logos/${symbol}.svg`;
  }

  /** ------------------------------
   * Delete User
   * ------------------------------ */
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;
    const index = userData.findIndex(u => u.id == id);
    if (index > -1) {
      userData.splice(index, 1);
      generateUserList(userData, stocksData);
      portfolioList.innerHTML = '';
      alert('🗑️ User deleted successfully!');
    }
  });

  /** ------------------------------
   * Save User
   * ------------------------------ */
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;
    const user = userData.find(u => u.id == id);
    if (user) {
      user.user.firstname = document.querySelector('#firstname').value;
      user.user.lastname = document.querySelector('#lastname').value;
      user.user.address = document.querySelector('#address').value;
      user.user.city = document.querySelector('#city').value;
      user.user.email = document.querySelector('#email').value;
      generateUserList(userData, stocksData);
      alert('💾 User info updated!');
    }
  });

  // ✅ Add page background
  document.body.style.background = 'linear-gradient(to right, #f3f9ff, #fff8f5)';

  // ✅ Initialize
  generateUserList(userData, stocksData);
});
