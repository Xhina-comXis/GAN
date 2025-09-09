// Aguarda o carregamento completo da página para executar o código
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DO CURSOR PERSONALIZADO ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        // Move o cursor e o seguidor de acordo com o mouse
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Adiciona efeito de "crescimento" ao passar o mouse sobre links e botões
        document.querySelectorAll('a, button, input, .btn, .upload-area').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.3)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // --- 2. LÓGICA DO MENU HAMBÚRGUER ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Fecha o menu ao clicar em um link (útil para navegação na mesma página)
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // --- 3. LÓGICA DOS MODAIS DE LOGIN E REGISTRO ---
    
    // Modal de Login do Analista
    const authModal = document.getElementById('authModal');
    const dashboardLoginBtn = document.getElementById('dashboardLoginBtn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const loginForm = document.getElementById('loginForm');

    if (dashboardLoginBtn && authModal) {
        dashboardLoginBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede o scroll da página
        });
    }

    // Modal de Login/Registro do Usuário
    const userAuthModal = document.getElementById('userAuthModal');
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userLoginForm = document.getElementById('userLoginForm');
    const userRegisterForm = document.getElementById('userRegisterForm');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const closeUserModal = document.getElementById('closeUserModal');

    if (userLoginBtn && userAuthModal) {
        userLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            userAuthModal.classList.add('active');
            userLoginForm.style.display = 'block';
            userRegisterForm.style.display = 'none';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Alterna para o formulário de registro
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            userLoginForm.style.display = 'none';
            userRegisterForm.style.display = 'block';
        });
    }

    // Alterna de volta para o formulário de login
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            userRegisterForm.style.display = 'none';
            userLoginForm.style.display = 'block';
        });
    }
    
    // Funcionalidade para fechar qualquer modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.auth-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            document.body.style.overflow = ''; // Restaura o scroll
        });
    });

    // Fecha o modal se o usuário clicar fora da área do formulário
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
        if (e.target === userAuthModal) userAuthModal.classList.remove('active');
        if (e.target === authModal || e.target === userAuthModal) {
            document.body.style.overflow = '';
        }
    });

    // --- 4. VALIDAÇÃO DO LOGIN DO ANALISTA ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            // Verifica as credenciais (estão fixas no código)
            if (email === 'analista@portalcrivo.com' && password === 'Teste1234') {
                window.location.href = 'analista.html'; // Redireciona para a página do analista
            } else {
                showNotification('Credenciais inválidas!', 'error');
            }
        });
    }
    
    // --- 5. LÓGICA DE UPLOAD E ANÁLISE DE IMAGEM ---
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = uploadArea.querySelector('button');
    const fileNameDisplay = document.getElementById('fileName');
    const imagePreview = document.getElementById('saida');
    const textPreview = document.getElementById('saida2');
    const progressPercent = document.querySelector('.progress-percent');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    const resultDetails = document.querySelectorAll('.detail-card p');

    // Abre o seletor de arquivos ao clicar no botão
    if(uploadButton) {
        uploadButton.addEventListener('click', () => fileInput.click());
    }

    // Lógica para Arrastar e Soltar (Drag and Drop)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'));
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'));
    });

    // Processa o arquivo solto na área
    uploadArea.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        fileInput.files = files; // Adiciona os arquivos ao input
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Processa o arquivo selecionado pelo input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    // Função principal que lida com o arquivo e chama a API
    async function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Por favor, envie apenas imagens.', 'warning');
            return;
        }

        // Reseta a interface para uma nova análise
        fileNameDisplay.textContent = file.name;
        progressPercent.textContent = 'Enviando...';
        imagePreview.style.display = 'none';
        textPreview.style.display = 'none';

        // Prepara os dados para enviar à API Sightengine
        const formData = new FormData();
        formData.append('media', file);
        formData.append('models', 'genai,faces');
        formData.append('api_user', '862392177');
        formData.append('api_secret', 'fimwofYQTrKNa9GWxb9GZ7JTavfUtGHK');

        try {
            // Chama a API
            const response = await fetch('https://api.sightengine.com/1.0/check.json', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            
            console.log("API Response:", result); // Mostra o resultado da API no console

            // Exibe a imagem enviada pelo usuário
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                textPreview.style.display = 'block';
                uploadArea.style.display = 'none';
                window.ultimaImagemBase64 = e.target.result; // Salva para análise humana
            };
            reader.readAsDataURL(file);

            // Atualiza a interface com o resultado da análise
            const aiProbability = result.media?.ai_generated ?? 0;
            const confidence = Math.round(aiProbability * 100);
            
            confidenceFill.style.width = confidence + '%';
            confidenceValue.innerText = confidence + '%';

            let facialAnalysisText = 'Não parece ser gerada por IA';
            if (confidence > 50) facialAnalysisText = 'Possivelmente gerada por IA';
            if (confidence > 80) facialAnalysisText = 'Alta chance de ser IA ou Deepfake';

            resultDetails[0].textContent = facialAnalysisText;
            resultDetails[1].textContent = 'Áudio não encontrado (análise de imagem)';
            resultDetails[2].textContent = 'Metadados não analisados';
            resultDetails[3].textContent = 'Compressão não avaliada';

            progressPercent.textContent = 'Análise concluída';

        } catch (error) {
            console.error('Erro ao analisar a imagem:', error);
            showNotification('Erro ao enviar imagem para análise.', 'error');
        }
    }
    
    // --- 6. LÓGICA PARA ENVIAR PARA ANÁLISE HUMANA ---
    const btnAnaliseHumana = document.getElementById('enviarAnaliseHumana');
    if (btnAnaliseHumana) {
        btnAnaliseHumana.addEventListener('click', async function () {
            if (window.ultimaImagemBase64) {
                try {
                    // Converte a imagem de base64 para um arquivo para envio
                    const response = await fetch(window.ultimaImagemBase64);
                    const blob = await response.blob();
                    const file = new File([blob], 'imagem-para-analise.jpg', { type: blob.type });
                    
                    const formData = new FormData();
                    formData.append('imagem', file);

                    // Envia para o seu servidor local (backend)
                    const serverResponse = await fetch('http://localhost:3000/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (serverResponse.ok) {
                        showNotification('Imagem enviada para análise humana com sucesso!', 'success');
                        imagePreview.style.display = 'none';
                        uploadArea.style.display = 'flex';
                    } else {
                        showNotification('Falha ao enviar a imagem para análise.', 'error');
                    }
                } catch (error) {
                    console.error('Erro ao enviar para análise humana:', error);
                    showNotification('Ocorreu um erro técnico. Tente novamente.', 'error');
                }
            } else {
                showNotification('Envie uma imagem antes de solicitar análise humana!', 'warning');
            }
        });
    }

});

