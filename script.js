const btnCriar = document.querySelector('#btnCriar');
const listaFilmes = document.querySelector('#listaFilmes');
const inputNome = document.querySelector('#inputNome');
const inputUsuario = document.querySelector('#inputUsuario');
const inputImagem = document.querySelector('#inputImagem');

btnCriar.addEventListener('click', function (event) {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const imagemUrl = inputImagem.value.trim();
    const usuario = inputUsuario.value.trim();

    if (!nome || !imagemUrl || !usuario) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!isValidUrl(imagemUrl)) {
        alert('Por favor, insira uma URL de imagem válida.');
        return;
    }

    const novoFilme = createMovieElement(nome, imagemUrl, usuario);
    listaFilmes.appendChild(novoFilme);

    // Limpa os campos após adicionar o novo filme à lista
    inputNome.value = '';
    inputImagem.value = '';
    inputUsuario.value = '';
});

function isValidUrl(url) {
    // Regex para validar URL de imagem
    const urlPattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gi;
    return urlPattern.test(url);
}

function createMovieElement(nome, imagemUrl, usuario) {
    const novoFilme = document.createElement('li');

    const filmeTexto = document.createElement('h2');
    filmeTexto.innerText = nome;
    novoFilme.appendChild(filmeTexto);

    const imagem = document.createElement('img');
    imagem.src = imagemUrl;
    imagem.style.maxWidth = '230px';
    imagem.style.height = '345px';
    imagem.style.border = '1px solid black';
    novoFilme.appendChild(imagem);

    const starsContainer = createStars();
    novoFilme.appendChild(starsContainer);

    const reviewTextarea = document.createElement('textarea');
    reviewTextarea.placeholder = 'Escreva sua resenha aqui...';
    novoFilme.appendChild(reviewTextarea);

    const btnSalvar = createButton('Salvar', () => {
        saveComment(reviewTextarea, novoFilme, usuario, getStarRating(starsContainer));
    });
    novoFilme.appendChild(btnSalvar);

    const btnEditar = createButton('Editar', () => {
        editComment(reviewTextarea, filmeTexto, novoFilme, starsContainer);
    });
    novoFilme.appendChild(btnEditar);

    return novoFilme;
}

function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars');
    let starRating = 0;
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = '&#9733;'; // Unicode character for star
        star.addEventListener('click', function () {
            starRating = i + 1;
            updateStars(starsContainer, i);
        });
        starsContainer.appendChild(star);
    }
    return starsContainer;
}

function getStarRating(starsContainer) {
    const stars = starsContainer.querySelectorAll('.star');
    let starRating = 0;
    stars.forEach((star, index) => {
        if (star.classList.contains('active')) {
            starRating = index + 1;
        }
    });
    return starRating;
}

function updateStars(starsContainer, selectedIndex) {
    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index <= selectedIndex);
    });
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', onClick);
    button.classList.add('edit-button');
    button.style.marginTop = '10px';
    return button;
}

function saveComment(reviewTextarea, novoFilme, nomeUsuario, starRating) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');

    const commentHeader = document.createElement('div');
    commentHeader.classList.add('comment-header');

    const userNameSpan = document.createElement('span');
    const [primeiroNome, ...sobrenomeArray] = nomeUsuario.toLowerCase().split(' ');
    const sobrenome = sobrenomeArray.join('');
    userNameSpan.innerText = `@${primeiroNome}${sobrenome}`;
    commentHeader.appendChild(userNameSpan);

    const editButton = createButton('Editar', () => {
        editComment(reviewTextarea, commentText, commentDiv, starsDisplay);
    });
    commentHeader.appendChild(editButton);

    const commentText = document.createElement('p');
    commentText.innerText = reviewTextarea.value;

    const commentFooter = document.createElement('div');
    commentFooter.classList.add('comment-footer');

    const starsDisplay = document.createElement('span');
    starsDisplay.classList.add('stars-display');
    starsDisplay.innerText = `⭐ ${starRating} estrelas`;

    commentFooter.appendChild(starsDisplay);

    commentDiv.appendChild(commentHeader);
    commentDiv.appendChild(commentText);
    commentDiv.appendChild(commentFooter);
    novoFilme.appendChild(commentDiv);

    reviewTextarea.value = '';
    showPopup();
}

function editComment(reviewTextarea, commentText, commentDiv, starsDisplay) {
    // Salva o texto original do comentário para uso posterior
    const originalText = commentText.innerText;

    // Define o texto do textarea como o texto original e coloca o foco nele
    reviewTextarea.value = originalText;
    reviewTextarea.focus();

    const saveButton = createButton('Salvar Edição', () => {
        // Chama a função para atualizar o texto do comentário
        updateCommentText(commentText, reviewTextarea, originalText);
    });
    saveButton.classList.add('save-button');

    // Remove qualquer botão "Salvar Edição" anterior
    const existingSaveButton = commentDiv.querySelector('.save-button');
    if (existingSaveButton) {
        existingSaveButton.remove();
    }

    commentDiv.appendChild(saveButton);
}

function updateCommentText(commentText, reviewTextarea, originalText) {
    // Atualiza o texto do comentário com o texto do textarea
    commentText.innerText = reviewTextarea.value;

    // Remove o textarea e exibe novamente o texto do comentário
    reviewTextarea.remove();
    commentText.style.display = 'block';

    // Remove o botão "Salvar Edição"
    const saveButton = commentText.parentElement.querySelector('.save-button');
    if (saveButton) {
        saveButton.remove();
    }
}

function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Remover a classe após 3 segundos (3000 milissegundos)
}