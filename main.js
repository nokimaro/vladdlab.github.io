const textarea = document.querySelector('.news__comment_add textarea');
const button = document.querySelector('.news__comment_add button');
const videoel = document.querySelector('video');
const comments = JSON.parse(localStorage.getItem('comments')) || [];

const insertComment = function(text) {
    const el = document.createElement('p');
    el.className = 'news__brief';
    el.textContent = text;

    videoel.after(el);
}

button.addEventListener('click', function() {
    let text = textarea.value;

    if(text.length === 0) {
        return(alert("Введите текст комментария"));
    }

    button.disabled = true;

    insertComment(text);

    comments.push(text);
    localStorage.setItem('comments', JSON.stringify(comments));

    textarea.value = "";
    button.disabled = false;
})

for(const text of comments) {
    insertComment(text);
}