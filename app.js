const calendar = document.querySelector('.calendar');
const today = new Date();
const currentDay = today.getDate();
const month = today.getMonth() + 1; // 1 = Januar

// Alle möglichen Links (24 oder mehr, damit Zufall funktioniert)
const links = [
  "https://keinverlag.de/1",
  "https://keinverlag.de/2",
  "https://keinverlag.de/3",
  "https://keinverlag.de/4",
  "https://keinverlag.de/5",
  "https://keinverlag.de/6",
  "https://keinverlag.de/7",
  "https://keinverlag.de/8",
  "https://keinverlag.de/9",
  "https://keinverlag.de/10",
  "https://keinverlag.de/11",
  "https://keinverlag.de/12",
  "https://keinverlag.de/13",
  "https://keinverlag.de/14",
  "https://keinverlag.de/15",
  "https://keinverlag.de/16",
  "https://keinverlag.de/17",
  "https://keinverlag.de/18",
  "https://keinverlag.de/19",
  "https://keinverlag.de/20",
  "https://keinverlag.de/21",
  "https://keinverlag.de/22",
  "https://keinverlag.de/23",
  "https://keinverlag.de/24"
];

// localStorage-Daten
let doorLinks = JSON.parse(localStorage.getItem('doorLinks')) || {};
let openedDoors = JSON.parse(localStorage.getItem('openedDoors')) || [];

// Adventskalender nur im Dezember
if (month === 12) {
  for (let i = 1; i <= 24; i++) {
    const door = document.createElement('div');
    door.classList.add('door');
    door.textContent = i;

    // Tür bereits geöffnet
    if (openedDoors.includes(i)) {
      door.classList.add('open');
    } 
    // Tür noch nicht verfügbar
    else if (i > currentDay) {
      door.classList.add('locked');
    }

    door.addEventListener('click', () => {
      if (i <= currentDay && !openedDoors.includes(i)) {
        // Zufälligen Link auswählen, falls noch nicht gesetzt
        if (!doorLinks[i]) {
          const randomIndex = Math.floor(Math.random() * links.length);
          doorLinks[i] = links[randomIndex];
          localStorage.setItem('doorLinks', JSON.stringify(doorLinks));
        }

        // Tür öffnen
        door.classList.add('open');
        openedDoors.push(i);
        localStorage.setItem('openedDoors', JSON.stringify(openedDoors));

        // Link öffnen
        window.open(doorLinks[i], '_blank');
      }
    });

    calendar.appendChild(door);
  }
} else {
  calendar.textContent = "Der Adventskalender ist nur im Dezember verfügbar.";
}
