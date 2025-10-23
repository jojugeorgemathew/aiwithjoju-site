import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

async function generateContent() {
    const prompt = document.getElementById('prompt-input').value;
    const outputText = document.getElementById('output-text');
    const spinner = document.getElementById('loading-spinner');
    const button = document.getElementById('generate-button');
 
    if (!prompt.trim()) {
        outputText.textContent = "Please enter a valid prompt to begin.";
        return;
    }
 
    // 1. Show Loading State
    outputText.textContent = "Thinking... (Sending prompt to Gemini)";
    spinner.classList.remove('hidden');
    button.disabled = true;
 
    try {
        // --- IMPORTANT ---
        // This is NOT a secure way to use an API key on a public website.
        // For production, you should use a backend server to protect your key.
        // Get your key from https://aistudio.google.com/app/apikey
        const API_KEY = ""; // <-- PASTE YOUR REAL GEMINI API KEY HERE
 
        if (!API_KEY) {
            throw new Error("API Key is missing. Please add your actual Gemini API key to script.js.");
        }
 
        // 2. Initialize Google Generative AI and call the model
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Use the standard 'gemini-pro' model, which is stable and widely available.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
 
        // 3. Display the result
        outputText.textContent = text.trim();
    } catch (error) {
        // 4. Handle Errors
        console.error('AI generation failed:', error);
        // Provide a more helpful error message. If the key is invalid, Google's error will be shown.
        outputText.textContent = `AN ERROR OCURRED! This section is currently under construction.`;
    } finally {
        // 5. Always Hide Loading State
        spinner.classList.add('hidden');
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    
    // --- DARK MODE TOGGLE LOGIC ---
    const toggleButton = document.getElementById('theme-toggle');

    function updateButtonText(theme) {
        if (theme === 'dark') {
            toggleButton.textContent = '🌙 Switch to Light Mode';
        } else {
            toggleButton.textContent = '☀️ Switch to Dark Mode';
        }
    }

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateButtonText(savedTheme);

    toggleButton.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonText(newTheme);
    });

    // --- AI GENERATOR EVENT LISTENER ---
    const generateButton = document.getElementById('generate-button');
    generateButton.addEventListener('click', generateContent);

    
    // --- SETTINGS MODAL LOGIC ---
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModal = document.getElementById('settings-modal');
    const closeButton = settingsModal.querySelector('.close-button');

    // Open Modal
    settingsIcon.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    // Close Modal
    function closeModal() {
        settingsModal.classList.add('hidden');
    }

    closeButton.addEventListener('click', closeModal);
    // Close on overlay click
    settingsModal.addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') {
            closeModal();
        }
    });


    // --- TEXT SIZE CONTROL LOGIC ---
    const decreaseFontBtn = document.getElementById('font-decrease');
    const increaseFontBtn = document.getElementById('font-increase');
    const fontDisplay = document.getElementById('font-display');
    
    let fontSizeLevel = parseInt(localStorage.getItem('fontSizeLevel')) || 0; // -2, -1, 0, 1, 2
    
    const fontSizeMap = {
        '-2': { size: '13px', label: 'Smallest' },
        '-1': { size: '14.5px', label: 'Smaller' },
        '0': { size: '16px', label: 'Normal' },
        '1': { size: '17.5px', label: 'Larger' },
        '2': { size: '19px', label: 'Largest' }
    };

    function updateFontSize(level) {
        // Clamp level between -2 and 2
        level = Math.max(-2, Math.min(2, level)); 
        fontSizeLevel = level;
        
        const { size, label } = fontSizeMap[level];
        
        // Apply the new font size to the CSS variable
        body.style.setProperty('--base-font-size', size);
        fontDisplay.textContent = label;
        
        // Save to local storage
        localStorage.setItem('fontSizeLevel', level);
    }
    
    // Initialize font size on load
    updateFontSize(fontSizeLevel);

    increaseFontBtn.addEventListener('click', () => updateFontSize(fontSizeLevel + 1));
    decreaseFontBtn.addEventListener('click', () => updateFontSize(fontSizeLevel - 1));


    // --- QUICK QUIZ LOGIC ---
    const quizOptions = document.querySelectorAll('.quiz-options li');
    const quizFeedback = document.getElementById('quiz-feedback');

    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.parentElement.classList.contains('answered')) return;
            
            option.parentElement.classList.add('answered');

            const isCorrect = option.getAttribute('data-correct') === 'true';

            quizOptions.forEach(opt => {
                if (opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                }
                opt.style.opacity = '0.5';
            });
            
            if (isCorrect) {
                option.classList.add('correct');
                quizFeedback.textContent = "✅ Correct! A Large Language Model processes and generates text based on vast training data.";
            } else {
                option.classList.add('incorrect');
                quizFeedback.textContent = "❌ Incorrect. The correct answer is B. Keep learning about AI with Joju!";
            }
            
            option.style.opacity = '1';
        });
    });


    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            const wasActive = answerDiv.classList.contains('active');
            
            // Close all other active items
            faqItems.forEach(i => {
                i.querySelector('.faq-answer').classList.remove('active');
                i.querySelector('.faq-question').classList.remove('active');
            });
            
            // Open the clicked item if it was not already active
            if (!wasActive) {
                answerDiv.classList.add('active');
                questionButton.classList.add('active');
            }
        });
    });
});

/* ... hurraaayyyy my website is workin cooooler ... */