/* ==========================================================================
   SpendWise - JavaScript Foundation
   Collects budget, category limits, and expense data via user prompts,
   warns when limits are exceeded, calculates remaining balances, and prints
   a clearly labelled report in the browser console.
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. VARIABLES: key budgeting data (const for fixed values, let for values
//    that change while the program runs)
// --------------------------------------------------------------------------
const appName = "SpendWise";                 // string
const currencySymbol = "$";                  // string
const warningThreshold = 80;                 // number: % used before we warn

// Array of objects: each category has a name, a monthly spending limit,
// and a spent amount. Both limit and spent are updated from user input.
const categories = [
    { name: "Food",          limit: 600,  spent: 0 },
    { name: "Transport",     limit: 200,  spent: 0 },
    { name: "Rent",          limit: 1200, spent: 0 },
    { name: "Entertainment", limit: 150,  spent: 0 },
    { name: "Savings",       limit: 500,  spent: 0 },
    { name: "Utilities",     limit: 220,  spent: 0 }
];

let monthlyBudget = 0;      // number: total budget entered by the user
let totalAllocated = 0;     // number: sum of all category limits
let totalSpent = 0;         // number: sum of all expenses
let remainingBalance = 0;   // number: monthlyBudget - totalSpent
let inputCancelled = false; // boolean: true if the user presses Cancel

// --------------------------------------------------------------------------
// 2. FUNCTIONS: user input
// --------------------------------------------------------------------------

/**
 * Asks the user for a number using prompt() and keeps asking until the
 * answer is valid. Returns the number, or null if the user cancels.
 */
function askForAmount(message, defaultValue) {
    while (true) {
        const answer = prompt(message, defaultValue);

        if (answer === null) {
            return null;                              // user pressed Cancel
        }

        // Remove spaces, $ signs and commas so "$1,200" still works
        const cleaned = answer.replace(/[$,\s]/g, "");
        const amount = Number(cleaned);

        if (cleaned === "" || isNaN(amount) || amount < 0) {
            alert("Please enter a valid positive number, e.g. 250");
        } else {
            return amount;
        }
    }
}

/** Collects the total monthly budget, category limits, and category expenses. */
function collectUserInput() {
    inputCancelled = false;

    // 1. Collect total monthly budget
    const budgetAnswer = askForAmount(
        `${appName}: Enter your TOTAL monthly budget (${currencySymbol}):`,
        "2870"
    );
    if (budgetAnswer === null) {
        inputCancelled = true;
        return;
    }
    monthlyBudget = budgetAnswer;

    // 2. Collect spending limit and actual amount spent for each category
    for (const category of categories) {
        const limitAnswer = askForAmount(
            `${appName}: Set your monthly spending LIMIT for ${category.name} (${currencySymbol}):`,
            String(category.limit)
        );
        if (limitAnswer === null) {
            inputCancelled = true;
            return;
        }
        category.limit = limitAnswer;

        const spentAnswer = askForAmount(
            `${appName}: How much have you SPENT on ${category.name} this month? (${currencySymbol})\n` +
            `Your ${category.name} limit: ${formatCurrency(category.limit)}`,
            "0"
        );
        if (spentAnswer === null) {
            inputCancelled = true;
            return;
        }
        category.spent = spentAnswer;

        // Immediate warning if this category's spending exceeds its limit
        if (category.spent > category.limit) {
            const overBy = formatCurrency(category.spent - category.limit);
            alert(
                `Warning: Your ${category.name} spending (${formatCurrency(category.spent)}) ` +
                `exceeds your ${category.name} limit (${formatCurrency(category.limit)}) by ${overBy}!`
            );
        }
    }

    // 3. Check if total category limits exceed the overall monthly budget
    totalAllocated = calculateTotalLimits(categories);
    if (totalAllocated > monthlyBudget) {
        const overAllocated = formatCurrency(totalAllocated - monthlyBudget);
        alert(
            `Budget Warning: Your combined category limits (${formatCurrency(totalAllocated)}) ` +
            `exceed your total monthly budget (${formatCurrency(monthlyBudget)}) by ${overAllocated}.`
        );
    }
}

// --------------------------------------------------------------------------
// 3. FUNCTIONS: budget calculations (reusable, each does one job)
// --------------------------------------------------------------------------

/** Adds up the spending limits of every category. */
function calculateTotalLimits(categoryList) {
    let total = 0;
    for (const category of categoryList) {
        total += category.limit;
    }
    return total;
}

