document.addEventListener('DOMContentLoaded', () => {
  // References to tab elements and content containers
  const ufcTab = document.getElementById('ufc-tab');
  const otherTab = document.getElementById('other-tab');
  const ufcContent = document.getElementById('ufc-content');
  const otherContent = document.getElementById('other-content');
  const ufcEventsList = document.getElementById('ufc-events');
  
  // Tab switching logic
  function showTab(tab) {
    if (tab === 'ufc') {
      ufcTab.classList.add('active');
      otherTab.classList.remove('active');
      ufcContent.classList.remove('hidden');
      otherContent.classList.add('hidden');
    } else {
      otherTab.classList.add('active');
      ufcTab.classList.remove('active');
      otherContent.classList.remove('hidden');
      ufcContent.classList.add('hidden');
    }
  }
  
  // Add event listeners to the tabs
  ufcTab.addEventListener('click', () => showTab('ufc'));
  otherTab.addEventListener('click', () => showTab('other'));
  
  async function fetchUfcEvents() {
    // Fetch data from the proxy server
    try {
      const response = await fetch('http://localhost:3000/ufc-events');
      const htmltext = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmltext, 'text/html');
      const events = doc.querySelectorAll('.c-card-event--result__info');
      
      const currentUnixTime = Math.floor(Date.now() / 1000);
      const data = [];
      
      // Scrape event information from the 
      events.forEach(event => {
        const titleEvent = event.querySelector('.c-card-event--result__headline');
        const title = titleEvent ? titleEvent.innerText : null;
        
        const dateEvent = event.querySelector('.c-card-event--result__date.tz-change-data');
        const date = dateEvent ? dateEvent.getAttribute('data-main-card') : null;
        const dateUnix = dateEvent ? parseInt(dateEvent.getAttribute('data-main-card-timestamp'), 10) : null;
        
        const eventArena = event.querySelector('.field--name-taxonomy-term-title');
        const arena = eventArena ? eventArena.innerText : null;
        
        const eventCity = event.querySelector('.e-p--small.c-card-event--result__location .field--name-location .locality');
        const city = eventCity ? eventCity.innerText : null;
        
        const eventAdminArea = event.querySelector('.e-p--small.c-card-event--result__location .field--name-location .administrative-area');
        const adminArea = eventAdminArea ? eventAdminArea.innerText : null;
        
        const eventCountry = event.querySelector('.e-p--small.c-card-event--result__location .field--name-location .country');
        const country = eventCountry ? eventCountry.innerText : null;
        
        if (dateUnix && dateUnix > currentUnixTime) {
          data.push({title, date, arena, city, adminArea, country});
        }
      });
      
      return data;
    } catch (error) {
      console.error('Failed to fetch UFC events:', error);
      return [];
    }
  }
  
  // Populate UFC tab
  async function populateUfcEvents() {
    const events = await fetchUfcEvents();
    ufcEventsList.innerHTML = '';
    
    events.forEach(event => {
      // Create a container for each event and add all linked information
      const eventBox = document.createElement('div');
      eventBox.classList.add('event-box');
      
      const title = document.createElement('h3');
      title.textContent = event.title;
      eventBox.appendChild(title);
      
      const date = document.createElement('p');
      date.classList.add('date');
      date.textContent = event.date;
      eventBox.appendChild(date);
      
      if (event.arena) {
        const arena = document.createElement('p');
        arena.classList.add('arena');
        arena.textContent = event.arena;
        eventBox.appendChild(arena);
      }
      
      const location = document.createElement('p');
      location.classList.add('location');
      let locationText = event.city || ''; // Add location info based on availability
      if (event.adminArea) {
        locationText += `, ${event.adminArea}`;
      }
      if (event.country) {
        locationText += `, ${event.country}`;
      }
      location.textContent = locationText.trim();
      eventBox.appendChild(location);
      
      // Append event container to the list
      ufcEventsList.appendChild(eventBox);
    });
  }
  
  populateUfcEvents();
  
});
