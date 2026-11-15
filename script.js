const mediaInput = document.getElementById("mediaInput");
const mediaPreview = document.getElementById("mediaPreview");
const postBtn = document.getElementById("postBtn");
const feed = document.getElementById("feed");

let selectedMedia = null;

// Load saved posts
let posts = JSON.parse(localStorage.getItem("junix_posts")) || [];

// Preview selected media
mediaInput.addEventListener("change", function () {
    const file = this.files[0];

    mediaPreview.innerHTML = "";
    selectedMedia = null;

    if (!file) return;

    if (!file.type.startsWith("image/") &&
        !file.type.startsWith("video/")) {
        alert("Hitamo ifoto cyangwa video gusa!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        selectedMedia = {
            type: file.type.startsWith("video/") ? "video" : "image",
            src: e.target.result
        };

        const element = document.createElement(
            selectedMedia.type === "video" ? "video" : "img"
        );

        element.src = selectedMedia.src;

        if (selectedMedia.type === "video") {
            element.controls = true;
        }

        mediaPreview.appendChild(element);
    };

    reader.readAsDataURL(file);
});

// Create new post
postBtn.addEventListener("click", function () {
    const text = document.querySelector("textarea").value.trim();

    if (!text && !selectedMedia) {
        alert("Andika ubutumwa cyangwa uhitemo media!");
        return;
    }

    const post = {
        id: Date.now(),
        username: "JuniX User",
        text: text,
        media: selectedMedia,
        likes: 0,
        liked: false,
        comments: []
    };

    posts.unshift(post);

    savePosts();
    renderPosts();

    document.querySelector("textarea").value = "";
    mediaInput.value = "";
    mediaPreview.innerHTML = "";
    selectedMedia = null;
});

// Save posts
function savePosts() {
    try {
        localStorage.setItem("junix_posts", JSON.stringify(posts));
    } catch (error) {
        alert("Ububiko bwuzuye. Gerageza gukoresha video ntoya.");
    }
}

// Display posts
function renderPosts() {
    if (!feed) return;

    feed.innerHTML = "";

    posts.forEach(post => {
        const article = document.createElement("div");
        article.className = "post";

        const header = document.createElement("div");
        header.className = "post-header";

        const username = document.createElement("strong");
        username.textContent = "@" + post.username;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "⋮";
        deleteBtn.onclick = () => deletePost(post.id);

        header.append(username, deleteBtn);
        article.appendChild(header);

        if (post.text) {
            const paragraph = document.createElement("p");
            paragraph.textContent = post.text;
            article.appendChild(paragraph);
        }

        if (post.media) {
            const media = document.createElement(
                post.media.type === "video" ? "video" : "img"
            );

            media.src = post.media.src;

            if (post.media.type === "video") {
                media.controls = true;
                media.loop = true;
                media.playsInline = true;
            }

            article.appendChild(media);
        }

        const actions = document.createElement("div");
        actions.className = "post-actions";

        const likeBtn = document.createElement("button");
        likeBtn.textContent =
            (post.liked ? "❤️ " : "🤍 ") + post.likes;

        likeBtn.onclick = () => toggleLike(post.id);

        const commentBtn = document.createElement("button");
        commentBtn.textContent =
            "💬 Comments (" + post.comments.length + ")";

        commentBtn.onclick = () => addComment(post.id);

        const shareBtn = document.createElement("button");
        shareBtn.textContent = "↗ Share";
        shareBtn.onclick = () => sharePost(post);

        actions.append(likeBtn, commentBtn, shareBtn);
        article.appendChild(actions);

        // Display comments
        post.comments.forEach(comment => {
            const commentElement = document.createElement("p");
            commentElement.textContent = "💬 " + comment;
            article.appendChild(commentElement);
        });

        feed.appendChild(article);
    });
}

// Like and unlike
function toggleLike(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    savePosts();
    renderPosts();
}

// Add comment
function addComment(id) {
    const comment = prompt("Andika comment yawe:");

    if (!comment || !comment.trim()) return;

    const post = posts.find(p => p.id === id);
    if (!post) return;

    post.comments.push(comment.trim());

    savePosts();
    renderPosts();
}

// Share post
async function sharePost(post) {
    const shareData = {
        title: "JuniX",
        text: post.text || "Reba iyi post kuri JuniX!",
        url: location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(
                shareData.text + " " + shareData.url
            );
            alert("Link yakoporowe!");
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            alert("Ntibyashobotse gusangiza iyi post.");
        }
    }
}

// Delete post
function deletePost(id) {
    if (!confirm("Urashaka gusiba iyi post?")) return;

    posts = posts.filter(post => post.id !== id);

    savePosts();
    renderPosts();
}

// Start JuniX
renderPosts();
