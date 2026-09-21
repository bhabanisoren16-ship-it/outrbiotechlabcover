/* ==========================================================================
   OUTR LAB COVER GENERATOR - JAVASCRIPT ENGINE
   Real-time Preview, Presets, Image Upload & PDF/PNG Export
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
    const submittedToInput = document.getElementById('submittedToInput');
    const departmentInput = document.getElementById('departmentInput');
    const universityInput = document.getElementById('universityInput');
    const addressInput = document.getElementById('addressInput');
    const borderStyleSelect = document.getElementById('borderStyleSelect');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const logoScaleInput = document.getElementById('logoScaleInput');
    const logoUploadInput = document.getElementById('logoUploadInput');
    const resetLogoBtn = document.getElementById('resetLogoBtn');

    // DOM Elements - Preview Canvas
    const coverSheet = document.getElementById('coverSheet');
    const pageBorder = document.getElementById('pageBorder');
    const prevLabName = document.getElementById('prevLabName');
    const prevDocType = document.getElementById('prevDocType');
    const prevDegreeBranch = document.getElementById('prevDegreeBranch');
    const prevSemester = document.getElementById('prevSemester');
    const prevSubmittedByLabel = document.getElementById('prevSubmittedByLabel');
    const prevStudentNameVal = document.getElementById('prevStudentNameVal');
    const prevRegNoVal = document.getElementById('prevRegNoVal');
    const prevGroupVal = document.getElementById('prevGroupVal');
    const prevSectionVal = document.getElementById('prevSectionVal');
    const prevSubmittedToVal = document.getElementById('prevSubmittedToVal');
    const prevSectionRow = document.getElementById('prevSectionRow');
    const prevSubmittedToRow = document.getElementById('prevSubmittedToRow');
    const prevLogo = document.getElementById('prevLogo');
    const prevDepartment = document.getElementById('prevDepartment');
    const prevUniversity = document.getElementById('prevUniversity');
    const prevAddress = document.getElementById('prevAddress');

    // Action Buttons
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const printBtn = document.getElementById('printBtn');
    const resetBtn = document.getElementById('resetBtn');
    const toast = document.getElementById('toast');

    // Zoom Controls & Responsive Elements
    const paperViewport = document.getElementById('paperViewport');
    const sheetWrapper = document.getElementById('sheetWrapper');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomFitBtn = document.getElementById('zoomFitBtn');
    const zoomLevelEl = document.getElementById('zoomLevel');
    const tabFormBtn = document.getElementById('tabFormBtn');
    const tabPreviewBtn = document.getElementById('tabPreviewBtn');
    const mobilePreviewSwitchBtn = document.getElementById('mobilePreviewSwitchBtn');
    const mobileBackToFormBtn = document.getElementById('mobileBackToFormBtn');
    const mobileDownloadPdfBtn = document.getElementById('mobileDownloadPdfBtn');
    const sidebar = document.getElementById('sidebar');
    const previewArea = document.getElementById('previewArea');

    let currentZoom = 1.0;
    const DEFAULT_LOGO_SRC = 'assets/outr-logo.png';

    // Presets Database
    const PRESETS = {
        photo: {
            labName: 'BIOCHEMISTRY LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH BIOTECHNOLOGY',
            semester: '3RD SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'BIOTECHNOLOGY',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        },
        cse: {
            labName: 'DATA STRUCTURES & ALGORITHMS LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH COMPUTER SCIENCE & ENGINEERING',
            semester: '3RD SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'COMPUTER SCIENCE & ENGINEERING',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        },
        mech: {
            labName: 'FLUID MECHANICS LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH MECHANICAL ENGINEERING',
            semester: '4TH SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'MECHANICAL ENGINEERING',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        },
        ee: {
            labName: 'POWER ELECTRONICS LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH ELECTRICAL ENGINEERING',
            semester: '5TH SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'ELECTRICAL ENGINEERING',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        },
        civil: {
            labName: 'GEOTECHNICAL ENGINEERING LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH CIVIL ENGINEERING',
            semester: '5TH SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'CIVIL ENGINEERING',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        },
        it: {
            labName: 'DATABASE MANAGEMENT SYSTEMS LAB',
            docType: 'LAB RECORD',
            degreeBranch: 'B.TECH INFORMATION TECHNOLOGY',
            semester: '4TH SEMESTER',
            submittedByLabel: 'SUBMITTED BY :',
            studentName: '',
            regNo: '',
            group: '',
            section: '',
            submittedTo: '',
            department: 'INFORMATION TECHNOLOGY',
            university: 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH',
            address: 'Techno Campus, Ghatikia, Bhubaneswar, 751029'
        }
    };

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

        const subToVal = submittedToInput.value.trim();
        if (subToVal) {
            const cleanSubTo = subToVal.replace(/^SUBMITTED\s+TO\s*[-:]?\s*/i, '').trim();
            if (prevSubmittedToVal) prevSubmittedToVal.textContent = cleanSubTo;
            prevSubmittedToRow?.classList.remove('hidden');
        } else {
            prevSubmittedToRow?.classList.add('hidden');
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

        // Sync Styling
        pageBorder.className = `page-border ${borderStyleSelect.value}`;
        coverSheet.style.fontFamily = fontFamilySelect.value;
        
        const logoSize = parseInt(logoScaleInput.value, 10) || 240;
        prevLogo.style.setProperty('width', `${logoSize}px`, 'important');
        prevLogo.style.setProperty('height', `${logoSize}px`, 'important');
        prevLogo.style.setProperty('max-width', `${logoSize}px`, 'important');
        prevLogo.style.setProperty('max-height', `${logoSize}px`, 'important');
    }

    // Attach Input Event Listeners
    const inputs = [
        labNameInput, docTypeInput, degreeBranchInput, semesterInput,
        submittedByLabelInput, studentNameInput, regNoInput, groupInput, sectionInput,
        submittedToInput, departmentInput, universityInput, addressInput,
        borderStyleSelect, fontFamilySelect, logoScaleInput
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

    // Custom Logo Upload Handler
    logoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                prevLogo.src = event.target.result;
                document.getElementById('logoUploadStatus').innerHTML = `<i class="fa-solid fa-check"></i> ${file.name}`;
                showToast('Custom logo uploaded!');
            };
            reader.readAsDataURL(file);
        }
    });

    resetLogoBtn.addEventListener('click', () => {
        prevLogo.src = DEFAULT_LOGO_SRC;
        logoUploadInput.value = '';
        document.getElementById('logoUploadStatus').innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Upload custom logo`;
        showToast('Logo reset to default OUTR seal!');
    });

    // ==========================================================================
    // Presets & Form Management
    // ==========================================================================

    function applyPreset(presetKey) {
        const preset = PRESETS[presetKey];
        if (!preset) return;

        labNameInput.value = preset.labName;
        docTypeInput.value = preset.docType;
        degreeBranchInput.value = preset.degreeBranch.replace(/^B\.?\s*TECH\s*/i, '').trim();
        if (preset.semester) {
            let opt = Array.from(semesterInput.options).find(o => o.value.toUpperCase() === preset.semester.toUpperCase());
            if (!opt) {
                opt = new Option(preset.semester, preset.semester);
                semesterInput.add(opt);
            }
            semesterInput.value = opt.value;
        }
        submittedByLabelInput.value = preset.submittedByLabel || 'SUBMITTED BY :';
        if (preset.studentName) studentNameInput.value = preset.studentName;
        if (preset.regNo) regNoInput.value = preset.regNo;
        if (preset.group) groupInput.value = preset.group;
        if (preset.section) sectionInput.value = preset.section;
        submittedToInput.value = preset.submittedTo || '';
        departmentInput.value = preset.department;
        departmentEditedManually = true;
        universityInput.value = preset.university;
        addressInput.value = preset.address;

        // Update active chip UI
        document.querySelectorAll('.preset-chips .chip').forEach(chip => {
            if (chip.getAttribute('data-preset') === presetKey) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        updatePreview();
        showToast(`Applied ${presetKey.toUpperCase()} Preset`);
    }

    document.querySelectorAll('.preset-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const key = chip.getAttribute('data-preset');
            applyPreset(key);
        });
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
        submittedToInput.value = '';
        departmentInput.value = '';
        departmentEditedManually = false;
        universityInput.value = 'ODISHA UNIVERSITY OF TECHNOLOGY AND RESEARCH';
        addressInput.value = 'Techno Campus, Ghatikia, Bhubaneswar, 751029';
        
        updatePreview();
        showToast('Form reset to blank');
    });

    // ==========================================================================
    // Zoom Controls & Responsive Auto-Fit
    // ==========================================================================

    function setZoom(scale) {
        // Expand zoom bounds to support mobile screen widths down to 320px
        currentZoom = Math.min(Math.max(0.2, scale), 1.8);
        coverSheet.style.transform = `scale(${currentZoom})`;
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
    mobilePreviewSwitchBtn?.addEventListener('click', () => switchMobileTab('preview'));
    mobileBackToFormBtn?.addEventListener('click', () => switchMobileTab('form'));
    mobileDownloadPdfBtn?.addEventListener('click', () => downloadPdfBtn.click());

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
        submittedToInput.value = '';
        
        // Reset logo if custom logo was uploaded
        prevLogo.src = DEFAULT_LOGO_SRC;
        logoUploadInput.value = '';
        const uploadStatusEl = document.getElementById('logoUploadStatus');
        if (uploadStatusEl) {
            uploadStatusEl.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Upload custom logo`;
        }

        // Clear local storage data for privacy so details aren't shared
        localStorage.removeItem('outr_cover_data');
        
        // Refresh preview
        updatePreview();
    }

    async function generateA4Canvas(customScale) {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Determine optimal scale:
        // Desktop: 3x integer scaling (~300 DPI - standard high-definition academic print quality)
        // Mobile: 2.2x scaling (~215 DPI - ultra-crisp on phones/tablets, 75% faster rendering)
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const exportScale = customScale || (isMobile ? 2.2 : 3.0);

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
                const chromeSelectors = ['.app-header', '.mobile-nav-bar', '.sidebar', '.preview-toolbar', '.toast', '.mobile-bottom-bar', 'button'];
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
                    clonedViewport.style.padding = '0';
                    clonedViewport.style.margin = '0';
                    clonedViewport.style.width = '794px';
                    clonedViewport.style.height = '1123px';
                    clonedViewport.style.overflow = 'visible';
                    clonedViewport.style.transform = 'none';
                }

                const clonedWrapper = clonedDoc.getElementById('sheetWrapper');
                if (clonedWrapper) {
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

    downloadPdfBtn.addEventListener('click', async () => {
        downloadPdfBtn.blur();
        downloadPdfBtn.disabled = true;
        const originalPdfHtml = downloadPdfBtn.innerHTML;
        downloadPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Downloading...</span>';

        // Yield to browser UI thread so the spinner paints immediately
        await new Promise(resolve => setTimeout(resolve, 25));

        const labFileName = (labNameInput.value.trim() || 'OUTR_Lab').replace(/[^a-zA-Z0-9]/g, '_');

        try {
            const canvas = await generateA4Canvas();

            // High-fidelity JPEG (quality 0.96) with SIMD acceleration for instant PDF creation
            // Maintains 100% crisp typography and logo clarity without 4-second PNG serialization freeze
            const imgData = canvas.toDataURL('image/jpeg', 0.96);
            const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
            const pdf = new jsPdfConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true,
                floatPrecision: 16
            });

            // Fast, crystal-clear 1-page A4 PDF embedding (210mm x 297mm)
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
            pdf.save(`${labFileName}_Cover_Page.pdf`);

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

        // Yield to browser UI thread so the spinner paints immediately
        await new Promise(resolve => setTimeout(resolve, 25));

        const labFileName = (labNameInput.value.trim() || 'OUTR_Lab').replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${labFileName}_Cover_Page.png`;

        try {
            const canvas = await generateA4Canvas();

            // Native Blob streaming for lossless high-definition PNG
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

    // ==========================================================================
    // Helpers & Local Storage
    // ==========================================================================

    function showToast(message) {
        // Pop-ups completely disabled for seamless, uninterrupted user experience
        return;
    }

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
