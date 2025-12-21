const API_BASE = "https://dr69b524xb.execute-api.ap-southeast-1.amazonaws.com/dev"; 
// const API_BASE = "https://localhost:7241"; 

const form = document.getElementById("shortenForm");
const longUrlInput = document.getElementById("longUrl");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result"); 

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorEl.textContent = "";
    resultEl.innerHTML = ""; 

    const longUrl = longUrlInput.value.trim();
    if (!longUrl) return;

    try {
        const res = await fetch(`${API_BASE}/api/shortener/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                originalUrl: longUrl
            })
        });

        if (!res.ok) {
            throw new Error("Create failed");
        }

        const data = await res.json();

        resultEl.innerHTML = `
            <p>Short URL: 
                <a href="${data.shortUrl}" target="_blank">
                    ${data.shortUrl}
                </a>
            </p>
        `;

        longUrlInput.value = "";
    } catch (err) {
        errorEl.textContent = "Không thể rút gọn URL";
        console.error(err);
    }
});
