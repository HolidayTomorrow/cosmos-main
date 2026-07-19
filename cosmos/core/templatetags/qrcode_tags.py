import base64
from io import BytesIO
import qrcode
from django import template
from django.utils.http import urlencode

register = template.Library()

@register.simple_tag
def gerar_2fa_qrcode(secret_key, username):
    if not secret_key:
        return ""
        
    # Monta a URL oficial do OTPAuth internamente
    label = f"Cosmos:{username}"
    params = {
        'secret': secret_key,
        'issuer': 'Cosmos'
    }
    otpauth_url = f"otpauth://totp/{label}?{urlencode(params)}"
    
    # Gera o QR Code em memória
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(otpauth_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Converte para Base64
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return f"data:image/png;base64,{qr_base64}"
