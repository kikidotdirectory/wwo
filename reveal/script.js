const lines = [
	"dear internet,",
	"i feel tired.",
	"i feel overwhelmed.",
	"i feel like the world is a mess.",
	"i wonder if i'm going making progress, and if i am, if i even want to be at the destination i thought i did.",
	"i wonder about if i can or will ever have any impact on the world.",
	"but the world still marches forward",
	"and i suppose i must keep pace.",
];
const links = [
	"https://drewdevault.com/weird-guys/",
	"https://git.sr.ht/~rabbits/fashware",
	"https://spikeartmagazine.com/articles/essay-all-images-are-quite-useless-now",
	"https://openpath.quest/2026/i-am-retiring-from-tech-to-live-offline/",
	"https://ky.fyi/posts/ai-burnout",
	"https://notebook.wesleyac.com/resonant-computing/",
	"https://simonwillison.net/2026/Feb/13/openai-mission-statement/",
	"https://pridesai.substack.com/p/my-ai-agent-is-making-me-lamer",
	"https://usa.streetsblog.org/2026/09/18/are-brain-rot-transit-ads-ruining-our-commutes",
	"https://brennan.day/normalized-fascism-in-open-source-12-million-given-to-dhh/",
	"https://drewdevault.com/blog/Cloudflare-and-fascists/",
	"https://medium.com/@violetblue/but-he-does-good-work-6710df9d9029",
	"https://blog.senko.net/code-was-never-the-hard-part-is-an-insult-to-all-programmers",
	"https://bell.bz/youll-miss-publishers-when-theyre-gone/?utm_source=the-index&utm_medium=newsletter",
	"https://zipcpu.com/blog/2026/07/18/ieee-ethics.html",
	"https://github.com/neovim/neovim.github.io/issues/501",
	"https://web.archive.org/web/20250306212807/https://blog.vaxry.net/resource/articleFDO/RHMails.pdf",
];

const lastLine = lines.length - 1;
const penultimateLine = lines.length - 2;

const thoughts = document.querySelector(".thoughts");
const button = document.querySelector(".button");

function render(index) {
	document.body.dataset.thought = index;
	document.body.toggleAttribute("data-done", index === lastLine);
	thoughts.textContent = lines[index];

	// spread the links evenly across the clicks so they're all shown by the last line
	const shown = Math.round((index / penultimateLine) * links.length);
	const rendered = document.querySelectorAll(".link");
	if (shown < rendered.length) rendered.forEach((link) => link.remove());
	for (let i = shown < rendered.length ? 0 : rendered.length; i < shown; i++) {
		renderLink(links[i]);
	}
}

function renderLink(href) {
	const link = document.createElement("a");
	link.className = "link";
	link.href = href;
	link.textContent = href;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	document.body.append(link);
	placeWithoutOverlap(link);
}

// try random spots until the element doesn't touch the text, the button, or another link
function placeWithoutOverlap(element, attempts = 200, gap = 8) {
	const obstacles = [thoughts, ...button.children, ...document.querySelectorAll(".link")]
		.filter((other) => other !== element)
		.map((other) => other.getBoundingClientRect())
		.filter((rect) => rect.width > 0 && rect.height > 0);

	const container = document.body.getBoundingClientRect();
	const { width, height } = element.getBoundingClientRect();

	for (let i = 0; i < attempts; i++) {
		const left = Math.random() * (container.width - width);
		const top = Math.random() * (container.height - height);
		const rect = {
			left: container.left + left,
			top: container.top + top,
			right: container.left + left + width,
			bottom: container.top + top + height,
		};

		element.style.left = `${left}px`;
		element.style.top = `${top}px`;

		if (!obstacles.some((other) => overlaps(rect, other, gap))) return true;
	}

	return false;
}

function overlaps(a, b, gap) {
	return (
		a.left < b.right + gap
		&& a.right > b.left - gap
		&& a.top < b.bottom + gap
		&& a.bottom > b.top - gap
	);
}

button.addEventListener("click", () => {
	const current = Number(document.body.dataset.thought);
	render(current === lastLine ? 0 : current + 1);
});

render(0);
