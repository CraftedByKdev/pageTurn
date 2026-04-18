// ================== ELEMENTS ==================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const bookGrid = document.getElementById('bookGrid');
const dynamicHeading = document.getElementById('dynamicHeading');

const modal = document.getElementById('bookModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-modal');

const aiInput = document.getElementById('aiInput');
const aiBtn = document.getElementById('aiBtn');

const AMAZON_AFFILIATE_TAG = "pageturn-21";


let debounceTimer;

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        handleCuratedSearch(searchInput.value);
    }, 300); // wait 300ms
});

function canCallAI() {
    const today = new Date().toDateString();
    const usage = JSON.parse(localStorage.getItem("ai_usage") || "{}");

    if (usage.date !== today) {
        localStorage.setItem("ai_usage", JSON.stringify({ date: today, count: 1 }));
        return true;
    }

    if (usage.count > 20) return false; // limit

    usage.count++;
    localStorage.setItem("ai_usage", JSON.stringify(usage));
    return true;
}
window.addEventListener("load", () => {
    setTimeout(() => {
        const splash = document.getElementById("splashScreen");
        splash.style.opacity = "0";
        splash.style.visibility = "hidden";
    }, 1500); // 2 sec
});
// ================== IMAGE SYSTEM ==================
function getBookImage(title) {
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg`;
}

// ================== CURATED DATA ==================


const curatedAI = {

fiction: [
 { title: "The Midnight Library", author: "Matt Haig", desc: "A woman explores alternate lives and regrets." },
 { title: "The Book Thief", author: "Markus Zusak", desc: "Hope and humanity during war." },
 { title: "Where the Crawdads Sing", author: "Delia Owens", desc: "Mystery + nature + loneliness." }
],

mystery: [
 { title: "Gone Girl", author: "Gillian Flynn", desc: "A twisted psychological mystery." },
 { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", desc: "Dark investigative thriller." },
 { title: "Big Little Lies", author: "Liane Moriarty", desc: "Secrets behind perfect lives." }
],

fantasy: [
 { title: "Harry Potter", author: "J.K. Rowling", desc: "Magic, friendship, destiny." },
 { title: "Six of Crows", author: "Leigh Bardugo", desc: "Fantasy heist adventure." },
 { title: "The Name of the Wind", author: "Patrick Rothfuss", desc: "Legend of a gifted magician." }
],

romance: [
 { title: "It Ends With Us", author: "Colleen Hoover", desc: "Emotional and intense love story." },
 { title: "The Love Hypothesis", author: "Ali Hazelwood", desc: "Fake dating romance." },
 { title: "People We Meet on Vacation", author: "Emily Henry", desc: "Friends-to-lovers journey." }
],

history: [
 { title: "Sapiens", author: "Yuval Noah Harari", desc: "History of humankind." },
 { title: "The Silk Roads", author: "Peter Frankopan", desc: "History through trade routes." },
 { title: "Guns, Germs, and Steel", author: "Jared Diamond", desc: "Why civilizations developed differently." }
],

science: [
 { title: "A Brief History of Time", author: "Stephen Hawking", desc: "Understanding the universe." },
 { title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", desc: "Space made simple." },
 { title: "The Selfish Gene", author: "Richard Dawkins", desc: "Evolution explained." }
],

"self-help": [
 { title: "Atomic Habits", author: "James Clear", desc: "Build good habits easily." },
 { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", desc: "Timeless success principles." },
 { title: "Think Like a Monk", author: "Jay Shetty", desc: "Train your mind for peace." }
],

technology: [
 { title: "The Lean Startup", author: "Eric Ries", desc: "Build startups smartly." },
 { title: "Hooked", author: "Nir Eyal", desc: "How products become addictive." },
 { title: "Zero to One", author: "Peter Thiel", desc: "Startup innovation mindset." }
],

finance: [
 { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", desc: "Financial mindset shift." },
 { title: "The Psychology of Money", author: "Morgan Housel", desc: "Behavior over money." },
 { title: "I Will Teach You to Be Rich", author: "Ramit Sethi", desc: "Practical finance guide." }
],

psychology: [
 { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", desc: "How your brain makes decisions." },
 { title: "Man's Search for Meaning", author: "Viktor Frankl", desc: "Purpose through suffering." },
 { title: "The Power of Habit", author: "Charles Duhigg", desc: "Science of habits." }
],

thriller: [
 { title: "The Silent Patient", author: "Alex Michaelides", desc: "A woman stops speaking after a crime." },
 { title: "Behind Closed Doors", author: "B.A. Paris", desc: "Dark psychological suspense." },
 { title: "Verity", author: "Colleen Hoover", desc: "Twisted thriller romance." }
],

horror: [
 { title: "It", author: "Stephen King", desc: "A terrifying entity haunts children." },
 { title: "The Haunting of Hill House", author: "Shirley Jackson", desc: "Classic haunted house story." },
 { title: "Bird Box", author: "Josh Malerman", desc: "Survival in unseen horror." }
],

"young-adult": [
 { title: "The Hunger Games", author: "Suzanne Collins", desc: "Fight for survival." },
 { title: "Divergent", author: "Veronica Roth", desc: "Dystopian identity struggle." },
 { title: "The Fault in Our Stars", author: "John Green", desc: "Love and loss." }
],

crime: [
 { title: "The Godfather", author: "Mario Puzo", desc: "Crime family saga." },
 { title: "In Cold Blood", author: "Truman Capote", desc: "True crime classic." },
 { title: "The Reversal", author: "Michael Connelly", desc: "Courtroom crime thriller." }
],

spirituality: [
 { title: "The Power of Now", author: "Eckhart Tolle", desc: "Live in the present moment." },
 { title: "The Alchemist", author: "Paulo Coelho", desc: "Follow your dreams." },
 { title: "Autobiography of a Yogi", author: "Paramahansa Yogananda", desc: "Spiritual awakening." }
],

adventure: [
 { title: "Into the Wild", author: "Jon Krakauer", desc: "Journey into nature." },
 { title: "Life of Pi", author: "Yann Martel", desc: "Survival at sea." },
 { title: "The Hobbit", author: "J.R.R. Tolkien", desc: "Epic adventure quest." }
],

productivity: [
 { title: "Deep Work", author: "Cal Newport", desc: "Focus in a distracted world." },
 { title: "Eat That Frog", author: "Brian Tracy", desc: "Beat procrastination." },
 { title: "Make Time", author: "Jake Knapp", desc: "Control your daily time." }
]

};

// ================== INITIAL LOAD ==================
window.onload = () => {
    renderCuratedBooks(curatedAI.fiction, "Top Picks For You ⭐");
    //fetchBooks("fiction bestseller", true); // append extra
};

// ================== SEARCH ==================
searchBtn.onclick = () => handleCuratedSearch(searchInput.value);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCuratedSearch();
});
// A unified function to handle all requests (Search, AI Box, and Genres)
async function handleCuratedSearch(query) {
    if (!query) return;

    dynamicHeading.textContent = `Curating results for "${query}"`;
    bookGrid.innerHTML = `<p class="status-msg"></p>`;

    // 🔥 STEP 1: Try local intelligence FIRST
    const localBooks = getAILevelBooks(query);

    if (localBooks) {
        renderCuratedBooks(localBooks, `Top Picks: ${query}`);
        return; // ❌ STOP — no API call
    }
    
    if (!canCallAI()) {
        fetchBooks(query, false);
        return; // ✅ now valid
    }
    // 🔥 STEP 2: Only then call AI
    const aiBooks = await getAIRecommendations(query);
    
    if (aiBooks && aiBooks.length > 0) {
     
    

        renderCuratedBooks(aiBooks, `Picks for "${query}"`);
    } else {
        fetchBooks(query, false);
    }
}

// Update your event listeners to use this unified function





// ================== GENRE TAG ==================
// ================== GENRE TAG ==================

document.addEventListener('click', async (e,query) => {
    if (e.target.classList.contains('tag') || e.target.classList.contains('extra-genre')) {
        e.stopPropagation();
        const genre = e.target.dataset.genre;
        if (!genre) return;

        dynamicHeading.textContent = `Curating the best ${genre} books...`;
        bookGrid.innerHTML = `<p class="status-msg">Finding top ${genre} picks...</p>`;

        // Trigger Gemini
        const aiBooks = await getAIRecommendations(`best ${genre} books`);
       
        if (aiBooks && aiBooks.length > 0) {
            // When rendering Gemini results for genres, it uses renderCuratedBooks
            // Ensure renderCuratedBooks (which we fixed earlier) is being called here
            
            let ranked = rankBooks(aiBooks, genre);
            ranked = diversify(ranked);

            renderCuratedBooks(ranked, `Top Picks: ${genre}`);
            
            // Append Google results at the end
           
        } else {
            // If AI fails, Google API is called
            fetchBooks(`subject:${genre}`, false);
        }
    }
});



// ================== AI INPUT ==================
aiBtn.onclick = () => handleCuratedSearch(aiInput.value);

aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAI();
});

async function handleAI() {
    const text = aiInput.value.trim();
    if (!text) return;

    bookGrid.innerHTML = `<p class="status-msg"></p>`;

    const aiBooks = await getAIRecommendations(text);
   
    if (aiBooks && aiBooks.length > 0) {
        // This ensures ONLY AI results are shown
        let ranked = rankBooks(aiBooks, text);
        ranked = diversify(ranked);
        renderCuratedBooks(ranked, `Picks for "${text}"`);
    } else {
        bookGrid.innerHTML = `<p class="status-msg">Couldn't find specific matches. Try searching by genre!</p>`;
    }
}

