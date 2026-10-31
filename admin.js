/* ==========================================================================
   OUTR LAB COVER GENERATOR - ADMIN PORTAL JAVASCRIPT ENGINE
   Authentication, Telemetry, Institutional Profile & Academic Configuration
   ========================================================================== */

function initAdminPortal() {
    // ==========================================================================
    // Constants & Default Configuration
    // ==========================================================================
    const AUTH_SALT = 'outr_lab_cover_salt_2025';
    const DEFAULT_HASH = 'e4f9b87301c65af6ea40bc89991c1bd1093df8ff172855ff78ffd9c0d05da087'; // 'outr@admin2025'
    const STORAGE_KEY_CONFIG = 'outr_admin_config';
    const STORAGE_KEY_AUTH = 'outr_admin_auth';
    const STORAGE_KEY_STATS = 'outr_admin_stats';
    const STORAGE_KEY_LOGS = 'outr_admin_logs';
    const STORAGE_KEY_LOCKOUT = 'outr_admin_lockout';
    const SESSION_KEY = 'outr_admin_session';

    const DEFAULT_CONFIG = {
        universityName: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
        campusAddress: 'Techno Campus, Ghatikia, Bhubaneswar, 751029',
        degreePrefix: 'B.TECH',
        defaultDocType: 'LAB RECORD',
        batchCredit: 'BIOTECHNOLOGY 2025–29',
        sessionTimeoutMinutes: 30,
        docTypes: [
            'LAB RECORD',
            'ASSIGNMENT',
            'PROJECT REPORT',
            'SEMINAR REPORT',
            'INTERNSHIP REPORT'
        ],
        semesters: [
            '1ST SEMESTER',
            '2ND SEMESTER',
            '3RD SEMESTER',
            '4TH SEMESTER',
            '5TH SEMESTER',
            '6TH SEMESTER',
            '7TH SEMESTER',
            '8TH SEMESTER'
        ],
        departments: [
            {
                code: 'BT',
                name: 'BIOTECHNOLOGY',
                branch: 'BIOTECHNOLOGY',
                labs: ['Biochemistry Lab', 'Microbiology Lab', 'Bioprocess Engineering Lab', 'Molecular Biology Lab', 'Immunotechnology Lab']
            },
            {
                code: 'CSE',
                name: 'COMPUTER SCIENCE & ENGINEERING',
                branch: 'COMPUTER SCIENCE & ENGINEERING',
                labs: ['Data Structures Lab', 'Design & Analysis of Algorithms Lab', 'Database Management Systems Lab', 'Operating Systems Lab', 'Computer Networks Lab']
            },
            {
                code: 'IT',
                name: 'INFORMATION TECHNOLOGY',
                branch: 'INFORMATION TECHNOLOGY',
                labs: ['Object Oriented Programming Lab', 'Web Technologies Lab', 'Software Engineering Lab', 'Cloud Computing Lab']
            },
            {
                code: 'MECH',
                name: 'MECHANICAL ENGINEERING',
                branch: 'MECHANICAL ENGINEERING',
                labs: ['Fluid Mechanics Lab', 'Heat Transfer Lab', 'Manufacturing Process Lab', 'Kinematics & Dynamics Lab']
            },
            {
                code: 'EE',
                name: 'ELECTRICAL ENGINEERING',
                branch: 'ELECTRICAL ENGINEERING',
                labs: ['Electrical Machines Lab', 'Power Electronics Lab', 'Control Systems Lab', 'Circuits & Networks Lab']
            },
            {
                code: 'CIVIL',
                name: 'CIVIL ENGINEERING',
                branch: 'CIVIL ENGINEERING',
                labs: ['Surveying Lab', 'Geotechnical Engineering Lab', 'Concrete Technology Lab', 'Hydraulics & Water Resources Lab']
            },
            {
                code: 'EIE',
                name: 'ELECTRONICS & INSTRUMENTATION ENGINEERING',
                branch: 'ELECTRONICS & INSTRUMENTATION ENGINEERING',
                labs: ['Transducers & Sensors Lab', 'Industrial Instrumentation Lab', 'Digital Signal Processing Lab', 'Analog Electronics Lab']
            },
            {
                code: 'TE',
                name: 'TEXTILE ENGINEERING',
                branch: 'TEXTILE ENGINEERING',
                labs: ['Yarn Manufacturing Lab', 'Fabric Manufacturing Lab', 'Textile Chemical Processing Lab', 'Fabric Testing Lab']
            }
        ]
    };

    // ==========================================================================
    // State Management
    // ==========================================================================
    let currentConfig = loadConfig();
    let isLockedOut = false;
    let lockoutTimerInterval = null;

    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...DEFAULT_CONFIG, ...parsed };
            }
        } catch {
            // fallback
        }
        return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }

    function saveConfig(config) {
        currentConfig = config;
        try {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
        } catch (e) {
            console.error('Failed to save config:', e);
        }
    }

    function getStats() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_STATS);
            if (raw) return JSON.parse(raw);
        } catch {
            // fallback
        }
        return { totalPdf: 0, totalPng: 0, totalCovers: 0 };
    }

    function addAuditLog(event, user = 'admin', status = 'Success') {
        try {
            let logs = [];
            const raw = localStorage.getItem(STORAGE_KEY_LOGS);
            if (raw) logs = JSON.parse(raw);
            const now = new Date();
            const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            logs.unshift({ timestamp: timeStr, event, user, status });
            if (logs.length > 50) logs = logs.slice(0, 50);
            localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to write audit log:', e);
        }
    }

    function getAuditLogs() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_LOGS);
            if (raw) return JSON.parse(raw);
        } catch {
            // fallback
        }
        return [];
    }

    // ==========================================================================
    // Cryptography & Password Hashing (WebCrypto with Pure JS Fallback)
    // ==========================================================================
    function pureJsSha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        let i, j;
        let result = '';
        const words = [];
        const asciiBitLength = ascii.length * 8;
        let hash = [];
        const k = [];
        let primeCounter = 0;

        const isPrime = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isPrime[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isPrime[i] = true;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += '\x80';
        while (ascii.length % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii.length; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return '';
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words.length] = ((asciiBitLength / maxWord) | 0);
        words[words.length] = (asciiBitLength);

        for (j = 0; j < words.length;) {
            const w = words.slice(j, j += 16);
            const oldHash = hash.slice(0);
            for (i = 0; i < 64; i++) {
                const w15 = w[i - 15], w2 = w[i - 2];
                const a = hash[0], e = hash[4];
                const temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0
                    );
                const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
                hash.pop();
            }
            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (let b = 3; b >= 0; b--) {
                const byte = (hash[i] >> (8 * b)) & 255;
                result += (byte < 16 ? '0' : '') + byte.toString(16);
            }
        }
        return result;
    }

    async function hashPassword(plainText) {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(AUTH_SALT + plainText);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch {
                // fallback to pure JS
            }
        }
        return pureJsSha256(AUTH_SALT + plainText);
    }

    function getStoredPasswordHash() {
        try {
            return localStorage.getItem(STORAGE_KEY_AUTH) || DEFAULT_HASH;
        } catch {
            return DEFAULT_HASH;
        }
    }

    function setStoredPasswordHash(hash) {
        try {
            localStorage.setItem(STORAGE_KEY_AUTH, hash);
        } catch {}
    }

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const authScreen = document.getElementById('authScreen');
    const adminConsoleScreen = document.getElementById('adminConsoleScreen');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const passwordEyeIcon = document.getElementById('passwordEyeIcon');
    const authAlert = document.getElementById('authAlert');
    const authAlertText = document.getElementById('authAlertText');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Navigation Tabs
    const navItems = document.querySelectorAll('.nav-item');
    const panelSections = document.querySelectorAll('.panel-section');

    // Toast & Modals
    const adminToast = document.getElementById('adminToast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');
    const deptModal = document.getElementById('deptModal');
    const deptForm = document.getElementById('deptForm');
    const deptModalTitle = document.getElementById('deptModalTitle');
    const deptIndexInput = document.getElementById('deptIndexInput');
    const deptCodeInput = document.getElementById('deptCodeInput');
    const deptNameInput = document.getElementById('deptNameInput');
    const deptBranchInput = document.getElementById('deptBranchInput');
    const deptLabsInput = document.getElementById('deptLabsInput');
    const addDeptModalBtn = document.getElementById('addDeptModalBtn');
    const closeDeptModalBtn = document.getElementById('closeDeptModalBtn');
    const cancelDeptModalBtn = document.getElementById('cancelDeptModalBtn');

    // Forms
    const institutionForm = document.getElementById('institutionForm');
    const instUniversityName = document.getElementById('instUniversityName');
    const instCampusAddress = document.getElementById('instCampusAddress');
    const instDegreePrefix = document.getElementById('instDegreePrefix');
    const instDefaultDocType = document.getElementById('instDefaultDocType');
    const instBatchCredit = document.getElementById('instBatchCredit');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPasswordInput = document.getElementById('currentPasswordInput');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const sessionTimeoutSelect = document.getElementById('sessionTimeoutSelect');

    // Document Types
    const docTypeChipsContainer = document.getElementById('docTypeChipsContainer');
    const newDocTypeInput = document.getElementById('newDocTypeInput');
    const addDocTypeBtn = document.getElementById('addDocTypeBtn');
    const semesterList = document.getElementById('semesterList');

    // Backup & Actions
    const exportConfigBtn = document.getElementById('exportConfigBtn');
    const importConfigFile = document.getElementById('importConfigFile');
    const triggerImportBtn = document.getElementById('triggerImportBtn');
    const factoryResetBtn = document.getElementById('factoryResetBtn');
    const clearLogBtn = document.getElementById('clearLogBtn');

    // ==========================================================================
    // UI Helpers: Toast Notifications
    // ==========================================================================
    let toastTimeout = null;
    function showAdminToast(message, isSuccess = true) {
        if (toastTimeout) clearTimeout(toastTimeout);
        toastMsg.textContent = message;
        toastIcon.className = isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        toastIcon.style.color = isSuccess ? '#10b981' : '#f43f5e';
        adminToast.classList.remove('hidden');
        toastTimeout = setTimeout(() => {
            adminToast.classList.add('hidden');
        }, 3200);
    }

    // ==========================================================================
    // Authentication & Rate-Limiting Logic
    // ==========================================================================
    function checkLockout() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_LOCKOUT);
            if (raw) {
                const lockout = JSON.parse(raw);
                const now = Date.now();
                if (lockout.lockedUntil && lockout.lockedUntil > now) {
                    const remaining = Math.ceil((lockout.lockedUntil - now) / 1000);
                    startLockoutCountdown(remaining);
                    return true;
                } else if (lockout.lockedUntil && lockout.lockedUntil <= now) {
                    localStorage.removeItem(STORAGE_KEY_LOCKOUT);
                    isLockedOut = false;
                }
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        }
        return false;
    }

    function recordFailedAttempt() {
        try {
            let lockout = { attempts: 0, lockedUntil: 0 };
            const raw = localStorage.getItem(STORAGE_KEY_LOCKOUT);
            if (raw) lockout = JSON.parse(raw);
            lockout.attempts = (lockout.attempts || 0) + 1;
            if (lockout.attempts >= 5) {
                lockout.lockedUntil = Date.now() + 60000; // 60 seconds
                localStorage.setItem(STORAGE_KEY_LOCKOUT, JSON.stringify(lockout));
                startLockoutCountdown(60);
                addAuditLog('Brute-force lockout triggered (5 failed attempts)', 'unknown', 'Blocked');
            } else {
                localStorage.setItem(STORAGE_KEY_LOCKOUT, JSON.stringify(lockout));
            }
        } catch {
            // fallback
        }
    }

    function clearFailedAttempts() {
        try {
            localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        } catch {}
    }

    function startLockoutCountdown(seconds) {
        isLockedOut = true;
        if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
        loginSubmitBtn.disabled = true;
        let rem = seconds;

        function updateText() {
            authAlertText.textContent = `Too many failed attempts. Locked for ${rem}s.`;
            authAlert.classList.remove('hidden');
        }

        updateText();
        lockoutTimerInterval = setInterval(() => {
            rem--;
            if (rem <= 0) {
                clearInterval(lockoutTimerInterval);
                isLockedOut = false;
                clearFailedAttempts();
                loginSubmitBtn.disabled = false;
                authAlert.classList.add('hidden');
            } else {
                updateText();
            }
        }, 1000);
    }

    function checkActiveSession() {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) {
                const session = JSON.parse(raw);
                const maxAgeMs = (currentConfig.sessionTimeoutMinutes || 30) * 60 * 1000;
                if (Date.now() - session.loginTime < maxAgeMs) {
                    // Valid session: extend timestamp
                    session.loginTime = Date.now();
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    enterConsole();
                    return true;
                } else {
                    sessionStorage.removeItem(SESSION_KEY);
                    addAuditLog('Session timed out', session.user, 'Expired');
                }
            }
        } catch {
            sessionStorage.removeItem(SESSION_KEY);
        }
        return false;
    }

    function enterConsole() {
        authScreen.classList.add('hidden');
        adminConsoleScreen.classList.remove('hidden');
        refreshAllPanels();
    }

    function exitConsole() {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch {}
        adminConsoleScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
        passwordInput.value = '';
        authAlert.classList.add('hidden');
    }

    // Toggle Password Visibility
    togglePasswordBtn?.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordEyeIcon.className = 'fa-solid fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            passwordEyeIcon.className = 'fa-solid fa-eye';
        }
    });

    document.getElementById('fillDefaultBtn')?.addEventListener('click', () => {
        usernameInput.value = 'admin';
        passwordInput.value = 'outr@admin2025';
        authAlert.classList.add('hidden');
    });

    // Handle Login Form Submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isLockedOut) return;

        const user = usernameInput.value.trim().toLowerCase();
        const pwd = passwordInput.value;

        loginSubmitBtn.disabled = true;
        const origHtml = loginSubmitBtn.innerHTML;
        loginSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

        try {
            const computedHash = await hashPassword(pwd);
            const expectedHash = getStoredPasswordHash();

            if (user === 'admin' && computedHash === expectedHash) {
                clearFailedAttempts();
                try {
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, loginTime: Date.now() }));
                } catch {}
                addAuditLog('Successful Admin Login', user, 'Success');
                showAdminToast('Welcome, Administrator!');
                enterConsole();
            } else {
                recordFailedAttempt();
                addAuditLog('Failed Login Attempt', user || 'unknown', 'Denied');
                if (!checkLockout()) {
                    authAlertText.textContent = 'Invalid credentials. Please verify your password.';
                    authAlert.classList.remove('hidden');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            authAlertText.textContent = 'Cryptographic verification error.';
            authAlert.classList.remove('hidden');
        } finally {
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.innerHTML = origHtml;
        }
    });

    logoutBtn?.addEventListener('click', () => {
        addAuditLog('Admin Logout', 'admin', 'Success');
        exitConsole();
    });

    // ==========================================================================
    // Sidebar Navigation Tabs
    // ==========================================================================
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            navItems.forEach(n => n.classList.remove('active'));
            panelSections.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Quick Action shortcuts
    document.querySelector('.action-goto-depts')?.addEventListener('click', () => {
        document.querySelector('.nav-item[data-tab="departments"]')?.click();
    });
    document.querySelector('.action-goto-institution')?.addEventListener('click', () => {
        document.querySelector('.nav-item[data-tab="institution"]')?.click();
    });
    document.querySelector('.action-export-backup')?.addEventListener('click', () => {
        exportConfigBtn.click();
    });
    document.querySelector('.action-reset-stats')?.addEventListener('click', () => {
        if (confirm('Reset generation counters to 0?')) {
            try {
                localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify({ totalPdf: 0, totalPng: 0, totalCovers: 0 }));
            } catch {}
            refreshDashboardMetrics();
            addAuditLog('Counters reset to 0', 'admin', 'Success');
            showAdminToast('Generation metrics reset to 0');
        }
    });

    // ==========================================================================
    // Panel 1: Dashboard Refresh
    // ==========================================================================
    function refreshDashboardMetrics() {
        const stats = getStats();
        const total = stats.totalCovers || ((stats.totalPdf || 0) + (stats.totalPng || 0));
        document.getElementById('kpiTotalCovers').textContent = total.toLocaleString();
        document.getElementById('kpiPdfDownloads').textContent = (stats.totalPdf || 0).toLocaleString();
        document.getElementById('kpiPngDownloads').textContent = (stats.totalPng || 0).toLocaleString();
        document.getElementById('kpiTotalDepts').textContent = (currentConfig.departments || []).length;

        // Render Activity Log
        const logBody = document.getElementById('activityLogBody');
        logBody.replaceChildren();
        const logs = getAuditLogs();
        if (logs.length === 0) {
            const emptyTr = document.createElement('tr');
            emptyTr.innerHTML = '<td colspan="4" class="text-muted" style="text-align: center; padding: 24px;">No security events recorded yet</td>';
            logBody.appendChild(emptyTr);
            return;
        }

        logs.slice(0, 8).forEach(entry => {
            const tr = document.createElement('tr');
            const statusClass = entry.status === 'Success' ? 'style="color: #6ee7b7;"' : 'style="color: #fda4af;"';
            tr.innerHTML = `
                <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${entry.timestamp}</td>
                <td><strong>${escapeHtml(entry.event)}</strong></td>
                <td>${escapeHtml(entry.user)}</td>
                <td ${statusClass}>${escapeHtml(entry.status)}</td>
            `;
            logBody.appendChild(tr);
        });
    }

    clearLogBtn?.addEventListener('click', () => {
        try {
            localStorage.removeItem(STORAGE_KEY_LOGS);
        } catch {}
        refreshDashboardMetrics();
        showAdminToast('Audit log cleared');
    });

    // ==========================================================================
    // Panel 2: Institutional Profile
    // ==========================================================================
    function loadInstitutionPanel() {
        instUniversityName.value = currentConfig.universityName;
        instCampusAddress.value = currentConfig.campusAddress;
        instDegreePrefix.value = currentConfig.degreePrefix || 'B.TECH';
        instDefaultDocType.value = currentConfig.defaultDocType || 'LAB RECORD';
        instBatchCredit.value = currentConfig.batchCredit || 'BIOTECHNOLOGY 2025–29';
    }

    institutionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        currentConfig.universityName = instUniversityName.value.trim().toUpperCase();
        currentConfig.campusAddress = instCampusAddress.value.trim();
        currentConfig.degreePrefix = instDegreePrefix.value.trim().toUpperCase();
        currentConfig.defaultDocType = instDefaultDocType.value.trim().toUpperCase();
        currentConfig.batchCredit = instBatchCredit.value.trim();

        saveConfig(currentConfig);
        addAuditLog('Updated Institutional Profile', 'admin', 'Success');
        showAdminToast('Institutional profile updated successfully!');
    });

    document.querySelector('.action-restore-institution')?.addEventListener('click', () => {
        if (confirm('Reset institutional credentials to official OUTR standard defaults?')) {
            currentConfig.universityName = DEFAULT_CONFIG.universityName;
            currentConfig.campusAddress = DEFAULT_CONFIG.campusAddress;
            currentConfig.degreePrefix = DEFAULT_CONFIG.degreePrefix;
            currentConfig.defaultDocType = DEFAULT_CONFIG.defaultDocType;
            currentConfig.batchCredit = DEFAULT_CONFIG.batchCredit;
            saveConfig(currentConfig);
            loadInstitutionPanel();
            addAuditLog('Reset Institutional Profile to defaults', 'admin', 'Success');
            showAdminToast('Institutional profile restored to defaults');
        }
    });

    // ==========================================================================
    // Panel 3: Departments & Labs Manager
    // ==========================================================================
    function renderDepartmentsTable() {
        const tbody = document.getElementById('departmentsTableBody');
        tbody.replaceChildren();

        const depts = currentConfig.departments || [];
        if (depts.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" class="text-muted" style="text-align: center; padding: 24px;">No departments configured. Click "Add Department" to create one.</td>';
            tbody.appendChild(tr);
            return;
        }

        depts.forEach((dept, index) => {
            const tr = document.createElement('tr');
            const labsCount = dept.labs ? dept.labs.length : 0;
            const labsTooltip = dept.labs ? dept.labs.join(', ') : 'None';

            tr.innerHTML = `
                <td><span class="badge-code">${escapeHtml(dept.code)}</span></td>
                <td><strong>${escapeHtml(dept.name)}</strong></td>
                <td>B.TECH ${escapeHtml(dept.branch)}</td>
                <td>
                    <span class="badge-labs-count" title="${escapeHtml(labsTooltip)}">${labsCount} Labs</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button type="button" class="action-btn edit-dept-btn" data-index="${index}" title="Edit Department & Labs">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="action-btn delete-btn delete-dept-btn" data-index="${index}" title="Delete Department">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach action handlers
        tbody.querySelectorAll('.edit-dept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                openDeptModal(idx);
            });
        });

        tbody.querySelectorAll('.delete-dept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                const dept = currentConfig.departments[idx];
                if (confirm(`Are you sure you want to delete ${dept.name} (${dept.code})?`)) {
                    currentConfig.departments.splice(idx, 1);
                    saveConfig(currentConfig);
                    renderDepartmentsTable();
                    refreshDashboardMetrics();
                    addAuditLog(`Deleted Department: ${dept.code}`, 'admin', 'Success');
                    showAdminToast(`Deleted ${dept.name}`);
                }
            });
        });
    }

    function openDeptModal(editIndex = -1) {
        deptIndexInput.value = editIndex;
        if (editIndex >= 0) {
            const d = currentConfig.departments[editIndex];
            deptModalTitle.textContent = 'Edit Department';
            deptCodeInput.value = d.code;
            deptNameInput.value = d.name;
            deptBranchInput.value = d.branch;
            deptLabsInput.value = (d.labs || []).join(', ');
        } else {
            deptModalTitle.textContent = 'Add Department';
            deptCodeInput.value = '';
            deptNameInput.value = '';
            deptBranchInput.value = '';
            deptLabsInput.value = '';
        }
        deptModal.classList.remove('hidden');
    }

    function closeDeptModal() {
        deptModal.classList.add('hidden');
    }

    addDeptModalBtn?.addEventListener('click', () => openDeptModal(-1));
    closeDeptModalBtn?.addEventListener('click', closeDeptModal);
    cancelDeptModalBtn?.addEventListener('click', closeDeptModal);

    deptForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIdx = parseInt(deptIndexInput.value, 10);
        const code = deptCodeInput.value.trim().toUpperCase();
        const name = deptNameInput.value.trim().toUpperCase();
        const branch = deptBranchInput.value.trim().toUpperCase();
        const labs = deptLabsInput.value
            .split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);

        const newDept = { code, name, branch, labs };

        if (!currentConfig.departments) currentConfig.departments = [];

        if (editIdx >= 0) {
            currentConfig.departments[editIdx] = newDept;
            addAuditLog(`Edited Department: ${code}`, 'admin', 'Success');
            showAdminToast(`Updated department ${name}`);
        } else {
            currentConfig.departments.push(newDept);
            addAuditLog(`Added Department: ${code}`, 'admin', 'Success');
            showAdminToast(`Added department ${name}`);
        }

        saveConfig(currentConfig);
        closeDeptModal();
        renderDepartmentsTable();
        refreshDashboardMetrics();
    });

    // ==========================================================================
    // Panel 4: Document Types & Formats
    // ==========================================================================
    function renderDocTypes() {
        docTypeChipsContainer.replaceChildren();
        const list = currentConfig.docTypes || DEFAULT_CONFIG.docTypes;

        list.forEach((docType, index) => {
            const chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = `
                <span>${escapeHtml(docType)}</span>
                <button type="button" class="tag-chip-remove" data-index="${index}" title="Remove type">&times;</button>
            `;
            docTypeChipsContainer.appendChild(chip);
        });

        docTypeChipsContainer.querySelectorAll('.tag-chip-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                const removed = currentConfig.docTypes.splice(idx, 1);
                saveConfig(currentConfig);
                renderDocTypes();
                addAuditLog(`Removed Document Type: ${removed}`, 'admin', 'Success');
                showAdminToast(`Removed ${removed}`);
            });
        });

        // Semesters
        semesterList.replaceChildren();
        const sems = currentConfig.semesters || DEFAULT_CONFIG.semesters;
        sems.forEach(sem => {
            const li = document.createElement('li');
            li.className = 'semester-item';
            li.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${escapeHtml(sem)}</span>`;
            semesterList.appendChild(li);
        });
    }

    addDocTypeBtn?.addEventListener('click', () => {
        const val = newDocTypeInput.value.trim().toUpperCase();
        if (!val) return;
        if (!currentConfig.docTypes) currentConfig.docTypes = [];
        if (currentConfig.docTypes.includes(val)) {
            alert('Document type already exists.');
            return;
        }
        currentConfig.docTypes.push(val);
        saveConfig(currentConfig);
        newDocTypeInput.value = '';
        renderDocTypes();
        addAuditLog(`Added Document Type: ${val}`, 'admin', 'Success');
        showAdminToast(`Added ${val}`);
    });

    // ==========================================================================
    // Panel 5: Security & Password Management
    // ==========================================================================
    changePasswordForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const curr = currentPasswordInput.value;
        const newPwd = newPasswordInput.value;
        const confPwd = confirmPasswordInput.value;

        if (newPwd !== confPwd) {
            alert('New passwords do not match. Please re-enter.');
            return;
        }

        if (newPwd.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        const currHash = await hashPassword(curr);
        const storedHash = getStoredPasswordHash();

        if (currHash !== storedHash) {
            alert('Current password verification failed.');
            addAuditLog('Password update rejected (incorrect current password)', 'admin', 'Denied');
            return;
        }

        const newHash = await hashPassword(newPwd);
        setStoredPasswordHash(newHash);
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        addAuditLog('Admin password successfully updated', 'admin', 'Success');
        showAdminToast('Password updated securely!');
    });

    sessionTimeoutSelect?.addEventListener('change', () => {
        currentConfig.sessionTimeoutMinutes = parseInt(sessionTimeoutSelect.value, 10);
        saveConfig(currentConfig);
        showAdminToast(`Session timeout set to ${currentConfig.sessionTimeoutMinutes}m`);
    });

    // ==========================================================================
    // Panel 6: Backup & Data Management
    // ==========================================================================
    exportConfigBtn?.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `outr_admin_config_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        addAuditLog('Exported JSON Backup', 'admin', 'Success');
        showAdminToast('Backup downloaded successfully!');
    });

    triggerImportBtn?.addEventListener('click', () => {
        importConfigFile.click();
    });

    importConfigFile?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (!parsed.universityName || !parsed.departments) {
                    alert('Invalid configuration file structure.');
                    return;
                }
                saveConfig(parsed);
                refreshAllPanels();
                addAuditLog('Restored configuration from JSON backup', 'admin', 'Success');
                showAdminToast('Configuration restored successfully!');
            } catch (err) {
                alert('Failed to parse JSON file: ' + err.message);
            }
        };
        reader.readAsText(file);
        importConfigFile.value = '';
    });

    factoryResetBtn?.addEventListener('click', () => {
        if (confirm('WARNING: Reset all departments, institutional profiles, and document types to OUTR factory defaults? This action cannot be undone.')) {
            saveConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
            setStoredPasswordHash(DEFAULT_HASH);
            refreshAllPanels();
            addAuditLog('Factory Reset Performed', 'admin', 'Success');
            showAdminToast('Restored all factory defaults');
        }
    });

    // ==========================================================================
    // Helpers
    // ==========================================================================
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function refreshAllPanels() {
        refreshDashboardMetrics();
        loadInstitutionPanel();
        renderDepartmentsTable();
        renderDocTypes();
        if (sessionTimeoutSelect) {
            sessionTimeoutSelect.value = String(currentConfig.sessionTimeoutMinutes || 30);
        }
    }

    // ==========================================================================
    // Initialization: Open Admin Console immediately on load
    // ==========================================================================
    enterConsole();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPortal);
} else {
    initAdminPortal();
}

