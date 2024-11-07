



function createCard(book) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `  <div class="offer-img-container">
                            <a ${(book.pdf_url == "") ? "" : "href='"}${book.pdf_url}' target="_blank">
                                <img src="${book.thumbnail_url}" alt="pfe icon" class="offer-img" loading="lazy">
                            </a>
                        </div>
                        <div class="offer-info">
                            <div>
                                <p class="company-name ${(book.company == "") ? "hidden" : ""}"><b>${book.company}</b></p>
                                <p class="tags ${(book.Tags == "") ? "hidden" : ""}"> <b>Tags:</b>${book.Tags}</p>
                                <p class="deadline ${(book.deadline == "") ? "hidden" : ""}"><b>Deadline :</b>${book.deadline}</p>
                            </div>
                            <div>
                                <a href="${book.pdf_url}" target="_blank">
                                    <i class="fa-solid fa-download downloadURL  ${(book.pdf_url == "") ? "hidden" : ""}" href="${book.pdf_url}"></i>
                                </a>
                                <a href="${book.linked_url}" target="_blank">
                                    <i class="fa-brands fa-linkedin linkedinURL ${(book.linked_url == "") ? "hidden" : ""}" href="${book.linked_url}"></i>
                                </a>
                            </div>
                        </div>`;
    document.getElementById('book-container').appendChild(card);
};

for (const book of books) {
    createCard(book);
}

setInterval(function () {
    const background = document.getElementById('background');
    //background follow mouse and update top and left
    background.style.top = window.mouseY;
    background.style.left = window.mouseX;

}, 1);

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    const background = document.getElementById('background');
    var eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // Use event.pageX / event.pageY here
    window.mouseY = event.pageY + 'px';
    window.mouseX = event.pageX + 'px';
}

function searchTag() {
    input = document.getElementById('tag-input').value;
    filtered.forEach((element, i)=> {
        if (element != 0) {
        tags = element.getElementsByClassName('tags');
        if (tags.length > 0) {
            tags = tags[0].innerText.toLowerCase();
            if (!tags.includes(input.toLowerCase())) {
                filtered[i]=0;
            }
        }}
    });
}


function searchCompany() {
    input = document.getElementById('company-input').value;
    filtered.forEach((element,i) => {
        if (element != 0) {
        comps = element.getElementsByClassName('company-name');
        if (tags.length > 0) {
            comps = comps[0].innerText.toLowerCase();
            if (!comps.includes(input.toLowerCase())) {
                filtered[i]=0;
            }
        }}
    });
}
filtered = [];
function filter(){
    filtered = Array.from(document.querySelectorAll('.card'));
    filtered.forEach(element => {
        element.style.display = 'none';
    });
    searchTag();
    searchCompany();
    console.log(filtered);
    filtered.forEach(element => {
        if (element != 0) element.style.display = 'block';
    });

}