// ================== AI ENGINE ==================
function getAILevelBooks(query) {
    if (!query) return null;

    const q = query.toLowerCase().replace(/\s+/g, " ");

    // 🔥 PRIORITY MATCHING (more specific first)

    // DARK ROMANCE / DARK
    if (q.includes("dark")) return curatedAI.dark;

    // ROMANCE
    if (q.includes("romance") || q.includes("love") || q.includes("romcom") || q.includes("relationship")) {
        return curatedAI.romance;
    }

    // FANTASY
    if (q.includes("fantasy") || q.includes("magic") || q.includes("dragon")) {
        return curatedAI.fantasy;
    }

    // MYSTERY
    if (q.includes("mystery") || q.includes("detective") || q.includes("investigation")) {
        return curatedAI.mystery;
    }

    // THRILLER
    if (q.includes("thriller") || q.includes("suspense")) {
        return curatedAI.thriller;
    }

    // HORROR
    if (q.includes("horror") || q.includes("scary") || q.includes("ghost") || q.includes("haunted")) {
        return curatedAI.horror;
    }

    // CRIME
    if (q.includes("crime") || q.includes("mafia") || q.includes("murder")) {
        return curatedAI.crime;
    }

    // YOUNG ADULT
    if (q.includes("young") || q.includes("ya") || q.includes("teen")) {
        return curatedAI["young-adult"];
    }

    // ADVENTURE
    if (q.includes("adventure") || q.includes("journey") || q.includes("survival")) {
        return curatedAI.adventure;
    }

    // SPIRITUALITY
    if (
        q.includes("spiritual") ||
        q.includes("meditation") ||
        q.includes("mindfulness") ||
        q.includes("peace") ||
        q.includes("inner")
    ) {
        return curatedAI.spirituality;
    }

    // PSYCHOLOGY
    if (q.includes("psychology") || q.includes("mind") || q.includes("behavior")) {
        return curatedAI.psychology;
    }

    // BUSINESS / FINANCE
    if (
        q.includes("business") ||
        q.includes("startup") ||
        q.includes("money") ||
        q.includes("finance") ||
        q.includes("rich")
    ) {
        return curatedAI.finance;
    }

    // TECHNOLOGY
    if (q.includes("tech") || q.includes("technology") || q.includes("startup")) {
        return curatedAI.technology;
    }

    // SELF HELP / PRODUCTIVITY
    if (
        q.includes("habit") ||
        q.includes("discipline") ||
        q.includes("focus") ||
        q.includes("self help")
    ) {
        return curatedAI["self-help"];
    }

    // PRODUCTIVITY (separate boost)
    if (q.includes("productivity") || q.includes("time management")) {
        return curatedAI.productivity;
    }

    // HISTORY
    if (q.includes("history") || q.includes("war") || q.includes("civilization")) {
        return curatedAI.history;
    }

    // SCIENCE
    if (q.includes("science") || q.includes("physics") || q.includes("space")) {
        return curatedAI.science;
    }

    // SHORT BOOKS
    if (q.includes("short") || q.includes("quick read") || q.includes("under 200")) {
        return curatedAI.productivity; // best fallback
    }

    // MOOD BASED (LAST PRIORITY)
    if (q.includes("sad") || q.includes("low") || q.includes("depressed")) {
        return curatedAI.fiction;
    }

    // DEFAULT
    if (q.includes("fiction")) {
        return curatedAI.fiction;
    }

    return null;
}
// ================== FETCH GOOGLE API ==================

