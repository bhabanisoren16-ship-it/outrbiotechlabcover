/* ==========================================================================
   OUTR LAB COVER GENERATOR - JAVASCRIPT ENGINE
   Real-time Preview & PDF/PNG Export
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Form Inputs
    const labNameInput = document.getElementById('labNameInput');
    const docTypeInput = document.getElementById('docTypeInput');
    const degreeBranchInput = document.getElementById('degreeBranchInput');
    const semesterInput = document.getElementById('semesterInput');
    const submittedByLabelInput = document.getElementById('submittedByLabelInput');
    const studentNameInput = document.getElementById('studentNameInput');
    const regNoInput = document.getElementById('regNoInput');
    const groupInput = document.getElementById('groupInput');
    const sectionInput = document.getElementById('sectionInput');
    const departmentInput = document.getElementById('departmentInput');
    const universityInput = document.getElementById('universityInput');
    const addressInput = document.getElementById('addressInput');

    // DOM Elements - Preview Canvas
    const coverSheet = document.getElementById('coverSheet');
    const prevLabName = document.getElementById('prevLabName');
    const prevDocType = document.getElementById('prevDocType');
    const prevDegreeBranch = document.getElementById('prevDegreeBranch');
    const prevSemester = document.getElementById('prevSemester');
    const prevSubmittedByLabel = document.getElementById('prevSubmittedByLabel');
    const prevStudentNameVal = document.getElementById('prevStudentNameVal');
    const prevRegNoVal = document.getElementById('prevRegNoVal');
    const prevGroupVal = document.getElementById('prevGroupVal');
    const prevSectionVal = document.getElementById('prevSectionVal');
    const prevSectionRow = document.getElementById('prevSectionRow');
    const prevDepartment = document.getElementById('prevDepartment');
    const prevUniversity = document.getElementById('prevUniversity');
    const prevAddress = document.getElementById('prevAddress');

    // Action Buttons
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const printBtn = document.getElementById('printBtn');
    const resetBtn = document.getElementById('resetBtn');
    const coverForm = document.getElementById('coverForm');
    if (coverForm) {
        coverForm.addEventListener('submit', (e) => e.preventDefault());
    }

    // Zoom Controls & Responsive Elements
    const paperViewport = document.getElementById('paperViewport');
    const sheetWrapper = document.getElementById('sheetWrapper');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomFitBtn = document.getElementById('zoomFitBtn');
    const zoomLevelEl = document.getElementById('zoomLevel');
    const tabFormBtn = document.getElementById('tabFormBtn');
    const tabPreviewBtn = document.getElementById('tabPreviewBtn');
    const mobileBackToFormBtn = document.getElementById('mobileBackToFormBtn');
    const sidebar = document.getElementById('sidebar');
    const previewArea = document.getElementById('previewArea');

    let currentZoom = 1.0;

    // ==========================================================================
    // Real-time Preview Synchronization
    // ==========================================================================

    function updatePreview() {
        // Sync text content
        prevLabName.textContent = labNameInput.value.trim() || 'LAB NAME';
        prevDocType.textContent = docTypeInput.value.trim() || 'LAB RECORD';

        const branchVal = degreeBranchInput.value.trim();
        let formattedBranch = 'B.TECH';
        if (branchVal && branchVal.toUpperCase() !== 'BRANCH NAME') {
            const cleanBranch = branchVal.replace(/^B\.?\s*TECH\s*/i, '').trim();
            formattedBranch = cleanBranch ? `B.TECH ${cleanBranch.toUpperCase()}` : 'B.TECH';
        } else {
            formattedBranch = 'B.TECH';
        }
        prevDegreeBranch.textContent = formattedBranch;

        prevSemester.textContent = semesterInput.value.trim() || '3RD SEMESTER';

        prevSubmittedByLabel.textContent = submittedByLabelInput.value.trim() || 'SUBMITTED BY :';
        
        const nameVal = studentNameInput.value.trim();
        const cleanName = nameVal ? nameVal.replace(/^NAME\s*[-:]?\s*/i, '').trim() : '';
        if (prevStudentNameVal) prevStudentNameVal.textContent = cleanName;
        
        const regVal = regNoInput.value.trim();
        const cleanReg = regVal ? regVal.replace(/^REGD(\s*NO\.?)?\s*[-:]?\s*/i, '').trim() : '';
        if (prevRegNoVal) prevRegNoVal.textContent = cleanReg;
        
        const groupVal = groupInput.value.trim();
        const cleanGroup = groupVal ? groupVal.replace(/^GROUP\s*[-:]?\s*/i, '').trim() : '';
        if (prevGroupVal) prevGroupVal.textContent = cleanGroup;

        const sectionVal = sectionInput.value.trim();
        if (sectionVal) {
            const cleanSection = sectionVal.replace(/^SECTION\s*[-:]?\s*/i, '').trim();
            if (prevSectionVal) prevSectionVal.textContent = cleanSection;
            prevSectionRow?.classList.remove('hidden');
        } else {
            prevSectionRow?.classList.add('hidden');
        }

        const deptVal = departmentInput.value.trim();
        let formattedDept = 'DEPARTMENT OF';
        if (deptVal && deptVal.toUpperCase() !== 'BRANCH NAME') {
            const cleanDept = deptVal.replace(/^DEPARTMENT\s+OF\s+/i, '').replace(/^DEPARTMENT\s+/i, '').trim();
            formattedDept = cleanDept && cleanDept.toUpperCase() !== 'BRANCH NAME'
                ? `DEPARTMENT OF ${cleanDept.toUpperCase()}`
                : 'DEPARTMENT OF';
        } else {
            formattedDept = 'DEPARTMENT OF';
        }
        prevDepartment.textContent = formattedDept;
        prevUniversity.textContent = universityInput.value.trim() || 'UNIVERSITY NAME';
        prevAddress.textContent = addressInput.value.trim() || '';
    }

    // Attach Input Event Listeners
    const inputs = [
        labNameInput, docTypeInput, degreeBranchInput, semesterInput,
        submittedByLabelInput, studentNameInput, regNoInput, groupInput, sectionInput,
        departmentInput, universityInput, addressInput
    ];

    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    // Smart sync: when user enters/changes Branch (e.g. B.TECH COMPUTER SCIENCE & ENGINEERING),
    // automatically sync the Department field if the user hasn't manually overridden it.
    let departmentEditedManually = false;
    departmentInput.addEventListener('input', () => {
        departmentEditedManually = true;
    });

    degreeBranchInput.addEventListener('input', () => {
        if (!departmentEditedManually || departmentInput.value.trim() === 'BRANCH NAME' || departmentInput.value.trim() === '') {
            const branchVal = degreeBranchInput.value.trim();
            if (branchVal) {
                const cleanBranch = branchVal.replace(/^(B\.?\s*TECH|M\.?\s*TECH|B\.?\s*SC|M\.?\s*SC|MCA|BCA|PH\.?\s*D)(\s+(IN|OF))?\s*/i, '').trim();
                departmentInput.value = cleanBranch ? cleanBranch.toUpperCase() : '';
            } else {
                departmentInput.value = '';
            }
            updatePreview();
        }
    });

    resetBtn.addEventListener('click', () => {
        labNameInput.value = '';
        docTypeInput.value = 'LAB RECORD';
        degreeBranchInput.value = '';
        semesterInput.value = '3RD SEMESTER';
        submittedByLabelInput.value = 'SUBMITTED BY :';
        studentNameInput.value = '';
        regNoInput.value = '';
        groupInput.value = '';
        sectionInput.value = '';
        departmentInput.value = '';
        departmentEditedManually = false;
        universityInput.value = 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH';
        addressInput.value = 'Techno Campus, Ghatikia, Bhubaneswar, 751029';
        
        applyAdminConfiguration();
        updatePreview();
    });

    // ==========================================================================
    // Zoom Controls & Responsive Auto-Fit
    // ==========================================================================

    function setZoom(scale) {
        currentZoom = Math.min(Math.max(0.2, scale), 2.0);
        if ('zoom' in coverSheet.style) {
            coverSheet.style.zoom = currentZoom;
            coverSheet.style.transform = 'none';
            coverSheet.style.webkitTransform = 'none';
        } else {
            coverSheet.style.transform = `scale(${currentZoom})`;
            coverSheet.style.webkitTransform = `scale(${currentZoom})`;
        }
        if (sheetWrapper) {
            sheetWrapper.style.width = `${Math.round(794 * currentZoom)}px`;
            sheetWrapper.style.height = `${Math.round(1123 * currentZoom)}px`;
        }
        zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    function autoFit() {
        if (!paperViewport) return;
        const isMobile = window.innerWidth <= 900;
        let vpWidth = paperViewport.clientWidth;
        if (!vpWidth || vpWidth <= 0) {
            vpWidth = window.innerWidth;
        }
        const padding = isMobile ? 16 : 80;
        const availableWidth = Math.max(260, vpWidth - padding);
        const sheetWidth = 794;
        const autoScale = Math.min(1.0, Math.max(0.2, availableWidth / sheetWidth));
        setZoom(autoScale);
    }

    zoomInBtn.addEventListener('click', () => setZoom(currentZoom + 0.1));
    zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - 0.1));
    zoomFitBtn.addEventListener('click', autoFit);

    // Responsive window resize re-fit (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(autoFit, 150);
    });

    // Auto fit initial view on load
    setTimeout(autoFit, 200);

    // ==========================================================================
    // Mobile View Navigation (Smooth Scroll between Form & Preview)
    // ==========================================================================

    const workspace = document.querySelector('.workspace');

    function switchMobileTab(target) {
        if (target === 'preview') {
            tabFormBtn?.classList.remove('active');
            tabPreviewBtn?.classList.add('active');
            if (window.innerWidth <= 900) {
                previewArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            requestAnimationFrame(() => {
                setTimeout(autoFit, 40);
            });
        } else {
            tabPreviewBtn?.classList.remove('active');
            tabFormBtn?.classList.add('active');
            if (window.innerWidth <= 900) {
                if (workspace) {
                    workspace.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    sidebar?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }

    // Scroll-spy to highlight active tab when user scrolls
    if (workspace) {
        workspace.addEventListener('scroll', () => {
            if (window.innerWidth > 900) return;
            const previewTop = previewArea?.offsetTop || 600;
            if (workspace.scrollTop >= previewTop - 150) {
                tabFormBtn?.classList.remove('active');
                tabPreviewBtn?.classList.add('active');
            } else {
                tabPreviewBtn?.classList.remove('active');
                tabFormBtn?.classList.add('active');
            }
        }, { passive: true });
    }

    tabFormBtn?.addEventListener('click', () => switchMobileTab('form'));
    tabPreviewBtn?.addEventListener('click', () => switchMobileTab('preview'));
    mobileBackToFormBtn?.addEventListener('click', () => switchMobileTab('form'));

    // ==========================================================================
    // Export Handlers (PDF, PNG, Print) - Pure Seamless In-Memory Export
    // Zero DOM pollution: live page is never touched, no ghost sheet flash
    // ==========================================================================

    function autoClearAfterDownload() {
        // Clear personal & student details
        studentNameInput.value = '';
        regNoInput.value = '';
        groupInput.value = '';
        sectionInput.value = '';

        // Clear local storage data for privacy so details aren't shared
        try {
            localStorage.removeItem('outr_cover_data');
        } catch (e) {
            // Safe fallback for restricted storage environments
        }

        // Refresh preview
        updatePreview();
    }

    async function generateA4Canvas(customScale) {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const exportScale = customScale || (isMobile ? 3.5 : 4.0);

        return await html2canvas(coverSheet, {
            scale: exportScale,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
            width: 794,
            height: 1123,
            windowWidth: 1200,
            windowHeight: 1600,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            onclone: (clonedDoc) => {
                // Remove all app chrome from cloned sandbox
                const chromeSelectors = ['.app-header', '.mobile-nav-bar', '.sidebar', '.preview-toolbar', 'button'];
                chromeSelectors.forEach(sel => {
                    clonedDoc.querySelectorAll(sel).forEach(el => el.remove());
                });

                if (clonedDoc.body) {
                    clonedDoc.body.style.margin = '0';
                    clonedDoc.body.style.padding = '0';
                    clonedDoc.body.style.background = '#ffffff';
                    clonedDoc.body.style.overflow = 'hidden';
                }

                const clonedViewport = clonedDoc.getElementById('paperViewport');
                if (clonedViewport) {
                    clonedViewport.style.zoom = '1';
                    clonedViewport.style.padding = '0';
                    clonedViewport.style.margin = '0';
                    clonedViewport.style.width = '794px';
                    clonedViewport.style.height = '1123px';
                    clonedViewport.style.overflow = 'visible';
                    clonedViewport.style.transform = 'none';
                }

                const clonedWrapper = clonedDoc.getElementById('sheetWrapper');
                if (clonedWrapper) {
                    clonedWrapper.style.zoom = '1';
                    clonedWrapper.style.width = '794px';
                    clonedWrapper.style.height = '1123px';
                    clonedWrapper.style.padding = '0';
                    clonedWrapper.style.margin = '0';
                    clonedWrapper.style.overflow = 'visible';
                    clonedWrapper.style.transform = 'none';
                    clonedWrapper.style.position = 'static';
                }

                const clonedSheet = clonedDoc.getElementById('coverSheet');
                if (clonedSheet) {
                    clonedSheet.style.zoom = '1';
                    clonedSheet.style.position = 'fixed';
                    clonedSheet.style.left = '0';
                    clonedSheet.style.top = '0';
                    clonedSheet.style.transform = 'none';
                    clonedSheet.style.webkitTransform = 'none';
                    clonedSheet.style.boxShadow = 'none';
                    clonedSheet.style.width = '794px';
                    clonedSheet.style.minWidth = '794px';
                    clonedSheet.style.maxWidth = '794px';
                    clonedSheet.style.height = '1123px';
                    clonedSheet.style.minHeight = '1123px';
                    clonedSheet.style.maxHeight = '1123px';
                    clonedSheet.style.padding = '1.4cm';
                    clonedSheet.style.boxSizing = 'border-box';
                    clonedSheet.style.margin = '0';
                    clonedSheet.style.zIndex = '999999';
                    clonedSheet.style.backgroundColor = '#ffffff';
                    clonedSheet.style.opacity = '1';
                    clonedSheet.style.visibility = 'visible';
                    clonedSheet.style.webkitFontSmoothing = 'antialiased';
                    clonedSheet.style.mozOsxFontSmoothing = 'grayscale';
                    clonedSheet.style.textRendering = 'geometricPrecision';
                }

                const clonedLogos = clonedDoc.querySelectorAll('#coverSheet img, .university-logo');
                clonedLogos.forEach(img => {
                    img.style.imageRendering = '-webkit-optimize-contrast';
                    img.style.imageRendering = 'crisp-edges';
                });
            }
        });
    }

    function getSafeFileName() {
        const raw = labNameInput.value.trim() || 'Lab';
        const sanitized = raw.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 50);
        return (sanitized || 'Lab') + '_Cover_Page';
    }

    downloadPdfBtn.addEventListener('click', async () => {
        downloadPdfBtn.blur();
        downloadPdfBtn.disabled = true;
        const originalPdfHtml = downloadPdfBtn.innerHTML;
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Downloading...</span>';

        await new Promise(resolve => setTimeout(resolve, 30));

        const baseFileName = getSafeFileName();

        try {
            const canvas = await generateA4Canvas();

            const imgData = canvas.toDataURL('image/png', 1.0);
            const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
            const pdf = new jsPdfConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true,
                floatPrecision: 16
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
            pdf.save(`${baseFileName}.pdf`);
            recordExportAnalytics('pdf');

            setTimeout(autoClearAfterDownload, 300);
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.innerHTML = originalPdfHtml;
        }
    });

    downloadPngBtn.addEventListener('click', async () => {
        downloadPngBtn.blur();
        downloadPngBtn.disabled = true;
        const originalPngHtml = downloadPngBtn.innerHTML;
        downloadPngBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Downloading...</span>';

        await new Promise(resolve => setTimeout(resolve, 25));

        const fileName = `${getSafeFileName()}.png`;

        try {
            const canvas = await generateA4Canvas();

            if (canvas.toBlob) {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = blobUrl;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        recordExportAnalytics('png');
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
                    } else {
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    }
                    setTimeout(autoClearAfterDownload, 300);
                }, 'image/png');
            } else {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
                setTimeout(autoClearAfterDownload, 300);
            }
        } catch (err) {
            console.error('PNG export failed:', err);
        } finally {
            downloadPngBtn.disabled = false;
            downloadPngBtn.innerHTML = originalPngHtml;
        }
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Always clear storage so every visitor starts completely fresh without previous changes
    try {
        localStorage.removeItem('outr_cover_data');
    } catch (e) {
        // Safe fallback for restricted storage environments
    }

    // ==========================================================================
    // Mobile Theme-Color Synchronization
    // Syncs mobile browser address bar color with the 24s 4-color CSS gradient
    // ==========================================================================
    const THEME_COLORS = ['#0b164f', '#3b0764', '#032742', '#2d0536'];
    let themeIdx = 0;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        setInterval(() => {
            themeIdx = (themeIdx + 1) % THEME_COLORS.length;
            metaTheme.setAttribute('content', THEME_COLORS[themeIdx]);
        }, 6000);
    }

    // ==========================================================================
    // Admin Portal Integration (Dynamic Profiles & Telemetry)
    // ==========================================================================
    function applyAdminConfiguration() {
        try {
            const raw = localStorage.getItem('outr_admin_config');
            if (!raw) return;
            const config = JSON.parse(raw);

            if (config.universityName) {
                universityInput.value = config.universityName;
            }
            if (config.campusAddress) {
                addressInput.value = config.campusAddress;
            }
            if (config.defaultDocType) {
                docTypeInput.value = config.defaultDocType;
            }
            if (config.degreePrefix) {
                const prefixSpan = document.querySelector('.input-prefix');
                if (prefixSpan) prefixSpan.textContent = config.degreePrefix;
            }
            if (config.batchCredit) {
                const creditBadges = document.querySelectorAll('.header-credit-badge strong, .credit-author');
                creditBadges.forEach(el => {
                    el.textContent = config.batchCredit;
                });
            }

            // Populate datalists for Branch & Lab Name auto-completion
            const branchDataList = document.getElementById('adminBranchList');
            const labDataList = document.getElementById('adminLabList');
            if (config.departments && branchDataList && labDataList) {
                branchDataList.replaceChildren();
                labDataList.replaceChildren();
                config.departments.forEach(dept => {
                    const opt = document.createElement('option');
                    opt.value = dept.branch;
                    branchDataList.appendChild(opt);

                    if (dept.labs) {
                        dept.labs.forEach(lab => {
                            const labOpt = document.createElement('option');
                            labOpt.value = lab.toUpperCase();
                            labDataList.appendChild(labOpt);
                        });
                    }
                });
            }
        } catch (e) {
            console.error('Failed to apply admin config:', e);
        }
    }

    function recordExportAnalytics(type) {
        try {
            const raw = localStorage.getItem('outr_admin_stats');
            const stats = raw ? JSON.parse(raw) : { totalPdf: 0, totalPng: 0, totalCovers: 0 };
            if (type === 'pdf') {
                stats.totalPdf = (stats.totalPdf || 0) + 1;
            } else if (type === 'png') {
                stats.totalPng = (stats.totalPng || 0) + 1;
            }
            stats.totalCovers = (stats.totalCovers || 0) + 1;
            localStorage.setItem('outr_admin_stats', JSON.stringify(stats));
        } catch {
            // fallback
        }
    }

    // ==========================================================================
    // Embedded Admin Portal Modal Engine
    // ==========================================================================
    const DEFAULT_ADMIN_CONFIG = {
        universityName: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
        campusAddress: 'Techno Campus, Ghatikia, Bhubaneswar, 751029',
        degreePrefix: 'B.TECH',
        defaultDocType: 'LAB RECORD',
        batchCredit: 'BIOTECHNOLOGY 2025–29',
        departments: [
            { code: 'BT', name: 'BIOTECHNOLOGY', branch: 'BIOTECHNOLOGY', labs: ['Biochemistry Lab', 'Microbiology Lab', 'Bioprocess Engineering Lab', 'Molecular Biology Lab', 'Immunotechnology Lab'] },
            { code: 'CSE', name: 'COMPUTER SCIENCE & ENGINEERING', branch: 'COMPUTER SCIENCE & ENGINEERING', labs: ['Data Structures Lab', 'Design & Analysis of Algorithms Lab', 'Database Management Systems Lab', 'Operating Systems Lab', 'Computer Networks Lab'] },
            { code: 'IT', name: 'INFORMATION TECHNOLOGY', branch: 'INFORMATION TECHNOLOGY', labs: ['Object Oriented Programming Lab', 'Web Technologies Lab', 'Software Engineering Lab', 'Cloud Computing Lab'] },
            { code: 'MECH', name: 'MECHANICAL ENGINEERING', branch: 'MECHANICAL ENGINEERING', labs: ['Fluid Mechanics Lab', 'Heat Transfer Lab', 'Manufacturing Process Lab', 'Kinematics & Dynamics Lab'] },
            { code: 'EE', name: 'ELECTRICAL ENGINEERING', branch: 'ELECTRICAL ENGINEERING', labs: ['Electrical Machines Lab', 'Power Electronics Lab', 'Control Systems Lab', 'Circuits & Networks Lab'] },
            { code: 'CIVIL', name: 'CIVIL ENGINEERING', branch: 'CIVIL ENGINEERING', labs: ['Surveying Lab', 'Geotechnical Engineering Lab', 'Concrete Technology Lab', 'Hydraulics & Water Resources Lab'] },
            { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGINEERING', branch: 'ELECTRONICS & INSTRUMENTATION ENGINEERING', labs: ['Transducers & Sensors Lab', 'Industrial Instrumentation Lab', 'Digital Signal Processing Lab', 'Analog Electronics Lab'] },
            { code: 'TE', name: 'TEXTILE ENGINEERING', branch: 'TEXTILE ENGINEERING', labs: ['Yarn Manufacturing Lab', 'Fabric Manufacturing Lab', 'Textile Chemical Processing Lab', 'Fabric Testing Lab'] }
        ]
    };

    const adminPortalBtn = document.getElementById('adminPortalBtn');
    const adminModalOverlay = document.getElementById('adminModalOverlay');
    const adminModalCloseBtn = document.getElementById('adminModalCloseBtn');
    const adminModalCancelBtn = document.getElementById('adminModalCancelBtn');
    const adminModalSaveBtn = document.getElementById('adminModalSaveBtn');
    const adminModalTabs = document.querySelectorAll('.admin-modal-tab');
    const adminModalTabContents = document.querySelectorAll('.admin-modal-tab-content');

    let modalWorkingConfig = null;

    function getAdminConfig() {
        try {
            const raw = localStorage.getItem('outr_admin_config');
            if (raw) return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(raw) };
        } catch {}
        return JSON.parse(JSON.stringify(DEFAULT_ADMIN_CONFIG));
    }

    function openAdminModal() {
        if (!adminModalOverlay) return;
        modalWorkingConfig = getAdminConfig();

        const univInput = document.getElementById('modalUnivName');
        const campusInput = document.getElementById('modalCampusAddr');
        const degInput = document.getElementById('modalDegreePrefix');
        const docInput = document.getElementById('modalDefaultDoc');
        const creditInput = document.getElementById('modalBatchCredit');

        if (univInput) univInput.value = modalWorkingConfig.universityName || '';
        if (campusInput) campusInput.value = modalWorkingConfig.campusAddress || '';
        if (degInput) degInput.value = modalWorkingConfig.degreePrefix || 'B.TECH';
        if (docInput) docInput.value = modalWorkingConfig.defaultDocType || 'LAB RECORD';
        if (creditInput) creditInput.value = modalWorkingConfig.batchCredit || 'BIOTECHNOLOGY 2025–29';

        renderModalDeptList();
        refreshModalStats();

        adminModalTabs.forEach((tab, i) => tab.classList.toggle('active', i === 0));
        adminModalTabContents.forEach((content, i) => content.classList.toggle('active', i === 0));

        adminModalOverlay.classList.remove('hidden');
    }

    function closeAdminModal() {
        if (adminModalOverlay) {
            adminModalOverlay.classList.add('hidden');
        }
    }

    function renderModalDeptList() {
        const container = document.getElementById('modalDeptList');
        if (!container) return;
        container.innerHTML = '';
        const depts = (modalWorkingConfig && modalWorkingConfig.departments) || [];

        if (depts.length === 0) {
            container.innerHTML = '<span style="color:#94a3b8; font-size:0.8rem; padding:8px 0;">No departments added yet.</span>';
            return;
        }

        depts.forEach((dept, idx) => {
            const item = document.createElement('div');
            item.className = 'modal-dept-item';
            const labsCount = dept.labs ? dept.labs.length : 0;
            item.innerHTML = `
                <div class="modal-dept-info">
                    <strong>[${dept.code}] ${dept.name}</strong>
                    <span>B.TECH ${dept.branch} (${labsCount} labs)</span>
                </div>
                <button type="button" class="btn btn-outline modal-delete-dept" data-idx="${idx}" style="padding:4px 8px; font-size:0.75rem; color:#fda4af; border-color:rgba(244,63,94,0.3);" title="Delete department">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('.modal-delete-dept').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                if (modalWorkingConfig && modalWorkingConfig.departments) {
                    modalWorkingConfig.departments.splice(idx, 1);
                    renderModalDeptList();
                }
            });
        });
    }

    function refreshModalStats() {
        try {
            const raw = localStorage.getItem('outr_admin_stats');
            const stats = raw ? JSON.parse(raw) : { totalPdf: 0, totalPng: 0, totalCovers: 0 };
            const total = stats.totalCovers || ((stats.totalPdf || 0) + (stats.totalPng || 0));
            const totalEl = document.getElementById('modalStatTotal');
            const pdfEl = document.getElementById('modalStatPdf');
            const pngEl = document.getElementById('modalStatPng');
            if (totalEl) totalEl.textContent = total.toLocaleString();
            if (pdfEl) pdfEl.textContent = (stats.totalPdf || 0).toLocaleString();
            if (pngEl) pngEl.textContent = (stats.totalPng || 0).toLocaleString();
        } catch {}
    }

    // Modal Trigger
    adminPortalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminModal();
    });

    adminModalCloseBtn?.addEventListener('click', closeAdminModal);
    adminModalCancelBtn?.addEventListener('click', closeAdminModal);

    adminModalOverlay?.addEventListener('click', (e) => {
        if (e.target === adminModalOverlay) {
            closeAdminModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminModalOverlay && !adminModalOverlay.classList.contains('hidden')) {
            closeAdminModal();
        }
    });

    adminModalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabKey = tab.getAttribute('data-modaltab');
            adminModalTabs.forEach(t => t.classList.remove('active'));
            adminModalTabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetContent = document.getElementById(`modalTab-${tabKey}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    document.getElementById('modalAddDeptBtn')?.addEventListener('click', () => {
        const codeInput = document.getElementById('modalNewDeptCode');
        const nameInput = document.getElementById('modalNewDeptName');
        const labsInput = document.getElementById('modalNewDeptLabs');
        const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
        const name = nameInput ? nameInput.value.trim().toUpperCase() : '';
        const labs = labsInput ? labsInput.value.split(',').map(s => s.trim()).filter(Boolean) : [];

        if (!code || !name) {
            alert('Please provide department code and name.');
            return;
        }

        if (!modalWorkingConfig) modalWorkingConfig = getAdminConfig();
        if (!modalWorkingConfig.departments) modalWorkingConfig.departments = [];
        modalWorkingConfig.departments.push({ code, name, branch: name, labs });
        if (codeInput) codeInput.value = '';
        if (nameInput) nameInput.value = '';
        if (labsInput) labsInput.value = '';
        renderModalDeptList();
    });

    document.getElementById('modalResetStatsBtn')?.addEventListener('click', () => {
        if (confirm('Reset generation counters to 0?')) {
            try {
                localStorage.setItem('outr_admin_stats', JSON.stringify({ totalPdf: 0, totalPng: 0, totalCovers: 0 }));
            } catch {}
            refreshModalStats();
        }
    });

    document.getElementById('modalExportBackupBtn')?.addEventListener('click', () => {
        const cfg = getAdminConfig();
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cfg, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `outr_admin_config_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    document.getElementById('modalFactoryResetBtn')?.addEventListener('click', () => {
        if (confirm('Reset all institutional settings and departments to OUTR factory defaults?')) {
            try {
                localStorage.setItem('outr_admin_config', JSON.stringify(DEFAULT_ADMIN_CONFIG));
            } catch {}
            applyAdminConfiguration();
            updatePreview();
            openAdminModal();
        }
    });

    adminModalSaveBtn?.addEventListener('click', () => {
        if (!modalWorkingConfig) modalWorkingConfig = getAdminConfig();
        const univInput = document.getElementById('modalUnivName');
        const campusInput = document.getElementById('modalCampusAddr');
        const degInput = document.getElementById('modalDegreePrefix');
        const docInput = document.getElementById('modalDefaultDoc');
        const creditInput = document.getElementById('modalBatchCredit');

        if (univInput) modalWorkingConfig.universityName = univInput.value.trim().toUpperCase();
        if (campusInput) modalWorkingConfig.campusAddress = campusInput.value.trim();
        if (degInput) modalWorkingConfig.degreePrefix = degInput.value.trim().toUpperCase();
        if (docInput) modalWorkingConfig.defaultDocType = docInput.value.trim().toUpperCase();
        if (creditInput) modalWorkingConfig.batchCredit = creditInput.value.trim();

        try {
            localStorage.setItem('outr_admin_config', JSON.stringify(modalWorkingConfig));
        } catch (err) {
            console.error('Failed to save admin config:', err);
        }

        applyAdminConfiguration();
        updatePreview();
        closeAdminModal();
    });

    // Apply any configured admin profile
    applyAdminConfiguration();

    // Initialize fresh preview
    updatePreview();
});
