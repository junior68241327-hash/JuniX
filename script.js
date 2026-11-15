const postInput = document.getElementById("postInput");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("posts");

// CREATE POST
postBtn.addEventListener("click", function () {
  const text = postInput.value.trim();

  if (text === "") {
    alert("Andika ubutumwa bwawe!");
    return;
  }

  const post = document.createElement("article");
  post.className = "post";

  const header = document.createElement("div");
  header.className = "post-header";

  const author = document.createElement("strong");
  author.textContent = "Junior";

  const globe = document.createElement("span");
  globe.textContent = "🌍";

  header.appendChild(author);
  header.appendChild(globe);

  const message = document.createElement("p");
  message.textContent = text;

  const actions = document.createElement("div");
  actions.className = "post-actions";

  // LIKE BUTTON
  const likeButton = document.createElement("button");
  let likes = 0;
  likeButton.textContent = "❤️ 0";

  likeButton.addEventListener("click", function () {
    likes++;
    likeButton.textContent = "❤️ " + likes;
  });

  // COMMENT BUTTON
  const commentButton = document.createElement("button");
  commentButton.textContent = "💬 Comment";

  commentButton.addEventListener("click", function () {
    const comment = prompt("Andika comment yawe:");

    if (comment && comment.trim() !== "") {
      const commentText = document.createElement("p");
      commentText.textContent = "💬 " + comment.trim();
      commentText.className = "comment";
      post.appendChild(commentText);
    }
  });

  // SHARE BUTTON
  const shareButton = document.createElement("button");
  shareButton.textContent = "📤 Share";

  shareButton.addEventListener("click", async function () {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "JuniX",
          text: text
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      alert("Sharing ntikurashobokera kuri browser yawe.");
    }
  });

  actions.appendChild(likeButton);
  actions.appendChild(commentButton);
  actions.appendChild(shareButton);

  post.appendChild(header);
  post.appendChild(message);
  post.appendChild(actions);

  postsContainer.prepend(post);

  postInput.value = "";
});

console.log("JuniX irakora! 🚀");
