document.addEventListener('DOMContentLoaded', () => {
    const addIngredientBtn = document.getElementById('add-ingredient');
    const ingredientsDiv = document.getElementById('ingredients');
    const calculateBtn = document.getElementById('calculate-btn');
    const newRecipeDiv = document.getElementById('new-recipe');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');

    // Translations
    const translations = {
        it: {
            'app-title': 'Bliss Point Calculator',
            'app-subtitle': 'Ottimizza il bilanciamento di zuccheri, sali e grassi per il massimo appeal sensoriale.',
            'original-recipe-title': 'Ricetta Originale',
            'label-ingredient': 'Ingrediente',
            'placeholder-ingredient': 'Es. Farina',
            'label-quantity': 'Quantità (g)',
            'label-sugar': 'Zucchero (g)',
            'label-salt': 'Sale (g)',
            'label-fat': 'Grassi (g)',
            'btn-add-ingredient': 'Aggiungi Ingrediente',
            'bliss-point-title': 'Bliss Point Desiderato',
            'label-sugar-ratio': 'Zucchero (%)',
            'label-salt-ratio': 'Sale (%)',
            'label-fat-ratio': 'Grassi (%)',
            'btn-calculate': 'Calcola Bliss Point',
            'modified-recipe-title': 'Risultati e Analisi',
            'result-placeholder': 'I risultati appariranno qui dopo il calcolo...',
            'error-no-ingredients': 'Inserisci almeno un ingrediente valido per calcolare il Bliss Point.',
            'error-no-nutrients': 'La ricetta originale non contiene zuccheri, sali o grassi da bilanciare.',
            'analysis-header': '--- ANALISI RICETTA ORIGINALE ---',
            'totals-header': '--- TOTALI ATTUALI ---',
            'base-bp-header': '--- BLISS POINT ATTUALE (BASE) ---',
            'adjustments-header': '--- REGOLAZIONI PER BLISS POINT DESIDERATO ---',
            'sugar': 'Zucchero',
            'salt': 'Sale',
            'fat': 'Grassi',
            'add': 'AGGIUNGI',
            'remove': 'RIMUOVI',
            'ratio-label': 'Rapporto tra i componenti:',
            'weight-label': 'Incidenza sul peso totale:'
        },
        en: {
            'app-title': 'Bliss Point Calculator',
            'app-subtitle': 'Optimize the balance of sugars, salts, and fats for maximum sensory appeal.',
            'original-recipe-title': 'Original Recipe',
            'label-ingredient': 'Ingredient',
            'placeholder-ingredient': 'e.g. Flour',
            'label-quantity': 'Quantity (g)',
            'label-sugar': 'Sugar (g)',
            'label-salt': 'Salt (g)',
            'label-fat': 'Fat (g)',
            'btn-add-ingredient': 'Add Ingredient',
            'bliss-point-title': 'Desired Bliss Point',
            'label-sugar-ratio': 'Sugar (%)',
            'label-salt-ratio': 'Salt (%)',
            'label-fat-ratio': 'Fat (%)',
            'btn-calculate': 'Calculate Bliss Point',
            'modified-recipe-title': 'Results & Analysis',
            'result-placeholder': 'Results will appear here after calculation...',
            'error-no-ingredients': 'Please enter at least one valid ingredient to calculate the Bliss Point.',
            'error-no-nutrients': 'The original recipe contains no sugar, salt, or fat to balance.',
            'analysis-header': '--- ORIGINAL RECIPE ANALYSIS ---',
            'totals-header': '--- CURRENT TOTALS ---',
            'base-bp-header': '--- CURRENT BLISS POINT (BASE) ---',
            'adjustments-header': '--- ADJUSTMENTS FOR DESIRED BLISS POINT ---',
            'sugar': 'Sugar',
            'salt': 'Salt',
            'fat': 'Fat',
            'add': 'ADD',
            'remove': 'REMOVE',
            'ratio-label': 'Component ratio:',
            'weight-label': 'Incidence on total weight:'
        }
    };

    let currentLang = localStorage.getItem('lang') || 'it';
    let currentTheme = localStorage.getItem('theme') || 'light';

    const updateLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        langToggle.textContent = lang.toUpperCase();
        
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    // Preserving icons - look for i or svg with data-lucide
                    const icon = el.querySelector('[data-lucide]');
                    if (icon) {
                        const iconName = icon.getAttribute('data-lucide');
                        el.innerHTML = `<i data-lucide="${iconName}"></i> ${translations[lang][key]}`;
                        lucide.createIcons();
                    } else {
                        el.textContent = translations[lang][key];
                    }
                }
            }
        });

        document.querySelectorAll('[data-tp]').forEach(el => {
            const key = el.getAttribute('data-tp');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    };

    const updateTheme = (theme) => {
        currentTheme = theme;
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            lucide.createIcons();
        }
    };

    themeToggle.addEventListener('click', () => {
        updateTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    langToggle.addEventListener('click', () => {
        updateLanguage(currentLang === 'it' ? 'en' : 'it');
    });

    const createRemoveBtn = () => {
        const btn = document.createElement('button');
        btn.classList.add('remove-ingredient');
        btn.innerHTML = '<i data-lucide="trash-2"></i>';
        btn.type = 'button';
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('.ingredient-row');
            if (ingredientsDiv.querySelectorAll('.ingredient-row').length > 1) {
                row.remove();
            } else {
                // Clear inputs instead of removing last row
                row.querySelectorAll('input').forEach(input => input.value = '');
            }
        });
        return btn;
    };

    // Add remove button to initial row
    document.querySelectorAll('.ingredient-row').forEach(row => {
        row.appendChild(createRemoveBtn());
    });

    addIngredientBtn.addEventListener('click', () => {
        const newIngredient = document.createElement('div');
        newIngredient.classList.add('ingredient-row', 'ingredient');
        newIngredient.innerHTML = `
            <div class="input-group">
                <label data-t="label-ingredient">${translations[currentLang]['label-ingredient']}</label>
                <input type="text" data-tp="placeholder-ingredient" placeholder="${translations[currentLang]['placeholder-ingredient']}" class="ingredient-name">
            </div>
            <div class="input-group">
                <label data-t="label-quantity">${translations[currentLang]['label-quantity']}</label>
                <input type="number" placeholder="0" class="ingredient-qty">
            </div>
            <div class="input-group">
                <label data-t="label-sugar">${translations[currentLang]['label-sugar']}</label>
                <input type="number" placeholder="0" class="ingredient-sugar">
            </div>
            <div class="input-group">
                <label data-t="label-salt">${translations[currentLang]['label-salt']}</label>
                <input type="number" placeholder="0" class="ingredient-salt">
            </div>
            <div class="input-group">
                <label data-t="label-fat">${translations[currentLang]['label-fat']}</label>
                <input type="number" placeholder="0" class="ingredient-fat">
            </div>
        `;
        newIngredient.appendChild(createRemoveBtn());
        ingredientsDiv.appendChild(newIngredient);
        lucide.createIcons();
    });

    calculateBtn.addEventListener('click', () => {
        const ingredients = [];
        const ingredientDivs = ingredientsDiv.querySelectorAll('.ingredient');
        const t = translations[currentLang];

        let totalWeight = 0;
        let totalSugar = 0;
        let totalSalt = 0;
        let totalFat = 0;

        ingredientDivs.forEach(div => {
            const name = div.querySelector('.ingredient-name').value;
            const qty = parseFloat(div.querySelector('.ingredient-qty').value) || 0;
            const sugar = parseFloat(div.querySelector('.ingredient-sugar').value) || 0;
            const salt = parseFloat(div.querySelector('.ingredient-salt').value) || 0;
            const fat = parseFloat(div.querySelector('.ingredient-fat').value) || 0;

            if (qty > 0) {
                ingredients.push({ name: name || '?', qty, sugar, salt, fat });
                totalWeight += qty;
                totalSugar += sugar;
                totalSalt += salt;
                totalFat += fat;
            }
        });

        if (ingredients.length === 0) {
            newRecipeDiv.textContent = t['error-no-ingredients'];
            return;
        }

        const sugarRatio = parseFloat(document.getElementById('sugar-ratio').value) || 0;
        const saltRatio = parseFloat(document.getElementById('salt-ratio').value) || 0;
        const fatRatio = parseFloat(document.getElementById('fat-ratio').value) || 0;

        const totalBlissComponents = totalSugar + totalSalt + totalFat;

        let resultText = `${t['analysis-header']}\n`;
        ingredients.forEach(ing => {
            resultText += `• ${ing.name}: ${ing.qty}g (${t['sugar']}: ${ing.sugar}g, ${t['salt']}: ${ing.salt}g, ${t['fat']}: ${ing.fat}g)\n`;
        });

        resultText += `\n${t['totals-header']}\n`;
        resultText += `Peso Totale: ${totalWeight.toFixed(2)}g\n`;
        resultText += `${t['sugar']}: ${totalSugar.toFixed(2)}g\n`;
        resultText += `${t['salt']}:     ${totalSalt.toFixed(2)}g\n`;
        resultText += `${t['fat']}:   ${totalFat.toFixed(2)}g\n`;

        // Base Bliss Point Calculation
        resultText += `\n${t['base-bp-header']}\n`;
        if (totalBlissComponents > 0) {
            resultText += `${t['ratio-label']}\n`;
            resultText += `  ${t['sugar']}: ${((totalSugar / totalBlissComponents) * 100).toFixed(1)}%\n`;
            resultText += `  ${t['salt']}:     ${((totalSalt / totalBlissComponents) * 100).toFixed(1)}%\n`;
            resultText += `  ${t['fat']}:   ${((totalFat / totalBlissComponents) * 100).toFixed(1)}%\n`;
        } else {
            resultText += `  (Nessun componente bliss presente)\n`;
        }
        
        resultText += `${t['weight-label']}\n`;
        resultText += `  ${t['sugar']}: ${((totalSugar / totalWeight) * 100).toFixed(2)}%\n`;
        resultText += `  ${t['salt']}:     ${((totalSalt / totalWeight) * 100).toFixed(2)}%\n`;
        resultText += `  ${t['fat']}:   ${((totalFat / totalWeight) * 100).toFixed(2)}%\n`;

        if (totalBlissComponents > 0) {
            const desiredSugar = totalBlissComponents * (sugarRatio / 100);
            const desiredSalt = totalBlissComponents * (saltRatio / 100);
            const desiredFat = totalBlissComponents * (fatRatio / 100);

            const sugarDiff = desiredSugar - totalSugar;
            const saltDiff = desiredSalt - totalSalt;
            const fatDiff = desiredFat - totalFat;

            resultText += `\n${t['adjustments-header']}\n`;
            resultText += `${t['sugar']}: ${sugarDiff > 0 ? '➕ ' + t['add'] : '➖ ' + t['remove']} ${Math.abs(sugarDiff).toFixed(2)}g\n`;
            resultText += `${t['salt']}:     ${saltDiff > 0 ? '➕ ' + t['add'] : '➖ ' + t['remove']} ${Math.abs(saltDiff).toFixed(2)}g\n`;
            resultText += `${t['fat']}:   ${fatDiff > 0 ? '➕ ' + t['add'] : '➖ ' + t['remove']} ${Math.abs(fatDiff).toFixed(2)}g\n`;
        }

        newRecipeDiv.textContent = resultText;
    });

    // Initialize UI
    updateLanguage(currentLang);
    updateTheme(currentTheme);
    lucide.createIcons();
});
