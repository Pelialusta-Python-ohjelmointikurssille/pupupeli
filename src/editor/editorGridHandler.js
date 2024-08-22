export function createTable(isLoad, isImport = false, width = 8, height = 8) {
    let gridDimensions;
    if (isImport) {
        gridDimensions = {
            width: width,
            height: height
        };
    } else {
        gridDimensions = {
            width: document.getElementById("grid-width-input").value,
            height: document.getElementById("grid-height-input").value
        };
    }
    const table = document.getElementById("editor-table");

    // empty the table in case user generates multiple times without reloading page
    table.innerHTML = '';

    for (let x = 0; x < gridDimensions.height; x++) {
        table.appendChild(document.createElement("tr"));
        for (let y = 0; y < gridDimensions.width; y++) {
            let cell = table.children[x].appendChild(document.createElement("td"));
            cell.dataset.value = "1";
            cell.innerHTML = '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';

            cell.addEventListener('click', function () {
                //Case 1 is is the default value, grass.
                //Case 0 is reserved for player, so we skip it
                this.dataset.value++;
                if (this.dataset.value > _maxImageIndex) this.dataset.value = 1;
                this.innerHTML = getImage(this.dataset.value);
            });
        }
    }

    let cells = table.getElementsByTagName("td");

    Array.from(cells).forEach(cell => {
        cell.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            Array.from(cells).forEach(c => {
                if (c.dataset.value === "0") {
                    c.dataset.value = "1";
                    c.innerHTML = '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>'
                }
            });

            this.dataset.value = "0";
            this.innerHTML = '<img src="/src/static/game_assets/characters/bunny_right.png"></img>';
        });
    });
}

export function createGridFromTable() {
    const table = document.getElementById('editor-table');
    const rows = table.rows;
    const grid = [];

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const rowArray = [];

        for (let j = 0; j < cells.length; j++) {
            rowArray.push(cells[j].dataset.value);
        }

        grid.push(rowArray);
    }

    return grid;
}

export function importGrid(grid) {
    const table = document.getElementById("editor-table");
    let cells = table.getElementsByTagName("td");
    let ctr = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            cells[ctr].dataset.value = grid[i][j];
            ctr++;
        }
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = getImage(cells[i].dataset.value);
    }
}


//Change this value if you add more images to the switch statement in getImage() below
var _maxImageIndex = 3;
//IMPORTANT! "maxImageIndex" above must be the same as the max value used in the switch statement below
/**
 * Get the image path by using the value it represents in gamecode when it creates the grid in game logic.
 * Remember that if you change the values below, change the values of "gridObjectManifest" in gridfactory.js.
 * They must be the same.
 */
function getImage(value) {
    //Player is 0, grass is 1 and is used as the default
    switch (value) {
        case '0':
            return '<img src="/src/static/game_assets/characters/bunny_right.png"></img>';
        case '2':
            return '<img src="/src/static/game_assets/collectibles/carrot.png"></img>';
        case '3':
            return '<img src="/src/static/game_assets/obstacles/rock.png"></img>';
        default:
            return '<img src="/src/static/game_assets/backgrounds/background_grass.png"></img>';
    }
}