document.addEventListener('DOMContentLoaded', () => {
  // === DARK MODE ===
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // === SIDEBAR TOGGLE ===
  const sidebar = document.querySelector('.sidebar');
  const sidebarBtn = document.querySelector('#btn');
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarBtn.classList.toggle('bx-menu-alt-right');
      sidebarBtn.classList.toggle('bx-menu');
    });
  }

  // === USER PROFILE DROPDOWN ===
  const userProfile = document.querySelector('.user-profile');
  if (userProfile) {
    userProfile.addEventListener('click', e => {
      userProfile.classList.toggle('active');
      e.stopPropagation();
    });
    document.addEventListener('click', e => {
      if (!userProfile.contains(e.target)) userProfile.classList.remove('active');
    });
  }

  // === ACTIVE LINK HIGHLIGHT ===
  const highlightActiveLink = () => {
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  };
  highlightActiveLink();

  // === LOGIN PAGE AUTO SIGN-IN ===
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      if (email.includes('@') && password.length > 0) {
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert('Please enter a valid email and password.');
      }
    });
  }

  // === GUIDE MAP FUNCTIONALITY ===
  const floorButtonsGrid = document.getElementById('floorButtonsContainer');
  const floorPlanImage = document.getElementById('floorPlanImage');
  const roomButtonsContainer = document.getElementById('roomButtonsContainer');
  const roomName = document.getElementById('selectedRoomName');
  const roomDesc = document.getElementById('selectedRoomDescription');
  const roomImage = document.getElementById('selectedRoomImage');

  const floorPlans = {};
  const roomData = {};

  for (let i = 2; i <= 16; i++) {
    const floorCode = `F${i}`;
    const rooms = [];

    for (let j = 1; j <= 12; j++) {
      const roomId = `${floorCode}${j.toString().padStart(2, '0')}`;
      rooms.push(roomId);
      roomData[roomId] = {
        name: `${roomId} - Room Name`,
        description: `Description for ${roomId}.`,
        image: `images/${roomId}.jpg`
      };
    }

    floorPlans[floorCode] = {
      image: `images/feu-f${i}-map.png`, // This updates per floor
      rooms: rooms
    };
  }

  let floorButtons = [];

  if (floorButtonsGrid) {
    for (let i = 2; i <= 16; i++) {
      const btn = document.createElement('button');
      btn.className = 'floor-button';
      btn.dataset.floor = `F${i}`;
      btn.textContent = `Floor ${i}`;
      floorButtonsGrid.appendChild(btn);
    }

    floorButtons = document.querySelectorAll('.floor-button');

    floorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        updateFloor(btn.dataset.floor);
      });
    });

    updateFloor('F2'); // Load default floor on page load
  }

  function updateFloor(floor) {
    const floorData = floorPlans[floor];
    if (!floorData) return;

    if (floorPlanImage) {
      floorPlanImage.src = floorData.image;
      floorPlanImage.alt = `Floor Plan for ${floor}`;
    }

    if (roomButtonsContainer) {
      roomButtonsContainer.innerHTML = '';
      floorData.rooms.forEach(roomId => {
        const btn = document.createElement('button');
        btn.className = 'room-button';
        btn.textContent = roomId;
        btn.dataset.roomId = roomId;
        btn.addEventListener('click', () => showRoomInfo(roomId));
        roomButtonsContainer.appendChild(btn);
      });
    }

    // Highlight active floor
    floorButtons.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.floor-button[data-floor="${floor}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  function showRoomInfo(roomId) {
    const data = roomData[roomId];
    if (!data) return;

    if (roomName) roomName.textContent = data.name;
    if (roomDesc) roomDesc.textContent = data.description;
    if (roomImage) roomImage.src = data.image;
  }
});

// === INITIALS HELPER ===
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