/** Adds up the spent amount of every category. */
function calculateTotalSpent(categoryList) {
    let total = 0;
    for (const category of categoryList) {
        total += category.spent;
    }
    return total;
}

/** Remaining balance = budget (or limit) minus spending (can be negative). */
function calculateRemaining(budget, spent) {
    return budget - spent;
}

/** Percentage of a limit (or budget) that has been used, rounded. */
function calculatePercentUsed(spent, limit) {
    if (limit === 0) {
        return spent > 0 ? 100 : 0;                   // avoid dividing by zero
    }
    return Math.round((spent / limit) * 100);
}

/** Turns a percentage into a simple status message. */
function getStatus(percentUsed, spent = 0, limit = 0) {
    if (spent > limit || percentUsed > 100) {
        return "OVER LIMIT";
    } else if (percentUsed >= warningThreshold) {
        return "WARNING - nearly used up";
    } else {
        return "On track";
    }
}

/** Formats a number as money, e.g. 1200 -> "$1,200.00". */
function formatCurrency(amount) {
    const sign = amount < 0 ? "-" : "";
    return sign + currencySymbol + Math.abs(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// --------------------------------------------------------------------------
// 4. FUNCTIONS: display results in the console
// --------------------------------------------------------------------------

function displayReport() {
    const budgetPercent = calculatePercentUsed(totalSpent, monthlyBudget);

    console.log("==============================================");
    console.log(`        ${appName.toUpperCase()} MONTHLY BUDGET REPORT`);
    console.log("==============================================");
    console.log("Total monthly budget   : " + formatCurrency(monthlyBudget));
    console.log("Total category limits  : " + formatCurrency(totalAllocated));
    console.log("Total spent            : " + formatCurrency(totalSpent));
    console.log("Remaining balance      : " + formatCurrency(remainingBalance));
    console.log("Budget used            : " + budgetPercent + "%");
    console.log("Overall status         : " + getStatus(budgetPercent, totalSpent, monthlyBudget));
    console.log("----------------------------------------------");

    if (totalAllocated > monthlyBudget) {
        console.warn(
            "ALLOCATION WARNING: Combined category limits (" + formatCurrency(totalAllocated) +
            ") exceed your total monthly budget (" + formatCurrency(monthlyBudget) + ")."
        );
    }

    console.log("SPENDING BY CATEGORY:");

    // Build one row per category for console.table()
    const rows = categories.map(function (category) {
        const percent = calculatePercentUsed(category.spent, category.limit);
        return {
            Category: category.name,
            Limit: formatCurrency(category.limit),
            Spent: formatCurrency(category.spent),
            Left: formatCurrency(calculateRemaining(category.limit, category.spent)),
            "% Used": percent + "%",
            Status: getStatus(percent, category.spent, category.limit)
        };
    });
    console.table(rows);

    // Log explicit warnings for any category that exceeded its limit
    for (const category of categories) {
        if (category.spent > category.limit) {
            console.warn(
                `LIMIT EXCEEDED [${category.name}]: Spent ${formatCurrency(category.spent)} ` +
                `against a limit of ${formatCurrency(category.limit)} ` +
                `(over by ${formatCurrency(category.spent - category.limit)}).`
            );
        }
    }

    // Friendly final message based on the overall remaining balance
    if (remainingBalance < 0 || totalSpent > monthlyBudget) {
        console.warn("You have overspent your total monthly budget by " + formatCurrency(Math.abs(remainingBalance)) + ". Review your expenses.");
    } else {
        console.log("Great job! You still have " + formatCurrency(remainingBalance) + " left to use this month.");
    }
}

// --------------------------------------------------------------------------
// 5. MAIN FUNCTION: ties everything together
// --------------------------------------------------------------------------
function runSpendWise() {
    collectUserInput();

    if (inputCancelled) {
        console.log(appName + ": Input cancelled. Click \"Enter Budget Data\" to try again.");
        return;
    }

    totalSpent = calculateTotalSpent(categories);
    remainingBalance = calculateRemaining(monthlyBudget, totalSpent);
    displayReport();
}

// --------------------------------------------------------------------------
// 6. START THE PROGRAM (Manual trigger on the "Enter Budget Data" button)
// --------------------------------------------------------------------------
console.log(appName + ' script loaded successfully. Click "Enter Budget Data" to start.');

const runButton = document.getElementById("run-budget");
if (runButton) {
    runButton.addEventListener("click", runSpendWise);
}
