const translations = {
    'pt-br': {
        userPlace: "Insira o seu usuário",
        passPlace: "Insira sua senha",
        tokenPlace: "Insira o código de 6 dígitos",
        btnAuth: "Entrar",
        btnToken: "Verificar Código",
        adminTitle: "Login de Administrador",
        ajuda: "Ajuda",
        errorGlobal: "Usuário ou senha inválidos.",
        errorField: "Campo obrigatório.",
        modalInstruction: "Para problemas de acesso ou perda do token (2FA), contate a administração:"
    },
    'en': {
        userPlace: "Enter your username",
        passPlace: "Enter your password",
        tokenPlace: "Enter the 6-digit code",
        btnAuth: "Sign In",
        btnToken: "Verify Code",
        adminTitle: "Administrator Login",
        ajuda: "Help",
        errorGlobal: "Invalid username or password.",
        errorField: "This field is required.",
        modalInstruction: "For access issues or token loss (2FA), contact administration:"
    },
    'es': {
        userPlace: "Ingrese su usuario",
        passPlace: "Ingrese su contraseña",
        tokenPlace: "Ingrese el código de 6 dígitos",
        btnAuth: "Entrar",
        btnToken: "Verificar Código",
        adminTitle: "Iniciar sesión como Administrador",
        ajuda: "Ayuda",
        errorGlobal: "Usuario o contraseña inválidos.",
        errorField: "Este campo es obligatorio.",
        modalInstruction: "Para problemas de acceso o pérdida del token (2FA), contacte a la administración:"
    }
};

function applyTranslations(lang) {
    const t = translations[lang] || translations['pt-br'];
    
    const userInput = document.getElementById('id_auth-username');
    const passInput = document.getElementById('id_auth-password');
    const tokenInput = document.getElementById('id_token-token');
    const btnSubmit = document.getElementById('btnSubmit');
    const adminTitle = document.getElementById('adminTitle');
    const linkAjuda = document.getElementById('linkAjuda');
    const stepContext = document.getElementById('django-step-context');
    const modalInstruction = document.getElementById('modalInstruction');
    const errorBlock = document.getElementById('errorBlock');
    const fieldErrors = document.querySelectorAll('.field-error-text');

    if (userInput) userInput.setAttribute('placeholder', t.userPlace);
    if (passInput) passInput.setAttribute('placeholder', t.passPlace);
    if (tokenInput) tokenInput.setAttribute('placeholder', t.tokenPlace);
    if (linkAjuda) linkAjuda.textContent = t.ajuda;
    if (adminTitle) adminTitle.textContent = t.adminTitle;
    if (errorBlock) errorBlock.textContent = t.errorGlobal;
    if (modalInstruction) modalInstruction.textContent = t.modalInstruction;

    fieldErrors.forEach(errorElement => {
        errorElement.textContent = t.errorField;
    });

    if (btnSubmit && stepContext) {
        const currentStep = stepContext.getAttribute('data-step');
        btnSubmit.textContent = (currentStep === "auth") ? t.btnAuth : t.btnToken;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const langSelect = document.getElementById('langSelect');
    const linkAjuda = document.getElementById('linkAjuda');
    const helpDropdown = document.getElementById('helpDropdown');

    if (langSelect) {
        applyTranslations(langSelect.value);
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            applyTranslations(selectedLang);

            const form = document.getElementById('langForm');
            if (form) {
                const formData = new FormData(form);
                formData.set('language', selectedLang);
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
            }
        });
    }

    // LOGICA DA CAIXA SUSPENSA (DROPDOWN)
    if (linkAjuda && helpDropdown) {
        linkAjuda.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evita fechar no mesmo clique
            helpDropdown.classList.toggle('active');
        });

        // Fecha a caixa se clicar em qualquer outro lugar da tela
        window.addEventListener('click', function(e) {
            if (!helpDropdown.contains(e.target) && e.target !== linkAjuda) {
                helpDropdown.classList.remove('active');
            }
        });
    }
});
