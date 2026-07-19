/**
 * Script de comportamento exclusivo para a página de ativação do 2FA (Setup)
 * Processa a chave do Django e renderiza o QR Code local em formato SVG estável.
 */
document.addEventListener("DOMContentLoaded", function() {
    const keyElement = document.getElementById('raw-secret-key');
    const qrContainer = document.getElementById('canvas-qrcode-local');

    // Executa o gerador gráfico se a chave e o contêiner estiverem ativos na tela (Etapa 2)
    if (keyElement && qrContainer) {
        // Limpa quebras de linha e espaços que o Django injeta por padrão no template
        const secretKey = keyElement.textContent.trim().replace(/\s+/g, '');
        
        if (secretKey && typeof QRCodeGen !== "undefined") {
            // CORREÇÃO: Monta a URL usando crases e codificando os parâmetros para evitar quebra de sintaxe
            const label = encodeURIComponent("Cosmos:Admin");
            const issuer = encodeURIComponent("Cosmos");
            const otpauthUrl = `otpauth://totp/${label}?secret=${secretKey}&issuer=${issuer}`;
            
            // Limpa containers residuais por segurança
            qrContainer.innerHTML = "";
            
            // Instancia o motor matemático local e gera o código SVG textual
            const engine = new QRCodeGen();
            const svgMarkup = engine.generateSvg(otpauthUrl, 160);
            
            // Injeta o SVG direto na página
            qrContainer.innerHTML = svgMarkup;
        }
    }
});









// /**
//  * Script de comportamento exclusivo para a página de ativação do 2FA (Setup)
//  * Processa a chave do Django e renderiza o QR Code local em formato SVG estável.
//  */
// document.addEventListener("DOMContentLoaded", function() {
//     const keyElement = document.getElementById('django-secret-key');
//     const qrContainer = document.getElementById('cosmos-local-qrcode');

//     // 1. Executa o gerador gráfico se a chave e o contêiner estiverem ativos na tela (Etapa 2)
//     if (keyElement && qrContainer) {
//         // Limpa quebras de linha e espaços que o Django injeta por padrão no template
//         const secretKey = keyElement.textContent.trim().replace(/\s+/g, '');
        
//         if (secretKey && typeof QRCodeGen !== "undefined") {
//             // Monta o link padrão que os aplicativos autenticadores (Google, Authy) exigem
//             const otpauthUrl = `otpauth://totp/Cosmos:Admin?secret=${secretKey}&issuer=Cosmos`;
            
//             // Instancia o motor matemático local e gera o código SVG textual
//             const engine = new QRCodeGen();
//             const svgMarkup = engine.generateSvg(otpauthUrl, 160);
            
//             // Injeta o SVG direto na página (Imune a erros de rede ou bloqueios de mídia do Django)
//             qrContainer.innerHTML = svgMarkup;
//         }
//     }
// });
