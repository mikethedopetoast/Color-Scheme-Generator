const colorPicker = document.getElementById("color-picker")
const colorSchemeMode = document.getElementById("color-scheme-mode")
const colorSchemeBtn = document.getElementById("color-scheme-btn")
const mainEl = document.querySelector("main")
let schemes = ''

// Select a random number (from 0 - 16777215, hex: 000000 - ffffff)
// Assign it to the color picker (use .toString(16) converts to hex)
// Call generateColors() that handles the API and rendering on page.
// generateColors() also populates the drop down when it is called for the first time.

let randomColor = Math.floor(Math.random() * 16777215)
colorPicker.value = '#' + randomColor.toString(16)
generateColors()

// Button 'click' event handler to get color scheme.

colorSchemeBtn.addEventListener("click", () => {
    generateColors()
})

function generateColors() {
    fetch(`https://www.thecolorapi.com/scheme?hex=${colorPicker.value.slice(1)}&${colorSchemeMode.value}`)
        .then(res => res.json())
        .then(data => {
            renderColors(data.colors)
            // it triggers if drop down has yet to be populated
            if (!schemes) {
                schemes = data._links.schemes
                addSchemeModes()
            }
        })
}

// Dynamic drop down: populates the color scheme modes

function addSchemeModes() {
    Object.entries(schemes).forEach(
        ([name, value]) => {
            colorSchemeMode.add(
                new Option(name.charAt(0).toUpperCase() + name.slice(1), value)
            )
    })
}

// Renders the returned colors from API call on the page.

function renderColors(colorsArray) {
    
    mainEl.innerHTML = colorsArray.map(color => {
        return `
            <div
                class="color-column"
                style="background-color: ${color.hex.value}"
                onclick="copyToClipboard('${color.hex.value}')">
                <div id="color-name" class="light">${color.name.value}</div>
                <div
                    id="color-hex" class="light"
                    onclick="copyToClipboard('${color.hex.value}')">
                    ${color.hex.value}
                </div>
            </div>
        `
    }).join('')
}

// Copy color codes to clipboard

function copyToClipboard(str) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str)
            .then(() => {
                showSnackbar()
            }, error => {deprecatedCopyToClipboard(str)})
    } else { // When clipboard API not supported
        deprecatedCopyToClipboard(str)
    }
}

// When the Clipboard API is not supported or returned errors, it falls back to using execCommand, which is now deprecated.

function deprecatedCopyToClipboard(str) {
    const textarea = document.createElement("textarea")
    document.body.appendChild(textarea)
    textarea.value = str
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showSnackbar()
}

// copyToClipboard() will trigger the snackbar that lasts for 3 seconds.

function showSnackbar() {
    snackbar.className = "show"
    setTimeout(() => snackbar.className = "", 3000)
}

// Toggle the page between light and dark themes.

document.getElementById("checkbox").addEventListener('change', () => {
    const lightTheme = document.getElementsByClassName('light')
    for (let i = 0; i < lightTheme.length; i++) {
         lightTheme[i].classList.toggle('dark')
         }
})