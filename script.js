const input = document.getElementById('username');
const btn = document.getElementById('search-btn');
const container = document.getElementById('result-container');

btn.addEventListener('click', () => fetchUser(input.value));
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchUser(input.value); });

async function fetchUser(username) {
    if (!username) return;
    
    container.innerHTML = "<p>Loading...</p>";

    try {
        // 1. Fetch User
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("User Not Found");
        const userData = await userRes.json();

        // 2. Fetch Repos
        const repoRes = await fetch(userData.repos_url);
        const repoData = await repoRes.json();

        render(userData, repoData);
    } catch (err) {
        container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

function render(user, repos) {
    const date = new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    container.innerHTML = `
        <div class="profile-card">
            <img class="avatar" src="${user.avatar_url}" alt="avatar">
            <h2>${user.name || user.login}</h2>
            <p>Joined: ${date}</p>
            <p>${user.bio || 'This user has no bio'}</p>
            
            <div class="stats">
                <div><p>Repos</p><h3>${user.public_repos}</h3></div>
                <div><p>Followers</p><h3>${user.followers}</h3></div>
                <div><p>Following</p><h3>${user.following}</h3></div>
            </div>

            <h3>Top 5 Repos:</h3>
            <div id="repo-list"></div>
        </div>
    `;

    const repoList = document.getElementById('repo-list');
    repos.slice(0, 5).forEach(repo => {
        repoList.innerHTML += `<a class="repo-link" href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    });
}