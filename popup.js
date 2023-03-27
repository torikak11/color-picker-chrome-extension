let myColors = [];
const myColorsLocalStorage = JSON.parse(localStorage.getItem("myColors"));
const ulElement = document.getElementById("ul-element");
const startBtn = document.getElementById("open-eyeDropper");
const message = document.getElementById("msg");


if (myColorsLocalStorage) {
    myColors = myColorsLocalStorage;
    render(myColors);
}

if ('EyeDropper' in window) {
    startBtn.addEventListener("click", pickColor);
} else {
    message.innerHTML = "Browser not supported"
    setTimeout(function(){ message.innerHTML = '';}, 2000);
}

// open eyeDropper once "Pick Color" is clicked
async function pickColor() {
    let result = null;
    try {
        const eyeDropper = new EyeDropper();
        result = await eyeDropper.open();
    } catch (e) {
        console.log(e)
        return
    }

    if (result) {
        const color = result.sRGBHex;
        myColors.push(color);
        localStorage.setItem("myColors", JSON.stringify(myColors));
        render(myColors);
    }
}

// render saved colors from local storage
async function render(colors) {
    let listItems = '';
    try {
        for (let i = 0; i < colors.length; i++) {
            listItems += `
                <li id="ul-li" data-itemindex="${i}">
                    <div class="color-info">
                        <span class="color-preview" style="background-color:${colors[i]}"></span>
                        <p>${colors[i]}</p>
                    </div>
                    <div class="buttons">
                        <button id="copy-btn" class="btn">
                            <img src="images/copy.png" alt="Copy text button" width="20" height="20" />
                        </button>
                        <button id="delete-btn" class="btn">
                            <img src="images/bin.png" alt="Delete button" width="20" height="20" />
                        </button>
                    </div>
                </li>
                <hr>
            `
        }
        ulElement.innerHTML = listItems;
        
        var deleteElements = document.querySelectorAll('#ul-li #delete-btn');
        for (let i = 0; i < deleteElements.length; i++) {
            deleteElements[i].addEventListener('click', function() {
                var index = this.parentNode.parentNode.dataset.itemindex;
                deleteElement(index);
            });
        }

        var copyElements = document.querySelectorAll('#ul-li #copy-btn');
        for (let i = 0; i < copyElements.length; i++) {
            copyElements[i].addEventListener('click', function() {
                var color = colors[i]
                copyElement(color);
            });
        }
    } catch (e) {
        return
    }
    
}

// delete listed color
async function deleteElement(index) {
    var itemStorage = JSON.parse(localStorage.getItem("myColors"));
    itemStorage.splice(index, 1);
    myColors = itemStorage;
    localStorage.setItem("myColors", JSON.stringify(myColors));
    render(myColors);
}
// copy listed color onto clipboard
async function copyElement(color) {
    navigator.clipboard.writeText(color)
    message.innerHTML = "Color copied to clipboard"
    setTimeout(function(){ message.innerHTML = '';}, 2000);
}