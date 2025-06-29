document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments HTML
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const genderSelect = document.getElementById('gender');
    const activityLevelSelect = document.getElementById('activityLevel');
    const goalSelect = document.getElementById('goal'); // Le sélecteur d'objectif
    const calculateBtn = document.getElementById('calculateBtn'); // Le bouton "Calculer"

    const bmrResultSpan = document.getElementById('bmrResult');
    const tdeeResultSpan = document.getElementById('tdeeResult');
    const proteinResultSpan = document.getElementById('proteinResult');
    const carbResultSpan = document.getElementById('carbResult');
    const fatResultSpan = document.getElementById('fatResult');

    // Facteurs d'activité physique (PAL - Physical Activity Level)
    const activityFactors = {
        'sedentary': 1.2,        // Peu ou pas d'exercice
        'light': 1.375,          // 1-3 jours/semaine d'exercice
        'moderate': 1.55,        // 3-5 jours/semaine d'exercice
        'active': 1.725,         // 6-7 jours/semaine d'exercice
        'very_active': 1.9       // Exercice intense ou travail physique
    };

    // Définition des pourcentages de macronutriments pour chaque objectif
    // Assurez-vous que la somme des pourcentages pour chaque objectif fait 1 (ou 100%)
    const macroPercentages = {
        'maintenance': { protein: 0.30, carbs: 0.40, fat: 0.30 }, // Maintien classique
        'seche': { protein: 0.35, carbs: 0.35, fat: 0.30 },       // Sèche (plus de protéines)
        'prise_masse': { protein: 0.25, carbs: 0.50, fat: 0.25 },  // Prise de masse (plus de glucides)
        'minceur_douce': { protein: 0.30, carbs: 0.40, fat: 0.30 }, // Minceur douce (similaire à maintien en macros)
        'entretien_sportif': { protein: 0.25, carbs: 0.55, fat: 0.20 }, // Entretien sportif (plus de glucides pour performance)
        'recomposition': { protein: 0.40, carbs: 0.35, fat: 0.25 }, // Recomposition (très élevé en protéines)
        // 'jeun_intermittent' n'aura pas de pourcentages ici, car nous gérons son affichage différemment
    };

    // Fonction principale de calcul
    function calculateAndDisplayResults() {
        // Récupérer les valeurs. Si un champ est vide, parseFloat renverra NaN.
        const age = parseFloat(ageInput.value);
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const gender = genderSelect.value;
        const activityLevel = activityLevelSelect.value;
        const goal = goalSelect.value; 

        // Valider les entrées : si une valeur est NaN (vide ou non numérique) ou <= 0
        if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
            // Réinitialiser les affichages à "0" si les entrées sont invalides
            bmrResultSpan.textContent = '0';
            tdeeResultSpan.textContent = '0';
            proteinResultSpan.textContent = '0';
            carbResultSpan.textContent = '0';
            fatResultSpan.textContent = '0';
            return; // Arrêter la fonction si les données ne sont pas valides
        }

        // 1. Calcul du Métabolisme de Base (MB) - Formule de Mifflin-St Jeor
        let bmr; 
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else { // female
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // 2. Calcul de la Dépense Énergétique Totale (TDEE)
        const activityFactor = activityFactors[activityLevel];
        let tdee = bmr * activityFactor;

        // 3. Ajustement des calories en fonction de l'objectif sélectionné
        let finalCalories = tdee; 

        switch (goal) {
            case 'seche':
                finalCalories = tdee - 500; 
                if (finalCalories < bmr) finalCalories = bmr; // S'assurer que les calories ne sont pas trop basses
                break;
            case 'prise_masse':
                finalCalories = tdee + 300; 
                break;
            case 'minceur_douce':
                finalCalories = tdee - 300; 
                if (finalCalories < bmr) finalCalories = bmr; 
                break;
            case 'entretien_sportif':
                finalCalories = tdee + 100; 
                break;
            case 'recomposition':
                finalCalories = tdee; 
                break;
            case 'jeun_intermittent':
                finalCalories = tdee; 
                break;
            case 'maintenance':
            default:
                break;
        }

        // 4. Affichage du MB, du DEJT (TDEE non ajusté)
        bmrResultSpan.textContent = Math.round(bmr);
        tdeeResultSpan.textContent = Math.round(tdee);

        // 5. Calcul et affichage des Macronutriments
        const percentages = macroPercentages[goal] || macroPercentages['maintenance']; 

        if (goal === 'jeun_intermittent') {
            proteinResultSpan.textContent = 'N/A';
            carbResultSpan.textContent = 'N/A';
            fatResultSpan.textContent = 'N/A';
        } else {
            const proteinCals = finalCalories * percentages.protein;
            const carbCals = finalCalories * percentages.carbs;
            const fatCals = finalCalories * percentages.fat;

            const proteinGrams = proteinCals / 4;
            const carbGrams = carbCals / 4;
            const fatGrams = fatCals / 9;

            proteinResultSpan.textContent = proteinGrams.toFixed(0);
            carbResultSpan.textContent = carbGrams.toFixed(0);
            fatResultSpan.textContent = fatGrams.toFixed(0);
        }
    }

    // Ajout de l'écouteur d'événements pour le bouton "Calculer"
    calculateBtn.addEventListener('click', calculateAndDisplayResults);

    // Au chargement de la page, nous n'appelons plus calculateAndDisplayResults
    // car les champs sont vides et le résultat serait 0 de toute façon.
    // L'utilisateur devra saisir des valeurs et cliquer sur "Calculer".
});