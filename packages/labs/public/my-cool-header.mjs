import { attachShadow } from "./utils.mjs";

const TEMPLATE = document.createElement("template");

TEMPLATE.innerHTML = 
`<link href="styles.css" rel="stylesheet" />
<header>
    <div class="dark-mode-toggle">
        <label>
            <input type="checkbox" autocomplete="off" />
            Dark mode
        </label>
    </div>

    <h1>
        <button class="menu-btn">☰ Menu</button>

        <ul class="navbar hidden">
            <li class="navItem">Tyler Le</li>
            <li class="navItem"><a href="index.html">Home</a></li>
            <li class="navItem"><a href="hobbies.html">Hobby</a></li>
        </ul>
    </h1>
</header>`;

const currentPage = window.location.pathname.split("/").pop();
    
class MyCoolHeader extends HTMLElement {
    connectedCallback() {
        const shadowRoot = attachShadow(this, TEMPLATE);

        const menuBtn = this.shadowRoot.querySelector(".menu-btn");
        const nav = this.shadowRoot.querySelector(".navbar");

        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("hidden");
        });

        document.addEventListener("click", (event) => {
            if (this != event.target) {
                nav.classList.add("hidden");
            }
        });

        this._addActiveClass();

        // dark mode event
        this._setupDarkMode()
    }

    _addActiveClass() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        
        const navLinks = this.shadowRoot.querySelectorAll(".navbar a");
        navLinks.forEach(link => {
            const linkHref = link.getAttribute("href");
            if (linkHref === currentPage) {
                link.parentElement.classList.add("active");
            }
        });
    }

    // darkmode toggle
    _setupDarkMode() {
        const darkModeCheckbox = this.shadowRoot.querySelector("input[type='checkbox']");
        
        const isDarkMode = localStorage.getItem("dark-mode") === "true";
        document.body.classList.toggle("dark-mode", isDarkMode);
        darkModeCheckbox.checked = isDarkMode;

        darkModeCheckbox.addEventListener("change", (event) => {
            const isChecked = event.target.checked;
            document.body.classList.toggle("dark-mode", isChecked);
            localStorage.setItem("dark-mode", isChecked);
        });
    }
}

customElements.define("my-cool-header", MyCoolHeader);