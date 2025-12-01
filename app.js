(function(){
	let API_BASE = (window.API_BASE || 'http://localhost:4000/api').replace(/\/$/, '');

	function getToken(){
		try { return localStorage.getItem('alumni_token'); } catch { return null; }
	}
	function setToken(t){
		try { localStorage.setItem('alumni_token', t); } catch {}
	}
	function clearToken(){
		try { localStorage.removeItem('alumni_token'); } catch {}
	}

	async function apiFetch(path, options={}){
		const headers = { ...(options.headers || {}) };
		const isFormData = (typeof FormData !== 'undefined') && options.body instanceof FormData;
		if (isFormData && headers['Content-Type']) {
			delete headers['Content-Type'];
		}
		if (!isFormData && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}
		const token = getToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
		const url = `${API_BASE}${path}`;
		
		try {
			const res = await fetch(url, { ...options, headers });
			
			if (!res.ok) {
				// If token is invalid, clear it and redirect to login
				if (res.status === 401 && token) {
					console.log('Token expired or invalid, clearing token');
					clearToken();
					if (!path.includes('/auth/login') && !path.includes('/auth/register')) {
						window.location.href = '/login.html';
						return;
					}
				}
				let msg = 'Request failed';
				try { const data = await res.json(); msg = data.message || JSON.stringify(data); } catch {}
				throw new Error(`${url} -> ${msg}`);
			}
			return res.json();
		} catch (e) {
			// fallback to 127.0.0.1 if localhost fails (DNS/loopback policy/mixed content)
			if (API_BASE.startsWith('http://localhost')) {
				const fallback = API_BASE.replace('http://localhost', 'http://127.0.0.1');
				try {
					const res2 = await fetch(`${fallback}${path}`, { ...options, headers });
					if (!res2.ok) {
						// If token is invalid, clear it and redirect to login
					if (res2.status === 401 && token) {
						console.log('Token expired or invalid, clearing token');
						clearToken();
						if (!path.includes('/auth/login') && !path.includes('/auth/register')) {
							window.location.href = '/login.html';
							return;
							}
						}
						let msg2 = 'Request failed';
						try { const data2 = await res2.json(); msg2 = data2.message || JSON.stringify(data2); } catch {}
						throw new Error(msg2);
					}
					API_BASE = fallback;
						return res2.json();
				} catch (e2) {
					throw new Error(`${url} -> ${e2.message || e.message || 'Failed to fetch'}`);
				}
			}
			throw new Error(`${url} -> ${e.message || 'Failed to fetch'}`);
		}
	}

	function requireAuth(){
		const token = getToken();
		if (!token) {
			window.location.href = '/login.html';
			return false;
		}
		return true;
	}

	function logout(){
		clearToken();
		window.location.href = '/index.html';
	}

	// Navigation functions
	async function updateNavigation() {
		const token = getToken();
		const navButtons = document.querySelector('.nav-buttons');
		
		if (!navButtons) return;
		
		if (token) {
			try {
				const userData = await apiFetch('/auth/me');
				const user = userData.user;
				
				// Create user dropdown
				let adminBtn = '';
				if (user.roles && user.roles.includes('admin')) {
					adminBtn = `<li><a class="dropdown-item" href="/admin.html"><i class="fas fa-user-shield me-2"></i>Admin Panel</a></li><li><hr class="dropdown-divider"></li>`;
				}
				
				navButtons.innerHTML = `
					<div class="dropdown">
						<button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
							<img src="${user.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${API_BASE.replace('/api', '')}${user.avatarUrl}`) : '/uploads/default-avatar.jpg'}" alt="Avatar" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTMiIHI9IjUiIGZpbGw9IiM5QjlCOUIiLz4KPHBhdGggZD0iTTYgMjZDNiAyMy43OTA5IDguNzkwODYgMjIgMTIgMjJIMjBDMjMuMjA5MSAyMiAyNiAyMy43OTA5IDI2IDI2VjI4SDZWMjZaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPg=='">
							<span>${user.firstName} ${user.lastName}</span>
						</button>
						<ul class="dropdown-menu dropdown-menu-end">
							<li><a class="dropdown-item" href="/dashboard.html"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
							${adminBtn}
							<li><a class="dropdown-item" href="#" data-action="logout"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
						</ul>
					</div>
				`;

				const logoutLink = navButtons.querySelector('[data-action="logout"]');
				if (logoutLink) {
					logoutLink.addEventListener('click', (event) => {
						event.preventDefault();
						logout();
					});
				}
			} catch (error) {
				console.error('Failed to load user data:', error);
				// If user data fails to load, show login/register buttons
				navButtons.innerHTML = `
					<a href="login.html" class="btn btn-outline-primary me-2">Login</a>
					<a href="register.html" class="btn btn-primary">Register</a>
				`;
			}
		} else {
			// Show login/register buttons when not logged in
			navButtons.innerHTML = `
				<a href="login.html" class="btn btn-outline-primary me-2">Login</a>
				<a href="register.html" class="btn btn-primary">Register</a>
			`;
		}
	}

	// Initialize navigation on page load
	document.addEventListener('DOMContentLoaded', updateNavigation);

	// Function to refresh navigation after avatar update
async function refreshNavigation() {
	await updateNavigation();
}

window.AlumniApp = { API_BASE, apiFetch, getToken, setToken, clearToken, requireAuth, logout, updateNavigation, refreshNavigation };
})();