



function createCard(book) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<div>
                            <a href="${book.pdf_url}" target="_blank">
                                <img src=".${book.thumbnail_url}" alt="pfe icon" class="offer-img">
                            </a>
                        </div>
                        <div>
                            <div>
                                <p class="company-name">${book.company}</p>
                                <p class="tags"> <b>Tags:</b>${book.Tags}</p>
                                <p class="deadline"><b>Deadline :</b>${book.deadline}</p>
                            </div>
                            <div><i class="fa-solid fa-download downloadURL" href="${book.pdf_url}"></i>
                                <i class="fa-brands fa-linkedin linkedinURL" href="${book.linked_url}"></i>
                            </div>
                        </div>`;
    document.getElementById('book-container').appendChild(card);
};

for (const book of books) {
    createCard(book);
}