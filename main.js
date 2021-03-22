class Comment {

    constructor(user, text, date) {
        let d = parseInt(date);

        this.id = d;
        this.date = new Date(d).toLocaleString();
        this.user = user;
        this.text = text;
    }

    toHTML() {
        return `
            <div class="comment__wrap">
                <div class="comment__username">${this.user}</div>
                <div class="comment__date">${this.date}</div>
                <div class="comment__text">${this.text}</div>
                <div class="comment__controls">
                    <button class="comment__edit" data-id="${this.id}">изм</button>
                    <button class="comment__delete" data-id="${this.id}">удл</button>                
                </div>                
            </div>
        `;
    }
}

class Storage {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    get() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || null;
    }

    set(value) {
        return localStorage.setItem(this.storageKey, JSON.stringify(value))
    }
}

class Comments extends Storage {

    sort = 'ASC';

    constructor(storageKey, containerEl) {
        super(storageKey);
        this.comments = this.get(storageKey) || JSON.parse('[{"id":1616374814591,"date":"3/22/2021, 5:00:14 AM","user":"Дениска","text":"Второй коммент"},{"id":1616374805265,"date":"3/22/2021, 5:00:05 AM","user":"Аноним","text":"Первый коммент"},{"id":1616374823676,"date":"3/22/2021, 5:00:23 AM","user":"Аноним","text":"Коммент три"}]');
        this.containerEl = containerEl;
    }

    render() {
        this.containerEl.innerHTML = "";

        this.sort === 'DESC' ? this.sortDesc() : this.sortAsc();

        for (const val of this.comments) {
            const comment = new Comment(
                val.user, val.text, val.id
            );
            this.insertComment(comment);
        }
    }

    insertComment(comment) {
        this.containerEl.insertAdjacentHTML('afterbegin', comment.toHTML());
    }

    addComment() {

        let text = textarea.value;
        let user = input.value || 'Аноним'

        if (text.length === 0) {
            return (alert("Введите текст комментария"));
        }

        button.disabled = true;

        const newComment = new Comment(user, text, Date.now());
        this.comments.push(newComment);

        this.set(this.comments);
        this.render();

        textarea.value = "";
        button.disabled = false;
    }

    delComment(el) {
        this.comments = this.comments.filter(function (elem) {
            return elem.id != el.dataset.id;
        });
        this.set(this.comments);
        el.parentElement.parentElement.remove();
    }

    editComment(el) {
        let text = el.parentElement.parentElement.querySelector('.comment__text');
        let newText = prompt("Изменить комментарий:", text.textContent);


        if(newText == null || newText === "") {
            //cancel prompt
        } else {

            this.comments.map(function(elem) {
                if(elem.id == el.dataset.id) {
                    elem.text = newText;
                }
                return elem;
            })

            text.textContent = newText;
            this.set(this.comments);
            this.render();
        }
    }

    sortDesc() {
        this.comments.sort((a, b) => a.id - b.id)
        this.sort = 'DESC';
    }

    sortAsc() {
        this.comments.sort((a, b) => b.id - a.id)
        this.sort = 'ASC';
    }
}

const input = document.querySelector('#comment_username');
const textarea = document.querySelector('#comment_text');
const button = document.querySelector('.news__comment_add button');

const comments = new Comments('comments_db', document.querySelector('.news__comments_list'));

button.addEventListener('click', function () {
    comments.addComment()
}, false);

document.addEventListener('click', function (e) {
    if (e.target && e.target.className === 'comment__delete') {
        comments.delComment(e.target);
    }

    if (e.target && e.target.className === 'comment__edit') {
        comments.editComment(e.target);
    }
});

comments.render();