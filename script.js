// ----------- MODAL DE AUTENTICAÇÃO E LOGIN -----------

document.addEventListener("DOMContentLoaded", function() {
  // Modal de login
  const modal = document.getElementById('authModal');
  const openBtn = document.getElementById('dashboardLoginBtn');
  const closeBtn = document.querySelector('.close-modal');
  const loginForm = document.getElementById('loginForm');

  // Abrir modal
  if (openBtn && modal) {
    openBtn.addEventListener('click', function() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Fechar modal
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Fechar ao clicar fora do modal
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const senha = document.getElementById('loginPassword').value;
      if (email === 'analista@portalcrivo.com' && senha === 'Teste1234') {
        window.location.href = 'analista.html';
      } else {
        showNotification('Credenciais inválidas!', 'error');
      }
    });
  }
});

// ----------- NOTIFICAÇÕES -----------

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
      <p>${message}</p>
      <i class="fas fa-times close-notification"></i>
  `;
  document.body.appendChild(notification);
  // Fechar notificação
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', () => {
      notification.remove();
  });
  // Remover automaticamente após 5 segundos
  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
          notification.remove();
      }, 300);
  }, 5000);
}

// ----------- CSS DINÂMICO PARA NOTIFICAÇÕES -----------
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

// ----------- CURSOR CUSTOMIZADO -----------

document.addEventListener("DOMContentLoaded", function() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    });

    // Efeito ao passar por links e botões
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
});

let ultimaImagemBase64 = null;

const fileInput = document.getElementById("fileInput");
const saidaImg = document.getElementById("saida");
const saida2 = document.getElementById("saida2");
const uploadArea = document.getElementById("uploadArea");
const detailicon = document.querySelector(".detailicon");

fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        saidaImg.src = e.target.result;
        saidaImg.style.display = "block";
        saida2.style.display = "block";
        uploadArea.style.display = "none";
        if (detailicon) detailicon.style.display = "block";
        // Salva a imagem em base64 para uso posterior
        ultimaImagemBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
});

const btnAnaliseHumana = document.getElementById("enviarAnaliseHumana");
if (btnAnaliseHumana) {
    btnAnaliseHumana.addEventListener("click", async function() {
        if (ultimaImagemBase64) {
            try {
                // Converte a imagem base64 de volta para um arquivo para o envio
                const response = await fetch(ultimaImagemBase64);
                const blob = await response.blob();
                const file = new File([blob], "imagem-para-analise.jpg", { type: blob.type });

                // Usa FormData para enviar o arquivo
                const formData = new FormData();
                formData.append("imagem", file);

                // Envia para o seu novo backend (ex: http://seuservidor.com/upload)
                const uploadResponse = await fetch("http://localhost:3000/upload", { // <- URL DO SEU BACKEND
                    method: "POST",
                    body: formData,
                });

                if (uploadResponse.ok) {
                    alert("Imagem enviada para análise humana com sucesso!");
                    // Opcional: Limpar a imagem da tela após o envio
                    saidaImg.style.display = "none";
                    uploadArea.style.display = "flex";

                } else {
                    alert("Falha ao enviar a imagem para análise.");
                }

            } catch (error) {
                console.error("Erro ao enviar para análise humana:", error);
                alert("Ocorreu um erro técnico. Tente novamente.");
            }
        } else {
            alert("Envie uma imagem antes de solicitar análise humana!");
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
  const userModal = document.getElementById('userAuthModal');
  const openUserBtn = document.getElementById('userLoginBtn');
  const closeUserBtn = document.getElementById('closeUserModal');
  const userLoginForm = document.getElementById('userLoginForm');
  const userRegisterForm = document.getElementById('userRegisterForm');
  const registerLink = document.getElementById('registerLink');
  const loginLink = document.getElementById('loginLink');

  // Abrir modal usuário
  if (openUserBtn && userModal) {
    openUserBtn.addEventListener('click', function(e) {
      e.preventDefault();
      userModal.classList.add('active');
      userLoginForm.style.display = 'block';
      userRegisterForm.style.display = 'none';
      document.body.style.overflow = 'hidden';
    });
  }

  // Fechar modal usuário
  if (closeUserBtn && userModal) {
    closeUserBtn.addEventListener('click', function() {
      userModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Alternar para cadastro
  if (registerLink && userLoginForm && userRegisterForm) {
    registerLink.addEventListener('click', function(e) {
      e.preventDefault();
      userLoginForm.style.display = 'none';
      userRegisterForm.style.display = 'block';
    });
  }

  // Alternar para login
  if (loginLink && userLoginForm && userRegisterForm) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      userRegisterForm.style.display = 'none';
      userLoginForm.style.display = 'block';
    });
  }

  // Fechar ao clicar fora do modal
  if (userModal) {
    userModal.addEventListener('click', function(e) {
      if (e.target === userModal) {
        userModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});