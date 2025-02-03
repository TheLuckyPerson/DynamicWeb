import { toHtmlElement } from "./toHtmlElement.mjs"

const pElement = document.createElement("p");

const headerHtml = toHtmlElement(`
<h1 class="navbar hidden">

<button class="menu-btn">☰ Menu</button>
    <ul>
        <li class="navItem">Tyler Le</li>
        <li class="navItem"><a href="index.html">Home</a></li>
        <li class="navItem"><a href="hobbies.html">Hobby</a></li>
    </ul>
</h1>`)

/*window.addEventListener("load", () => { // Create a function on the fly
    let body = document.getElementsByTagName("body")[0]
    let newHeader = headerHtml
    
    // highlight page button
    const currentPage = window.location.pathname.split("/").pop();
    
    newHeader.querySelectorAll(".navbar a").forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref == currentPage || (currentPage === "" && linkHref == "index.html")) {
            link.parentElement.classList.add("active"); 
        }
    });

    body.prepend(headerHtml)
});*/