document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const toggle = document.getElementById('calcModeToggle');
    const modeLabel = document.getElementById('modeLabel');
    const ctcGroup = document.getElementById('ctcGroup');
    const ctcInput = document.getElementById('ctcInput');
    
    // Inputs
    const inputs = {
        basic: document.getElementById('basicSalary'),
        lopDays: document.getElementById('lopDays'),
        lopAmount: document.getElementById('lopAmount'),
        pf: document.getElementById('pfAmount'),
        tax: document.getElementById('taxAmount'),
        empName: document.getElementById('empSelect')
    };

    // Preview Elements
    const preview = {
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

    // Constants
    const PF_RATE = 0.12; // 12%
    const DAYS_IN_MONTH = 30; // Standard calc base

    // --- 1. Toggle Mode ---
    toggle.addEventListener('change', () => {
        if(toggle.checked) {
            modeLabel.textContent = "Auto-Calculate (CTC)";
            ctcGroup.style.display = "block";
            // Make fields read-only in Auto mode to prevent conflict
            inputs.basic.readOnly = true;
            inputs.pf.readOnly = true;
            calculateSalary();
        } else {
            modeLabel.textContent = "Manual Entry";
            ctcGroup.style.display = "none";
            // Enable fields for manual typing
            inputs.basic.readOnly = false;
            inputs.pf.readOnly = false;
        }
    });

    // --- 2. Live Listeners ---
    ctcInput.addEventListener('input', calculateSalary);
    inputs.lopDays.addEventListener('input', calculateSalary);
    
    // Listen to manual inputs too (only affects calculation if in Manual Mode)
    Object.values(inputs).forEach(inp => inp.addEventListener('input', calculateSalary));

    inputs.empName.addEventListener('change', () => {
        preview.name.textContent = inputs.empName.options[inputs.empName.selectedIndex].text.split('(')[0].trim();
    });

    // --- 3. Main Logic ---
    function calculateSalary() {
        let basic = 0, pf = 0, tax = 0, lopDays = 0, lopVal = 0;

        // AUTO MODE
        if(toggle.checked) {
            const annualCTC = parseFloat(ctcInput.value) || 0;
            const monthlyCTC = annualCTC / 12;

            // In this strict view, Basic Salary = Total Monthly CTC
            // (Since all other allowances were removed)
            basic = monthlyCTC;

            // PF is 12% of Basic
            pf = basic * PF_RATE;

            // Update Input Fields visually
            inputs.basic.value = basic.toFixed(2);
            inputs.pf.value = pf.toFixed(2);
        } 
        // MANUAL MODE
        else {
            basic = parseFloat(inputs.basic.value) || 0;
            pf = parseFloat(inputs.pf.value) || 0;
        }

        // Common Calculations (LOP & Tax)
        lopDays = parseInt(inputs.lopDays.value) || 0;
        tax = parseFloat(inputs.tax.value) || 0;

        // LOP Calculation: (Basic Salary / 30) * Days
        if(basic > 0) {
            let perDaySalary = basic / DAYS_IN_MONTH;
            lopVal = perDaySalary * lopDays;
        }
        inputs.lopAmount.value = lopVal.toFixed(2);

        // Final Math
        let gross = basic; // Gross is just Basic now since allowance removed
        let totalDeductions = pf + tax + lopVal;
        let net = gross - totalDeductions;

        // Prevent negative salary
        if(net < 0) net = 0;

        // Update Preview
        updateUI(basic, gross, pf, tax, lopDays, lopVal, net);
    }

    function updateUI(basic, gross, pf, tax, lopDays, lopVal, net) {
        preview.basic.textContent = formatINR(basic);
        preview.gross.textContent = formatINR(gross);
        
        preview.pf.textContent = "-" + formatINR(pf);
        preview.tax.textContent = "-" + formatINR(tax);
        
        preview.lopDays.textContent = lopDays;
        preview.lop.textContent = "-" + formatINR(lopVal);
        
        // Days Worked
        preview.days.textContent = Math.max(0, DAYS_IN_MONTH - lopDays);

        preview.net.textContent = formatINR(net);
        // Round net for word conversion
        preview.words.textContent = net > 0 ? convertNumberToWords(Math.round(net)) + " Only" : "Zero Only";
    }

    // --- Utility: Format Currency ---
    function formatINR(amount) {
        return "₹" + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- Utility: Number to Words ---
    function convertNumberToWords(amount) {
        const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        if(amount < 20) return words[amount];
        if(amount < 100) return tens[Math.floor(amount/10)] + (amount%10? " " + words[amount%10]: "");
        if(amount < 1000) return words[Math.floor(amount/100)] + " Hundred" + (amount%100? " and " + convertNumberToWords(amount%100): "");
        if(amount < 100000) return convertNumberToWords(Math.floor(amount/1000)) + " Thousand" + (amount%1000? " " + convertNumberToWords(amount%1000): "");
        if(amount < 10000000) return convertNumberToWords(Math.floor(amount/100000)) + " Lakh" + (amount%100000? " " + convertNumberToWords(amount%100000): "");
        
        return "Amount too large";
    }

    // Global Functions
    window.resetForm = function() {
        toggle.checked = true;
        ctcInput.value = 600000;
        inputs.lopDays.value = 0;
        modeLabel.textContent = "Auto-Calculate (CTC)";
        ctcGroup.style.display = "block";
        inputs.basic.readOnly = true;
        calculateSalary();
    }
    
    window.sendPayslip = function() {
        const btn = document.querySelector('.btn-primary');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        setTimeout(() => {
            alert("Payslip Generated & Sent Successfully!");
            btn.innerHTML = originalHTML;
        }, 1500);
    }

    // Init
    calculateSalary();
});