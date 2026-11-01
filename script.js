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
        
        updatePreview();
    });

    // ==========================================================================
    // Zoom Controls & Responsive Auto-Fit
    // ==========================================================================

    function setZoom(scale) {
        currentZoom = Math.min(Math.max(0.2, scale), 2.0);
        const isMobile = window.innerWidth <= 900;

        if (!isMobile && 'zoom' in coverSheet.style) {
            coverSheet.style.zoom = currentZoom;
            coverSheet.style.transform = 'none';
            coverSheet.style.webkitTransform = 'none';
        } else {
            coverSheet.style.zoom = '1';
            coverSheet.style.transformOrigin = 'top left';
            coverSheet.style.transform = `scale(${currentZoom})`;
            coverSheet.style.webkitTransform = `scale(${currentZoom})`;
        }
        if (sheetWrapper) {
            sheetWrapper.style.width = `${Math.round(794 * currentZoom)}px`;
            sheetWrapper.style.height = `${Math.round(1123 * currentZoom)}px`;
        }
        if (zoomLevelEl) {
            zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }

    function autoFit() {
        if (!paperViewport || !coverSheet) return;
        const isMobile = window.innerWidth <= 900;
        const sheetWidth = 794;
        const sheetHeight = 1123;

        let vpWidth = paperViewport.clientWidth;
        let vpHeight = paperViewport.clientHeight;

        if (isMobile) {
            // Mobile (<= 900px): Scale to fit viewport width so text remains clear & legible
            if (!vpWidth || vpWidth <= 0) {
                vpWidth = window.innerWidth;
            }
            const padding = window.innerWidth <= 480 ? 16 : 24;
            const availableWidth = Math.max(200, vpWidth - padding);
            const autoScale = Math.min(1.0, Math.max(0.2, availableWidth / sheetWidth));
            setZoom(autoScale);
        } else {
            // Desktop (> 900px): Scale to fit BOTH width and height perfectly within viewport
            if (!vpWidth || vpWidth <= 0) {
                const sbWidth = sidebar ? sidebar.offsetWidth : 520;
                vpWidth = Math.max(300, window.innerWidth - sbWidth);
            }
            if (!vpHeight || vpHeight <= 0) {
                vpHeight = Math.max(300, window.innerHeight - 112);
            }

            // Read computed padding of paperViewport to calculate exact visible canvas
            let padX = 40;
            let padY = 48;
            if (window.getComputedStyle) {
                const comp = window.getComputedStyle(paperViewport);
                const pl = parseFloat(comp.paddingLeft) || 20;
                const pr = parseFloat(comp.paddingRight) || 20;
                const pt = parseFloat(comp.paddingTop) || 24;
                const pb = parseFloat(comp.paddingBottom) || 24;
                padX = pl + pr;
                padY = pt + pb;
            }

            // Safety cushion (16px) to comfortably accommodate paper shadow and avoid scrollbars
            const availableWidth = Math.max(200, vpWidth - padX - 16);
            const availableHeight = Math.max(200, vpHeight - padY - 16);

            const scaleX = availableWidth / sheetWidth;
            const scaleY = availableHeight / sheetHeight;

            // Fit completely within both dimensions; do not upscale beyond 1.0 on load
            const autoScale = Math.min(scaleX, scaleY, 1.0);
            setZoom(Math.max(0.2, autoScale));

            // Ensure viewport scroll is smoothly centered at top
            paperViewport.scrollTop = 0;
            paperViewport.scrollLeft = 0;
        }
    }

    zoomInBtn.addEventListener('click', () => setZoom(currentZoom + 0.1));
    zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - 0.1));
    zoomFitBtn.addEventListener('click', autoFit);

    // Responsive window resize & orientation re-fit
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(autoFit, 100);
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(autoFit, 200);
    });

    // Auto fit initial view on load across layout phases
    autoFit();
    setTimeout(autoFit, 60);
    setTimeout(autoFit, 200);
    setTimeout(autoFit, 500);
    window.addEventListener('load', autoFit);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => setTimeout(autoFit, 50));
    }

    // ==========================================================================
    // Mobile View Navigation (Smooth Scroll between Form & Preview)
    // ==========================================================================

    const workspace = document.querySelector('.workspace');

    function switchMobileTab(target) {
        if (target === 'preview') {
            tabFormBtn?.classList.remove('active');
            tabPreviewBtn?.classList.add('active');
            if (window.innerWidth <= 900) {
                if (workspace && previewArea) {
                    const previewTop = previewArea.offsetTop;
                    workspace.scrollTo({ top: previewTop, behavior: 'smooth' });
                } else {
                    previewArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            requestAnimationFrame(() => {
                autoFit();
                setTimeout(autoFit, 120);
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

    // Initialize fresh preview
    updatePreview();
});
