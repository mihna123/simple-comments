const form = document.createElement("form");

const pathParts = window.location.pathname.split("/");
const postName = pathParts[pathParts.length - 2];

const url = `http://localhost:3000/${postName}`;

form.classList.add("simple-comments-form");

form.innerHTML = `
    <label for="username">Username</label>
    <br/>
    <input required type="text" name="username"/>
    <br/>
    <label for="comment">Comment</label>
    <br/>
    <textarea required cols="50" name="comment"></textarea>
    <br/>
    <button type="submit">Post comment</button>
`;

function htmlToNode(html) {
	const template = document.createElement("template");
	template.innerHTML = html;
	return template.content.firstChild;
}

async function getComments() {
	const res = await fetch(url);
	const bodyHtml = await res.text();
	if (!bodyHtml) return;
	document.querySelector("ul.simple-comments")?.remove();
	form.after(htmlToNode(bodyHtml));
}

/**
 * @param {SubmitEvent} e
 * */
async function onSubmit(e) {
	e.preventDefault();
	try {
		await fetch(url, {
			method: "POST",
			body: new FormData(e.target),
		});
		form.querySelectorAll("input, textarea").forEach((i) => (i.value = ""));
		await getComments();
	} catch (e) {
		console.error(e);
	}
}

form.onsubmit = onSubmit;
document.currentScript.after(form);
getComments();
