document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.getElementById('calcModeToggle');
    const ctcInput = document.getElementById('ctcInput');
    
    // Inputs
    const inputs = {
        month: document.getElementById('monthSelect'),
        year: document.getElementById('yearSelect'),
        basic: document.getElementById('basicSalary'),
        lopDays: document.getElementById('lopDays'),
        lopAmount: document.getElementById('lopAmount'),
        pf: document.getElementById('pfAmount'),
        tax: document.getElementById('taxAmount'),
        empName: document.getElementById('empSelect')
    };

    // Preview Elements
    const preview = {
        monthYear: document.getElementById('prevMonthYear'),
        name: document.getElementById('prevName'),
        days: document.getElementById('prevDays'),
        basic: document.getElementById('prevBasic'),
        gross: document.getElementById('prevGross'),
        pf: document.getElementById('prevPf'),
        tax: document.getElementById('prevTax'),
        lop: document.getElementById('prevLop'),
        lopDays: document.getElementById('prevLopDays'),
        net: document.getElementById('prevNet'),
        words: document.getElementById('amountWords')
    };  

    const PF_RATE = 0.12;

    // --- 1. Automatic Date Initialization ---
    function initDates() {
        const today = new Date();
        document.getElementById('systemDate').textContent = today.toDateString(); 

        // Default to Current Month and Year
        const targetMonth = today.getMonth(); // 0-11
        const targetYear = today.getFullYear();

        // Populate Year Dropdown (Last year, This year, Next year)
        inputs.year.innerHTML = '';
        for (let y = targetYear - 1; y <= targetYear + 1; y++) {
            let opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            if(y === targetYear) opt.selected = true;
            inputs.year.appendChild(opt);
        }

        // Populate Month Dropdown
        inputs.month.innerHTML = '';
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthNames.forEach((m, index) => {
            let opt = document.createElement('option');
            opt.value = index; // 0 for Jan
            opt.textContent = m;
            if(index === targetMonth) opt.selected = true;
            inputs.month.appendChild(opt);
        });
    }

    // --- 2. Calculation Logic ---
    function calculateSalary() {
        const selYear = parseInt(inputs.year.value);
        const selMonth = parseInt(inputs.month.value); // 0 = Jan, 1 = Feb

        // --- FIX FOR PAYROLL CYCLE DISPLAY ---
        
        // 1. Determine Previous Month Index
        let prevMonthIndex = selMonth - 1;
        let prevYear = selYear;

        // 2. Handle Year Transition (If current is Jan, prev is Dec of last year)
        if (prevMonthIndex < 0) {
            prevMonthIndex = 11; // December
            prevYear = selYear - 1;
        }

        // 3. Array of Month Names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const prevMonthName = monthNames[prevMonthIndex];
        const currMonthName = monthNames[selMonth];

        // 4. Update Header Text
        // If the cycle crosses a year (Dec -> Jan), show both years.
        if (prevYear !== selYear) {
            preview.monthYear.textContent = `26 ${prevMonthName} ${prevYear} - 25 ${currMonthName} ${selYear}`;
        } else {
            // Otherwise just show the standard format
            preview.monthYear.textContent = `26 ${prevMonthName} - 25 ${currMonthName} ${selYear}`;
        }

        // --- END FIX ---

        // Calculate Days in Payroll Month (approx 30/31)
        const startDate = new Date(prevYear, prevMonthIndex, 26);
        const endDate = new Date(selYear, selMonth, 25);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysInMonth = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include start date


        let basic = 0, pf = 0, tax = 0, lopDays = 0, lopVal = 0, finalBasic = 0;

        lopDays = parseFloat(inputs.lopDays.value) || 0;
        tax = parseFloat(inputs.tax.value) || 0;

        // Auto vs Manual Mode
        if (toggle.checked) {
            const annualCTC = parseFloat(ctcInput.value) || 0;
            const monthlyCTC = annualCTC / 12;

            basic = monthlyCTC;

            // LOP Calculation
            if (basic > 0) {
                let perDaySalary = basic / daysInMonth;
                lopVal = perDaySalary * lopDays;
            }

            finalBasic = basic - lopVal;
            pf = finalBasic * PF_RATE;

            inputs.basic.value = basic.toFixed(2);
            inputs.pf.value = pf.toFixed(2);

        } else {
            basic = parseFloat(inputs.basic.value) || 0;
            pf = parseFloat(inputs.pf.value) || 0;

            if (basic > 0) {
                let perDaySalary = basic / daysInMonth;
                lopVal = perDaySalary * lopDays;
            }

            finalBasic = basic - lopVal;
        }

        inputs.lopAmount.value = lopVal.toFixed(2);

        // Final Salary Calculation
        let gross = finalBasic;
        let totalDeductions = pf + tax;
        let net = gross - totalDeductions;

        if (net < 0) net = 0;

        updateUI(basic, gross, pf, tax, lopDays, lopVal, net, daysInMonth);
    }

    function updateUI(basic, gross, pf, tax, lopDays, lopVal, net, totalDays) {
        if(preview.basic) preview.basic.textContent = formatINR(basic);
        if(preview.gross) preview.gross.textContent = formatINR(gross);
        if(preview.pf) preview.pf.textContent = "-" + formatINR(pf);
        if(preview.tax) preview.tax.textContent = "-" + formatINR(tax);
        if(preview.lopDays) preview.lopDays.textContent = lopDays;
        if(preview.lop) preview.lop.textContent = "-" + formatINR(lopVal);
        
        // Days Paid
        if(preview.days) preview.days.textContent = Math.max(0, totalDays - lopDays);

        if(preview.net) preview.net.textContent = formatINR(net);
        if(preview.words) preview.words.textContent = net > 0 ? convertNumberToWords(Math.round(net)) + " Only" : "Zero Only";
    }

    // --- Helpers ---
    function formatINR(amount) {
        return "₹" + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function convertNumberToWords(amount) {
        if (amount === 0) return "Zero";
        return "Amount in Words"; 
        // You can add a library here for full Indian numbering text conversion
    }

    // --- Listeners ---
    if(toggle) {
        toggle.addEventListener('change', () => {
            const grp = document.getElementById('ctcGroup');
            const lbl = document.getElementById('modeLabel');
            if(toggle.checked) {
                if(lbl) lbl.textContent = "Auto-Calculate (CTC)";
                if(grp) grp.style.display = "block";
                inputs.basic.readOnly = true;
                inputs.pf.readOnly = true;
            } else {
                if(lbl) lbl.textContent = "Manual Entry";
                if(grp) grp.style.display = "none";
                inputs.basic.readOnly = false;
                inputs.pf.readOnly = false;
            }
            calculateSalary();
        });
    }

    [ctcInput, inputs.month, inputs.year, inputs.basic, inputs.lopDays, inputs.pf, inputs.tax].forEach(el => {
        if(el) {
            el.addEventListener('input', calculateSalary);
            el.addEventListener('change', calculateSalary);
        }
    });

    if(inputs.empName) {
        inputs.empName.addEventListener('change', () => {
            const selectedText = inputs.empName.options[inputs.empName.selectedIndex].text;
            // Assuming format is "Name (ID)", split to get just name
            if(preview.name) preview.name.textContent = selectedText.split('(')[0].trim();
        });
    }

    window.resetForm = function() {
        initDates();
        if(toggle) toggle.checked = true;
        if(ctcInput) ctcInput.value = 420000;
        if(inputs.lopDays) inputs.lopDays.value = 0;
        if(inputs.basic) inputs.basic.readOnly = true;
        calculateSalary();
    }
    
    window.sendPayslip = function() {
        const btn = document.querySelector('.btn-primary');
        const old = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        setTimeout(() => { alert("Payslip Sent!"); btn.innerHTML = old; }, 1000);
    }

    // Initialization
    initDates();
    calculateSalary();
});