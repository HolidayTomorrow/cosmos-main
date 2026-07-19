
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# ============================================================================================
import base64
from io import BytesIO
import qrcode
from django.utils.http import urlencode
from two_factor.views import SetupView  # Certifique-se de importar corretamente

class CustomSetupView(SetupView):
    def get_context_data(self, form, **kwargs):
        context = super().get_context_data(form=form, **kwargs)
        secret_key = context.get('secret_key')
        
        # --- ADICIONE O CÓDIGO DE TESTE AQUI ---
        if secret_key and self.request.user.is_authenticated:
            print("👉 CHAVE ENCONTRADA, GERANDO QR CODE...") 
            
            username = self.request.user.get_username()
            label = f"Cosmos:{username}"
            params = {'secret': secret_key, 'issuer': 'Cosmos'}
            otpauth_url = f"otpauth://totp/{label}?{urlencode(params)}"
            
            qr = qrcode.QRCode(version=1, box_size=10, border=4)
            qr.add_data(otpauth_url)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            context['qr_code_base64'] = f"data:image/png;base64,{qr_base64}"
            
        else:
            # Esse print vai te mostrar no terminal do VS Code / Prompt o real motivo de falhar
            print(f"❌ DEBUG: secret_key é '{secret_key}' e user autenticado é {self.request.user.is_authenticated}")
        # --------------------------------------

        return context

# ============================================================================================

# def login_view(request):
#     return render(request, 'two_factor/core/login.html')
@login_required # Gatante que só entra na home quem estiver logado
def home_view(request):
    return render(request, 'home.html')  # Certifique-se de que templates/home.html existe
