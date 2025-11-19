function normalizeDomain(d) {
  if (!d) return "";
  return d.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

let savedDomains = [];

const domainA = document.getElementById('domainA');
const domainB = document.getElementById('domainB');
const saveBtn = document.getElementById('saveDomainsBtn');
const savedDisplay = document.getElementById('savedDomainsDisplay');
const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const errorBox = document.getElementById('errorBox');
const resultsBox = document.getElementById('results');
const mockMode = document.getElementById('mockMode');

saveBtn.onclick = () => {
  const a = normalizeDomain(domainA.value.trim());
  const b = normalizeDomain(domainB.value.trim());
  savedDomains = [a, b].filter(Boolean);

  savedDisplay.textContent = savedDomains.length 
    ? "Saved: " + savedDomains.join(" , ") 
    : "Saved: — no domains saved —";

  queryInput.placeholder = savedDomains.length
    ? `Search ${savedDomains.join(" + ")}`
    : "Enter domains first";

  resultsBox.innerHTML = `<div class='col-span-full bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-gray-500'>No results yet — perform a search.</div>`;
};

function renderResults(list) {
  if (!list.length) {
    resultsBox.innerHTML = `<div class='col-span-full bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-gray-500'>No results found.</div>`;
    return;
  }
  resultsBox.innerHTML = "";
  list.forEach((r) => {
    const card = document.createElement("article");
    card.className = "bg-white rounded-2xl shadow-sm overflow-hidden";

    card.innerHTML = `
      <div class='md:flex'>
        <div class='md:flex-1 p-4'>
          <a href='${r.url}' target='_blank' class='text-lg font-semibold hover:underline'>${r.title}</a>
          <div class='text-xs text-gray-500 mt-1'>${r.domain}</div>
          <p class='mt-2 text-gray-700'>${r.snippet}</p>
          <div class='mt-3 flex gap-2 items-center text-sm'>
            <span class='px-2 py-1 text-xs rounded bg-gray-100'>Source: ${r.domain}</span>
            <a href='${r.url}' target='_blank' class='text-blue-600'>Open</a>
          </div>
        </div>
        <div class='md:w-64 md:h-full bg-gray-100 flex items-center justify-center'>
          <img src='${r.image}' class='object-cover w-full h-40 md:h-full' />
        </div>
      </div>`;
    resultsBox.appendChild(card);
  });
}

searchBtn.onclick = async () => {
  errorBox.classList.add("hidden");
  const q = queryInput.value.trim();
  if (!q) {
    errorBox.textContent = "Please enter a search query.";
    errorBox.classList.remove("hidden");
    return;
  }
  if (savedDomains.length === 0) {
    errorBox.textContent = "Please save two domains first.";
    errorBox.classList.remove("hidden");
    return;
  }

  if (mockMode.checked) {
    const mock = savedDomains.flatMap((d) =>
      [1,2,3].map((n) => ({
        title: `Result ${n} from ${d}`,
        url: `https://${d}/post-${n}`,
        snippet: `Mocked snippet for '${q}' on ${d}.`,
        image: `https://picsum.photos/seed/${encodeURIComponent(d+n)}/400/240`,
        domain: d,
      }))
    );
    renderResults(mock);
    return;
  }

  try {
    const resp = await fetch('/api/search', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ domains: savedDomains, query: q }),
    });

    const data = await resp.json();
    renderResults(data.results || []);
  } catch (err) {
    errorBox.textContent = "Server error: " + err.message;
    errorBox.classList.remove("hidden");
  }
};

// Basic tests
console.log("Running tests...");
console.log("normalizeDomain test 1:", normalizeDomain("https://example.com/") === "example.com");
console.log("normalizeDomain test 2:", normalizeDomain("http://abc.org/path/") === "abc.org/path");
