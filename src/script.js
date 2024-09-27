let maps = [];
let filteredMaps = [];
let searchText = '';
let activeFilters = {
  gameMode: new Set(),
  size: new Set(),
  layer: new Set(),
  era: new Set()
};

const gameModeMapping = {
  'advance and secure': 'gpm_cq',
  'insurgency': 'gpm_insurgency',
  'skirmish': 'gpm_skirmish',
  'command and control': 'gpm_cnc',
  'vehicle warfare': 'gpm_vehicles',
  'gun game': 'gpm_gungame',
  'cooperative': 'gpm_coop'
};

const eraMapping = {
  'world war ii': 'ww2'
};

const layerMapping = {
  'infantry': 16,
  'standard': 64,
  'alternative': 32,
  'large': 128
};


fetch('./basic_levels.json')
  .then(response => response.json())
  .then(data => {
    maps = data;
    filteredMaps = maps;
    renderCards(filteredMaps);
  });


function renderCards(filteredMaps) {
  mapCardsContainer.innerHTML = '';
  filteredMaps.forEach(map => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <a href="#" class="h-[306px] flex flex-col rounded-3xl bg-prWhite">
        <div class="mt-4 mx-4 h-[232px] rounded-2xl bg-fuchsia-500 overflow-hidden relative">
          <img src="./img/map_thumb/${map.Key}.jpeg" alt="Card Image" class="w-full h-full object-cover">
        </div>
        <div class="flex mx-4 mt-2 justify-between items-center">
          <div class="container">
            <h2 class="text-2xl leading-[.9] font-staatliches">${map.Name}</h2>
            <h3 class="text-xs font-roboto-mono font-semibold text-prDarkGray">${map.Size} Kilometer</h3>
          </div>
          
          <span class="p-0.5 px-2 text-prWhite font-roboto-mono font-bold text-[10px] bg-prBlack rounded-md hover:bg-slate-800">View Detailed</span>
        </div>  
      </a>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      showDetailedMapView(map);
    });

    mapCardsContainer.appendChild(card);
  });
}


const searchBox = document.querySelector('#search-box');
const mapCardsContainer = document.querySelector('#map-cards');


// Search Box
searchBox.addEventListener('input', (e) => {
  searchText = e.target.value.toLowerCase();
  applyFilters(); 
});

// MultiFilters
function applyFilters() {
  filteredMaps = maps.filter(map => {
    const matchesSearch = map.Name.toLowerCase().includes(searchText);

    const matchesGameMode = activeFilters.gameMode.size === 0 || map.Layouts.some(layout => activeFilters.gameMode.has(layout.GameMode));
    const matchesSize = activeFilters.size.size === 0 || activeFilters.size.has(map.Size);
    const matchesLayer = activeFilters.layer.size === 0 || map.Layouts.some(layout => activeFilters.layer.has(layout.Layer));
    const matchesEra = activeFilters.era.size === 0 || map.Layouts.some(layout => activeFilters.era.has(layout.Era));

    return matchesSearch && matchesGameMode && matchesSize && matchesLayer && matchesEra;
  });

  renderCards(filteredMaps);
}


function toggleFilter(filterType, value, button) {
  
  if (activeFilters[filterType].has(value)) {
    activeFilters[filterType].delete(value);
    button.classList.remove("bg-black", "text-white");
    button.classList.add("bg-transparent", "text-black"); 
  } else {
    activeFilters[filterType].add(value);
    button.classList.add("bg-black", "text-white");
    button.classList.remove("bg-transparent", "text-black"); 
  }
  applyFilters(); 
}

document.querySelectorAll('.game-mode-button').forEach(button => {
  button.addEventListener('click', () => {
    const gameModeText = button.textContent.trim().toLowerCase();
    const gameMode = gameModeMapping[gameModeText];
    toggleFilter('gameMode', gameMode, button);
  });
});

document.querySelectorAll('.size-button').forEach(button => {
  button.addEventListener('click', () => {
    const size = parseInt(button.textContent.trim());
    toggleFilter('size', size, button);
  });
});

document.querySelectorAll('.layer-button').forEach(button => {
  button.addEventListener('click', () => {
    const layerText = button.textContent.trim().toLowerCase();
    const layer = layerMapping[layerText];
    toggleFilter('layer', layer, button);
  });
});

document.querySelectorAll('.era-button').forEach(button => {
  button.addEventListener('click', () => {
    const eraText = button.textContent.trim().toLowerCase();
    const era = eraMapping[eraText] || eraText;
    toggleFilter('era', era, button);
  });
});