function getGoogleCacheKey(query) {
    return `google_cache_${query.toLowerCase()}`;
}

async function fetchBooks(query, append = false) {
    console.log(query);
     const key = getGoogleCacheKey(query);

    const cached = JSON.parse(localStorage.getItem(key));
    if (cached && (Date.now() - cached.time < 86400000)) {
        renderBooks(cached.data);
        return;
    }
    try {
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
        );

        const data = await res.json();

        if (!data.items) return;

            localStorage.setItem(key, JSON.stringify({
            data: data.items,
            time: Date.now()
        }));


       const books = data.items
    .filter(b => {
        const info = b.volumeInfo;

        if (!info.imageLinks || !info.authors) return false;

        const text = (info.title + " " + (info.categories || []).join(" ")).toLowerCase();

        // ❌ REMOVE ACADEMIC STUFF
        const badWords = [
            "report", "journal", "study", "research", "paper",
            "university", "thesis", "proceedings", "manual",
            "conference", "economic", "development", "policy","publication"
        ];

        const isBad = badWords.some(word => text.includes(word));

        // ❌ REMOVE VERY BORING BOOKS
        if (info.pageCount && info.pageCount < 80) return false;

        return !isBad;
    })
    .slice(0, 10);

        if (books.length === 0) return;

        if (append) {
            renderBooksAppend(books);
        } else {
            renderBooks(books);
        }

    } catch (err) {
        console.log("API failed");
    }
   
}

