using System.Net;
using System.Text.Json;
using WhatsCrm.Api.Exceptions;

namespace WhatsCrm.Api.Middlewares;

/// <summary>
/// Traduz exceções de negócio em respostas HTTP conhecidas e evita vazar stack trace ao cliente.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception exception)
    {
        var (status, message) = exception switch
        {
            UnauthorizedAppException => (HttpStatusCode.Unauthorized, exception.Message),
            ConflictAppException => (HttpStatusCode.Conflict, exception.Message),
            NotFoundAppException => (HttpStatusCode.NotFound, exception.Message),
            _ => (HttpStatusCode.InternalServerError, "Ocorreu um erro inesperado. Tente novamente mais tarde.")
        };

        if (status == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Erro não tratado ao processar {Method} {Path}", context.Request.Method, context.Request.Path);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var payload = JsonSerializer.Serialize(new { mensagem = message });
        await context.Response.WriteAsync(payload);
    }
}
