using WhatsCrm.Api.DTOs;
using WhatsCrm.Api.Entities;

namespace WhatsCrm.Api.Interfaces;

public interface IWhatsappContaService
{
    Task<WhatsappContaResponse?> ObterDaEmpresaAtualAsync();
    Task<WhatsappContaResponse> SalvarAsync(CreateWhatsappContaRequest request);
    Task DesativarAsync(Guid id);

    /// <summary>Resolve a conta (com o token já descriptografado) a partir do phone_number_id recebido em um webhook.</summary>
    Task<(WhatsappConta Conta, string AccessToken)?> ResolverPorPhoneNumberIdAsync(string phoneNumberId);
}