// ================== LINKS ==================
function getLinks(info) {
    const query = encodeURIComponent(info.title + " " + (info.authors?.[0] || ""));
    return {
        amazon: `https://www.amazon.in/s?k=${query}&tag=${AMAZON_AFFILIATE_TAG}`
    };
}

// ================== RENDER API ==================
function renderBooks(books) {
    bookGrid.innerHTML = "";
    renderBooksAppend(books);
}

// ================== APPEND BOOKS ==================
function renderBooksAppend(books) {
    books.forEach(book => {
        const info = book.volumeInfo;
        const img = info.imageLinks?.thumbnail.replace("http:", "https:") || getBookImage(info.title);
        const links = getLinks(info);

        const card = document.createElement('div');
        card.className = "book-card";
        card.innerHTML = `
            <div class="image-container">
                <img src="${img}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
            </div>
            <div class="card-content">
                <h3>${info.title}</h3>
                <p class="author-name">${info.authors[0]}</p>
                <div class="card-footer">
                    <a href="${links.amazon}" target="_blank" class="buy-now-btn" onclick="event.stopPropagation();">Buy</a>
                </div>
            </div>
        `;

        // 🔥 RESTORE MODAL CLICK
        card.onclick = () => showModal(info);

        bookGrid.appendChild(card);
    });
}