// Detailed View Card
function showDetailedMapView(map) {
  let activeGameModeSelection = '';
  let activeLayerSelection = '';

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.classList.add('fixed', 'inset-0', 'bg-black', 'backdrop-blur-[2px]', 'bg-opacity-70', 'flex', 'items-center', 'justify-center', 'z-50');
  
  const detailedMapView = document.createElement('div');
  detailedMapView.id = 'detailed-map-view';
  detailedMapView.innerHTML = `
      <div class="w-[755px] h-[870px] relative flex mx-auto mt-4 mb-4 z-50">
        <div class="container flex bg-prWhite rounded-3xl">
          <div class="container flex flex-col mt-4 mx-4">
            <div class="w-[720px] h-[720px] rounded-2xl bg-fuchsia-500 relative overflow-hidden">
              <img src="./img/map_full/${map.Key}.png" alt="" class="w-full h-full object-cover">
            </div>

            <div class="container relative flex mt-4">
            <!-- Layer -->
              <div class="container flex flex-col">
                <div class="flex flex-col items-start">
                  <h3 class="mb-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Map</h3>
                  <div class="flex flex-col items-start">
                    <h1 class="font-staatliches leading-[.9] text-2xl text-black">${map.Name}</h1>
                    <h3 class="my-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Size</h3>
                    <h2 class="font-staatliches leading-[.9] text-xl text-black">${map.Size} Kilometer</h2>
                  </div>
                </div>
              </div>

            <!-- Vertical Line -->
            <div class="flex items-center">
              <div class="w-0.5 h-16 ml-1 bg-prDarkGray opacity-20"></div>
            </div>

              <!-- Game Mode -->
            <div class="container flex flex-col items-center">
              <div class="flex flex-col mx-4 items-start">
                <h3 class="mb-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Game Mode</h3>
                <div class="flex flex-row">
                  <div class="flex flex-col items-start">
                    ${['advance and secure', 'insurgency', 'skirmish', 'command and control'].map(gameModeText => {
                        const gameMode = gameModeMapping[gameModeText.toLowerCase()];
                        const isDisabled = !map.Layouts.some(layout => layout.GameMode === gameMode);
                        return `<button class="game-mode-button-detailed ${isDisabled ? 'disabled text-gray-300 cursor-not-allowed line-through' : 'text-black'} whitespace-nowrap font-staatliches leading-[1.2] text-lg">${gameModeText}</button>`;
                    }).join('')}
                  </div>
                  <div class="ml-2 flex flex-col items-start">
                    ${['vehicle warfare', 'gun game', 'cooperative'].map(gameModeText => {
                        const gameMode = gameModeMapping[gameModeText.toLowerCase()];
                        const isDisabled = !map.Layouts.some(layout => layout.GameMode === gameMode);
                        return `<button class="game-mode-button-detailed ${isDisabled ? 'disabled text-gray-300 cursor-not-allowed line-through' : 'text-black'} whitespace-nowrap font-staatliches leading-[1.2] text-lg">${gameModeText}</button>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Vertical Line -->
            <div class="flex items-center">
              <div class="w-0.5 h-16 bg-prDarkGray opacity-20"></div>
            </div>

            <!-- Layer -->
            <div class="container flex flex-col items-center">
              <div class="flex flex-col items-start">
                <h3 class="mb-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Layer</h3>
                <div class="flex flex-col items-start">
                  ${Object.keys(layerMapping).map(layerText => {
                      const layer = layerMapping[layerText];
                      const isDisabled = !map.Layouts.some(layout => layout.Layer === layer);
                      return `<button class="layer-button-detailed ${isDisabled ? 'disabled text-gray-300 cursor-not-allowed line-through' : 'text-black'} font-staatliches leading-[1.2] text-lg">${layerText}</button>`;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Vertical Line -->
            <div class="flex items-center">
              <div class="w-0.5 h-16 bg-prDarkGray opacity-20"></div>
            </div>
            
            <!-- Route -->
            <div class="container flex flex-col items-center">
              <div class="flex flex-col items-start">
                <h3 class="mb-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Route</h3>
                <div class="routes flex flex-col items-start">
                  <!-- autofill -->
                </div>
              </div>
            </div>
            
            <!-- Vertical Line -->
            <div class="flex items-center">
              <div class="w-0.5 h-16 bg-prDarkGray opacity-20"></div>
            </div>
            
            <!-- Voting -->
            <div class="container flex flex-col">
              <div class="flex flex-col items-center">
                <h3 class="mb-[2px] font-roboto-mono font-semibold text-xs text-prDarkGray">Voting</h3>
                <div class="flex items-center justify-center mt-4">
                  <a href="" class="flex items-center justify-center p-1.5 px-2 text-prWhite font-roboto-mono font-bold text-[10px] bg-prBlack rounded-md hover:bg-slate-800">Vote</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;


  overlay.appendChild(detailedMapView);
  document.body.appendChild(overlay);


  const closeButton = document.createElement('button');
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12" id="close-icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  `;
  
  Object.assign(closeButton.style, {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '60',
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
  });
  
  document.body.appendChild(closeButton);
  
  
  const closeIcon = document.getElementById('close-icon');
  
  closeButton.addEventListener('mouseover', () => {
    // Solid
    closeIcon.setAttribute('fill', 'currentColor');
    closeIcon.setAttribute('stroke', 'none');
    closeIcon.innerHTML = `
      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
    `;
  });
  
  closeButton.addEventListener('mouseout', () => {
    // Outline
    closeIcon.setAttribute('fill', 'none');
    closeIcon.setAttribute('stroke', 'currentColor');
    closeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    `;
  });

  function closeDetailedView() {
    overlay.remove();
    closeButton.remove();
  }

  closeButton.addEventListener('click', closeDetailedView);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeDetailedView();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDetailedView();
    }
  });

  const gameModeButtonsDetailed = document.querySelectorAll('.game-mode-button-detailed');
  gameModeButtonsDetailed.forEach(button => {
      button.addEventListener('click', () => {
          // Check if button is disabled
          if (button.classList.contains('disabled')) {
              return;
          }

          gameModeButtonsDetailed.forEach(btn => {
              btn.classList.remove('bg-black', 'text-white');
              btn.classList.add('bg-transparent', 'text-black');
          });

          button.classList.add('bg-black', 'text-white');
          button.classList.remove('bg-transparent', 'text-black');

          if (activeGameModeSelection !== gameModeMapping[button.textContent.trim().toLowerCase()]) {
            activeGameModeSelection = gameModeMapping[button.textContent.trim().toLowerCase()];
            activeLayerSelection = '';
            layerButtonsDetailed.forEach(btn => {
              btn.classList.remove('bg-black', 'text-white');
              btn.classList.add('bg-transparent', 'text-black');
            });
            updateLayerButtonStates();
          }
          updateMapRouteFile();
        });
      });

  const layerButtonsDetailed = document.querySelectorAll('.layer-button-detailed');
  layerButtonsDetailed.forEach(button => {
      button.addEventListener('click', () => {
          if (button.classList.contains('disabled')) {
              return;
          }

          layerButtonsDetailed.forEach(btn => {
              btn.classList.remove('bg-black', 'text-white');
              btn.classList.add('bg-transparent', 'text-black');
          });

          button.classList.add('bg-black', 'text-white');
          button.classList.remove('bg-transparent', 'text-black');

          activeLayerSelection = layerMapping[button.textContent.trim().toLowerCase()];
          updateMapRouteFile();
      });
  });

  function updateLayerButtonStates() {
      const enabledLayers = new Set(map.Layouts.filter(layout => layout.GameMode === activeGameModeSelection).map(layout => layout.Layer));
      layerButtonsDetailed.forEach(button => {
          const layerText = button.textContent.trim().toLowerCase();
          const layer = layerMapping[layerText];
          const isDisabled = !enabledLayers.has(layer);
          button.classList.toggle('disabled', isDisabled);
          button.classList.toggle('text-gray-300', isDisabled);
          button.classList.toggle('cursor-not-allowed', isDisabled);
          button.classList.toggle('line-through', isDisabled);
          button.classList.toggle('text-black', !isDisabled);
          if (isDisabled) {
              button.classList.remove('bg-black', 'text-white');
              button.classList.add('bg-transparent', 'text-black');
          }
      });
  }


  async function updateMapRouteFile() {
    if (activeGameModeSelection && activeLayerSelection) {
      const mapRouteFile = `./map_json_data/${map.Name.replace(" ", "").toLowerCase()}/${activeGameModeSelection}_${activeLayerSelection}.json`;
      console.log(mapRouteFile);
  
      try {
        const response = await fetch(mapRouteFile);
        if (!response.ok) {
          throw new Error('file not found');
        }
  
        const data = await response.json();
        const mapRoutes = data.ControlPoints;
        const totalRoutes = calculateTotalRoutes(mapRoutes);
        updateRoutesInView(totalRoutes);
  

      } catch (error) {
        console.error('Error getting data data:', error);
      }
    }
  }

}


function updateRoutesInView(totalRoutes) {
  const routesContainer = document.querySelector('.routes');
  routesContainer.innerHTML = '';

  for (let i = 1; i <= totalRoutes; i++) {
    const routeButton = `<button class="whitespace-nowrap font-staatliches leading-[1.2] text-lg text-black">Route ${i}</button>`;
    routesContainer.innerHTML += routeButton; 
  }
}

function calculateTotalRoutes(controlPoints) {
  const routeSet = new Set();
  let hasThreeDigitRoutes = false; 

  controlPoints.forEach(point => {
    const supplyGroupId = point.SupplyGroupId;
    
    if (supplyGroupId === 1 || supplyGroupId === -1) {
      return;
    }

    // 3 digit numbers denote multiple layers.
    // layers with 1 route only have single digit numbers.
    if (supplyGroupId >= 100) {
      hasThreeDigitRoutes = true; 
    }

    const supplyGroupIdStr = supplyGroupId.toString();
    const routeNumber = supplyGroupIdStr[supplyGroupIdStr.length - 1];
    routeSet.add(routeNumber);
  });

  if (!hasThreeDigitRoutes) {
    return 1;
  }

  return routeSet.size;
}