// --- 7. FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES (POPUPS) ---
function showNotification(message, type) { // types: success, error, info, warning
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <i class="fas fa-times close-notification"></i>
    `;
    document.body.appendChild(notification);

    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    // Remove a notificação automaticamente após 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Adiciona os estilos CSS para as notificações na página
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 15px 25px;
      border-radius: 8px;
      color: white;
      display: flex;
      align-items: center;
      gap: 15px;
      z-index: 10000;
      transform: translateY(100px);
      opacity: 0;
      animation: slideIn 0.3s forwards;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      max-width: 350px;
  }
  @keyframes slideIn {
      to { transform: translateY(0); opacity: 1; }
  }
  .notification.success {
      background: linear-gradient(135deg, #00b894, #55efc4);
      border-left: 5px solid #00b894;
  }
  .notification.error {
      background: linear-gradient(135deg, #ff7675, #fab1a0);
      border-left: 5px solid #ff7675;
  }
  .notification.info {
      background: linear-gradient(135deg, #0984e3, #74b9ff);
      border-left: 5px solid #0984e3;
  }
  .notification.warning {
      background: linear-gradient(135deg, #fdcb6e, #ffeaa7);
      border-left: 5px solid #fdcb6e;
      color: #2d3436;
  }
  .notification .close-notification {
      cursor: pointer;
      opacity: 0.8;
      transition: all 0.3s ease;
  }
  .notification .close-notification:hover {
      opacity: 1;
      transform: rotate(90deg);
  }
`;
document.head.appendChild(notificationStyles);