// ================== RENDER CURATED ==================
function renderCuratedBooks(books, title) {
    bookGrid.innerHTML = "";
    dynamicHeading.textContent = title;

    books.forEach((b, index) => {
        const img = getBookImage(b.title);
        const amazonQuery = encodeURIComponent(`${b.title} ${b.author}`);

        let badgeHTML = '';
        if (index === 0) badgeHTML = `<span class="badge badge-top">Top Pick</span>`;
        else if (index === 1) badgeHTML = `<span class="badge badge-trending">Trending</span>`;

        const rating = b.rating || (Math.random() * (4.9 - 4.3) + 4.3).toFixed(1);
        let reviews_new = b.reviews || Math.floor(Math.random() * 2000) + 150;
        if(reviews_new > 20000){
           reviews_new =  Math.floor(Math.random() * 2000)+ 150;
        }
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star ${i <= Math.round(rating) ? 'filled' : ''}">★</span>`;
        }

        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <div class="image-container">
                ${badgeHTML}
                <img src="${img}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
            </div>
            <div class="card-content">
                <h3>${b.title}</h3>
                <p class="author-name">${b.author}</p>
                <div class="rating-container">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-text">${rating} (${reviews_new.toLocaleString()} reviews)</span>
                </div>
                <p class="book-desc">${b.desc || "Click to read more about this selection."}</p>
                <div class="card-footer">
                    <a href="https://www.amazon.in/s?k=${amazonQuery}&tag=${AMAZON_AFFILIATE_TAG}" target="_blank" class="buy-now-btn" onclick="event.stopPropagation();">Buy Now</a>
                </div>
            </div>
        `;

        // 🔥 RESTORE MODAL CLICK
        card.onclick = () => {
            // We pass the data to the modal function
            showModal({
                title: b.title,
                authors: [b.author],
                description: b.desc,
                imageLinks: { thumbnail: img }
            });
        };

        bookGrid.appendChild(card);
    });
}

// ================== MODAL ==================
function showModal(info) {
    const img = info.imageLinks?.thumbnail
        ? info.imageLinks.thumbnail.replace("http:", "https:")
        : getBookImage(info.title);

    modalBody.innerHTML = `
        <img src="${img}">
        <div>
            <h2>${info.title}</h2>
            <h4>${info.authors?.join(", ") || "Unknown"}</h4>
            <p>${info.description || "No description available."}</p>
        </div>
    `;

    modal.style.display = "block";
}

// ================== CLOSE MODAL ==================
closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};

function getCacheKey(query) {
    return `ai_cache_${query.toLowerCase()}`;
}

async function getAIRecommendations(prompt) {
    const key = getCacheKey(prompt);

    // 🔥 STEP 1: Check cache
    const cached = JSON.parse(localStorage.getItem(key));

if (cached && (Date.now() - cached.time < 86400000)) {
    return cached.data;
}

    try {
        const res = await fetch("https://page-turn-is5z.vercel.app/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        if (Array.isArray(data)) {
            // 🔥 STEP 2: Save to cache
           localStorage.setItem(key, JSON.stringify({
    data,
    time: Date.now()
}));
        }

        return data;

    } catch (err) {
        console.error("AI Fetch Failed:", err);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const exploreBtn = document.getElementById("exploreMoreBtn");
    const extraGenres = document.querySelectorAll(".extra-genre");

    if (!exploreBtn) {
        console.error("Explore button not found");
        return;
    }

    let expanded = false;

    exploreBtn.addEventListener("click", () => {
        expanded = !expanded;

        extraGenres.forEach(tag => {
            tag.style.display = expanded ? "inline-block" : "none";
        });

        exploreBtn.textContent = expanded 
            ? "Show Less ↑" 
            : "Explore More ↓";
    });

});

function improveQuery(query) {
    query = query.toLowerCase();

    if (query.includes("spiritual")) return "best spiritual books mindfulness meditation";
    if (query.includes("psychology")) return "best psychology books popular";
    if (query.includes("business")) return "best business books startup success";
    if (query.includes("short")) return "short books under 200 pages popular";
    if (query.includes("sad")) return "uplifting fiction books emotional healing";

    return query ;
}
// ================== GENRE TAG FIX ==================
function rankBooks(books, query) {
    const q = query.toLowerCase();

    return books
        .map(book => {
            let score = 0;

            // 1. Rating boost (strong signal)
            score += (book.rating || 4) * 2;

            // 2. Reviews weight (log scale → prevents domination)
            const reviews = book.reviews || 100;
            score += Math.log10(reviews) * 2;

            // 3. Query relevance (VERY important)
            const text = (book.title + " " + book.desc).toLowerCase();
            if (text.includes(q)) score += 5;

            // 4. Freshness bonus (optional)
            if (book.year && book.year > 2015) score += 1;

            // 5. Penalize generic titles
            if (book.title.length < 5) score -= 1;

            if (userLikedSimilar(book)) score += 3;

            return { ...book, query };
        })
        .sort((a, b) => b.score - a.score);
}
function diversify(sortedBooks) {
    const seenAuthors = new Set();

    return sortedBooks.filter(book => {
        if (seenAuthors.has(book.author)) return false;
        seenAuthors.add(book.author);
        return true;
    });
}

function saveUserTaste(book) {
    let taste = JSON.parse(localStorage.getItem("taste") || "[]");
    taste.push(book.title);
    localStorage.setItem("taste", JSON.stringify(taste));
}

function userLikedSimilar(book) {
    const taste = JSON.parse(localStorage.getItem("taste") || "[]");
    return taste.some(t => book.title.toLowerCase().includes(t.toLowerCase()));
}
