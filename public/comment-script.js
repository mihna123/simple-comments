const form = document.createElement("form");

const pathParts = window.location.pathname.split("/");
const postName = pathParts[pathParts.length - 2];

const url = `http://localhost:3000/${postName}`;

form.classList.add("simple-comments-form");

form.innerHTML = `
    <label for="username">Username</label>
    <input type="text" name="username"/>
    <label for="comment">Comment</label>
    <input type="text" name="comment"/>
    <button type="submit">Post comment</button>
`;

/**
 * @param {SubmitEvent} e
 * */
async function onSubmit(e) {
	e.preventDefault();
	const res = await fetch(url, {
		method: "POST",
		body: new FormData(e.target),
	});
	form.querySelectorAll("input").forEach((i) => (i.value = ""));
}

form.onsubmit = onSubmit;

document.currentScript.after(form);
