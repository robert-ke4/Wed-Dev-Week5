# SpendWise – JavaScript Foundation

## What the project does
SpendWise is a budget tracker dashboard that processes user budgeting data using JavaScript. When the user clicks the **Enter Budget Data** button in the dashboard header, SpendWise prompts the user for their total monthly budget as well as their custom spending limit and actual amount spent for each category (Food, Transport, Rent, Entertainment, Savings, Utilities). It warns the user immediately if a category limit or the overall monthly budget is exceeded, calculates totals and remaining balances, and prints a clearly labelled report in the browser console.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Dashboard page structure; links `style.css`, `script.js`, and `Spendwise_Logo.png` |
| `style.css` | Layout (Grid + Flexbox), theme variables, dark mode, responsive rules |
| `script.js` | All JavaScript logic: input prompts, limit validation/warnings, calculations, functions, console output |
| `README.md` | Project documentation and explanation of JavaScript implementation |
| `Spendwise_Logo.png` | Brand logo displayed in the sidebar |

## How to run
1. Keep all files in the same folder and open `index.html` in a browser.
2. Click the **Enter Budget Data** button in the top-right header to launch the input prompts.
3. Enter your total monthly budget, followed by the spending limit and amount spent for each category.
4. Press **F12** (or right-click → Inspect) and open the **Console** tab to view the formatted budget report and any limit warnings.

## JavaScript concepts implemented
- Linking an external script with `<script src="script.js" defer>`
- Variables (`const` and `let`) and data types (string, number, boolean, array, object)
- User input with `prompt()` and limit-exceeded warnings with `alert()`
- Type conversion (`Number()`) and validation (`isNaN()`, negative and empty checks)
- Arithmetic calculations and `Math.round()`
- Loops (`for...of`, `while`) and conditionals (`if / else if / else`)
- Functions with parameters and return values
- Array methods (`map`) and number formatting (`toLocaleString`)
- Console output (`console.log`, `console.table`, `console.warn`)
- Event listeners (manual button `click` trigger)

## How variables are used
- **Fixed values** use `const`: `appName`, `currencySymbol`, `warningThreshold` (80%) and the `categories` array.
- **Changing values** use `let`: `monthlyBudget`, `totalAllocated`, `totalSpent`, `remainingBalance`, and the boolean `inputCancelled`.
- **Category data** is stored as an array of objects, each storing a `name`, a user-defined `limit`, and a `spent` amount collected from user input:
  ```js
  { name: "Food", limit: 600, spent: 0 }
  ```

## How user input is collected
The helper function `askForAmount()` uses `prompt()` to request a numeric value, strips `$`, commas, and spaces, converts the input using `Number()`, and keeps prompting until a valid non-negative number is provided (or returns `null` if the user clicks **Cancel**). When the user clicks **Enter Budget Data**, `collectUserInput()` collects `monthlyBudget` first, then loops through each category to prompt for both `category.limit` and `category.spent`. If `category.spent` exceeds `category.limit`—or if combined category limits exceed `monthlyBudget`—an immediate `alert()` warning is shown.

## How calculations are performed
- **Total category limits** = sum of every category's `limit` (`calculateTotalLimits`)
- **Total spent** = sum of every category's `spent` (`calculateTotalSpent`)
- **Remaining balance** = `monthlyBudget − totalSpent` (`calculateRemaining`). A negative result indicates overspending.
- **Percent used** = `(spent ÷ limit) × 100`, rounded (`calculatePercentUsed`), safely handling a `0` limit to prevent division by zero.
- **Status** is evaluated per category and overall (`getStatus`): exceeding the limit (`spent > limit` or `> 100%`) returns `"OVER LIMIT"`, `80%` or higher returns `"WARNING - nearly used up"`, and below `80%` returns `"On track"`.

## How functions help organize the code
Each function has a single, clear responsibility so the application logic is modular and easy to maintain:

| Function | Job |
|----------|-----|
| `askForAmount()` | Prompt for and validate a positive number |
| `collectUserInput()` | Gather total budget, category limits, and category expenses, and alert if limits are exceeded |
| `calculateTotalLimits()` | Sum all category spending limits |
| `calculateTotalSpent()` | Sum all category expenses |
| `calculateRemaining()` | Subtract spending from budget/limit |
| `calculatePercentUsed()` | Calculate percentage of a limit or budget used |
| `getStatus()` | Convert spending vs. limit into a clear status label |
| `formatCurrency()` | Format numbers as currency, e.g. `$1,200.00` |
| `displayReport()` | Print the formatted summary, category table, and warnings to the console |
| `runSpendWise()` | Main controller function triggered by the **Enter Budget Data** button |

## Sample console output
```
==============================================
        SPENDWISE MONTHLY BUDGET REPORT
==============================================
Total monthly budget   : $2,870.00
Total category limits  : $2,870.00
Total spent            : $2,380.00
Remaining balance      : $490.00
Budget used            : 83%
Overall status         : WARNING - nearly used up
----------------------------------------------
SPENDING BY CATEGORY:
(table with Category, Limit, Spent, Left, % Used, Status)
Great job! You still have $490.00 left to use this month.
```

## Submitting to GitHub
1. Create a new **public** repository on GitHub.
2. Upload the unwrapped project files (`index.html`, `style.css`, `script.js`, `README.md`, and `Spendwise_Logo.png`) directly to the repository root.
3. Copy the public repository URL and submit it through the LMS.
