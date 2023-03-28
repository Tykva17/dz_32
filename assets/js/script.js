let reqUrlPost = 'https://jsonplaceholder.typicode.com/posts';
let reqUrlComment = 'https://jsonplaceholder.typicode.com/comments?postId=';
let searchBtn = document.getElementById('search_btn');
let searchInput = document.querySelector('input[name="post_id"]');
let errMessage = document.querySelector('.input_error');
let postItem = document.querySelector('.post_item');
let postTitle = document.querySelector('.post_item_title');
let postText = document.querySelector('.post_item_text');
let btnShowComments = document.querySelector('.show_comments');
let commentBox = document.querySelector('.comment_box')


function sendRequest(method, url, body = null){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if(xhr.status >= 400){
                reject(xhr.response)
            }else {
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send();
    })
}

searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    console.log(searchInput.value);
    if(0 < parseInt(searchInput.value) < 101){
        commentBox.innerHTML = '';
        let searchPostUrl = reqUrlPost + '/' + searchInput.value;
        sendRequest('GET', searchPostUrl)
            .then(data => {
                console.log(data);
                postItem.classList.add('show');
                errMessage.classList.remove('show');
                postTitle.innerText = data.title;
                postText.innerText = data.body;
                btnShowComments.setAttribute('data-postid', searchInput.value);
            })
            .catch(err => {
                console.log(err);
                errMessage.classList.add('show');
                errMessage.innerText = 'something wrong, please try again';
                postTitle.innerText = '';
                postText.innerText = '';
            })
    }else {
        errMessage.classList.add('show');
    }
})

btnShowComments.addEventListener('click', function (e){
    e.preventDefault();
    let searchCommentUrl = reqUrlComment + this.dataset.postid;
    sendRequest('GET', searchCommentUrl)
        .then(data => {
            commentBox.innerHTML = '';
            for(let i in data){
                let commentItem = document.createElement('div');
                commentBox.appendChild(commentItem);
                commentItem.innerHTML = `<div class="comment_item">` +
                    `<img src="assets/images/commItem.png" alt="#">` +
                    `<p class="comment_text">${data[i].name}</p>` +
                    `</div>`;
            }
        })
        .catch(err => {
            console.log(err);
            let commentText = document.createElement('p');
            commentBox.append(commentText)
            commentText.innerText = 'Sorry, somethings gone wrong'
        })
})