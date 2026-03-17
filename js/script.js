// Initialize the app securely to ensure compatibility and prevent script loading issues
function initApp() {
    // 1. Theme Toggle (Dark/Light Mode)
    var themeBtn = document.getElementById('theme-toggle');
    var root = document.documentElement;

    if (themeBtn && root) {
        var isDark = false;
        try {
            isDark = localStorage.getItem('theme') === 'dark';
        } catch (e) {
            console.warn('localStorage not available', e);
        }
        
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeBtn.onclick = function() {
            var currentTheme = root.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                root.removeAttribute('data-theme');
                try { localStorage.setItem('theme', 'light'); } catch(e){}
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                root.setAttribute('data-theme', 'dark');
                try { localStorage.setItem('theme', 'dark'); } catch(e){}
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        };
    }

    // 2. Navigation Logic (Bulletproof)
    var navLinks = document.querySelectorAll('.nav-links li');
    var sections = document.querySelectorAll('.page-section');
    
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].onclick = function() {
            // Remove active class from all links
            for (var j = 0; j < navLinks.length; j++) {
                navLinks[j].className = navLinks[j].className.replace('active', '').trim();
            }
            // Remove active class from all sections
            for (var k = 0; k < sections.length; k++) {
                sections[k].className = sections[k].className.replace('active', '').trim();
            }
            
            // Add active to the clicked link
            if (this.className.indexOf('active') === -1) {
                this.className += ' active';
            }
            
            // Add active to the corresponding section
            var targetId = this.getAttribute('data-target');
            if (targetId) {
                var targetSection = document.getElementById(targetId);
                if (targetSection && targetSection.className.indexOf('active') === -1) {
                    targetSection.className += ' active';
                }
            }
        };
    }

    // 3. Notices Section - Dropdown logic
    var recipientSelect = document.getElementById('notice-recipient');
    var classSelector = document.getElementById('class-selector');
    
    if (recipientSelect && classSelector) {
        recipientSelect.onchange = function(e) {
            if (e.target.value === 'class_wise') {
                classSelector.style.display = 'block';
            } else {
                classSelector.style.display = 'none';
            }
        };
    }

    // 4. Logo Upload Preview
    var logoUpload = document.getElementById('logo-upload');
    var sidebarLogo = document.getElementById('sidebar-logo');
    
    if (logoUpload && sidebarLogo) {
        logoUpload.onchange = function(e) {
            var file = e.target.files ? e.target.files[0] : null;
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    sidebarLogo.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // 5. Dynamic Marks Calculation for Interview Board
    initializeMarksCalculation();

    // 6. Initialize Flatpickr for Date Inputs
    if (typeof flatpickr !== 'undefined') {
        flatpickr("input[type='date']", {
            dateFormat: "Y-m-d",
            allowInput: false // Prevents manual typing errors
        });
    }
}

// Ensure the code runs regardless of when the script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Function to add a generic row to tables
function addRow(btn) {
    if (!btn || !btn.previousElementSibling) return;
    var tableBody = btn.previousElementSibling.querySelector('tbody');
    if (!tableBody) return;
    var firstRow = tableBody.querySelector('tr');
    
    if (firstRow) {
        var clonedRow = firstRow.cloneNode(true);
        // Clear inputs in cloned row
        var inputs = clonedRow.querySelectorAll('input:not([type="checkbox"])');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
        var checkboxes = clonedRow.querySelectorAll('input[type="checkbox"]');
        for (var j = 0; j < checkboxes.length; j++) {
            checkboxes[j].checked = false;
        }
        var totalBadges = clonedRow.querySelectorAll('.badge');
        for (var k = 0; k < totalBadges.length; k++) {
            totalBadges[k].innerHTML = '0';
        }

        tableBody.appendChild(clonedRow);
        
        // Re-initialize mark calculation listeners if it's the marks table
        if (btn.previousElementSibling.className.indexOf('marks-table') !== -1) {
            initializeMarksCalculation();
        }
        
        // Re-initialize flatpickr on new date inputs if any
        if (typeof flatpickr !== 'undefined') {
            var newDateInputs = clonedRow.querySelectorAll('input[type="date"]');
            if (newDateInputs.length > 0) {
                flatpickr(newDateInputs, {
                    dateFormat: "Y-m-d",
                    allowInput: false
                });
            }
        }
    }
}

// SMS / WhatsApp Mock Actions
// SMS / WhatsApp Mock Actions
function sendAbsenceSMS(btn) {
    if (!btn) return;
    
    // Fallback for closest('tr')
    var row = btn.parentNode;
    while (row && row.tagName !== 'TR') {
        row = row.parentNode;
    }
    
    if (!row) return;
    
    var nameInput = row.querySelector('td:nth-child(1) input');
    var name = nameInput ? (nameInput.value || "සිසුවා") : "සිසුවා";
    alert("[WhatsApp / SMS Mock Sent] " + name + " අද දින දහම් පාසලට නොපැමිණි බව කරුණාවෙන් දන්වමු.");
}

function generatePDF() {
    alert("Generating English PDF Report...\n\n[In production, this will download a physical .pdf file using jsPDF library based on the class metrics.]");
}

function calculateRowTotal(row) {
    if (!row) return;
    var marksInputs = row.querySelectorAll('.mark-input');
    var total = 0;
    for (var i = 0; i < marksInputs.length; i++) {
        var val = parseInt(marksInputs[i].value) || 0;
        total += val;
    }
    var totalBadge = row.querySelector('.total-marks .badge');
    if (totalBadge) {
        totalBadge.innerHTML = total.toString();
        // Optional color logic
        if (total >= 75) {
            totalBadge.className = 'badge badge-success';
        } else if (total >= 50) {
            totalBadge.className = 'badge bg-warning text-dark';
        } else {
            totalBadge.className = 'badge bg-danger';
        }
    }
}

function initializeMarksCalculation() {
    var markInputs = document.querySelectorAll('.marks-table .mark-input');
    for (var i = 0; i < markInputs.length; i++) {
        // Remove existing listener to prevent duplicates on clone
        markInputs[i].removeEventListener('input', markInputHandler);
        markInputs[i].addEventListener('input', markInputHandler);
    }
}

function markInputHandler(e) {
    // Validate max amount dynamically based on placeholder or max attribute
    var target = e.target || e.srcElement;
    var maxAttr = target.getAttribute('max');
    var max = maxAttr ? parseInt(maxAttr) : 10;
    
    if (target.value > max) target.value = max;
    if (target.value < 0) target.value = 0;
    
    var row = target.parentNode;
    while (row && row.tagName !== 'TR') {
        row = row.parentNode;
    }
    
    if (row) {
        calculateRowTotal(row);
    }
}

// Function to remove a row from tables
function removeRow(btn) {
    if (!btn) return;
    
    var row = btn.parentNode;
    while (row && row.tagName !== 'TR') {
        row = row.parentNode;
    }
    
    if (row && row.parentNode) {
        var tbody = row.parentNode;
        // Keep at least one row in the table
        if (tbody.querySelectorAll('tr').length > 1) {
            tbody.removeChild(row);
        } else {
            // If it's the last row, just clear its inputs instead of deleting it
            var inputs = row.querySelectorAll('input:not([type="checkbox"])');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].value = '';
            }
            var checkboxes = row.querySelectorAll('input[type="checkbox"]');
            for (var j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checked = false;
            }
            var totalBadges = row.querySelectorAll('.badge');
            for (var k = 0; k < totalBadges.length; k++) {
                totalBadges[k].innerHTML = '0';
            }
            if (row.parentNode.parentNode.className.indexOf('marks-table') !== -1) {
                calculateRowTotal(row);
            }
        }
    }
}
