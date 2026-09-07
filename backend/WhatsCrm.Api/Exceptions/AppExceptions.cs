namespace WhatsCrm.Api.Exceptions;

/// <summary>Exceção base para erros de negócio que devem ser traduzidos em respostas HTTP conhecidas.</summary>
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message)
    {
    }
}

public class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message = "Credenciais inválidas.") : base(message)
    {
    }
}

public class ConflictAppException : AppException
{
    public ConflictAppException(string message) : base(message)
    {
    }
}

public class NotFoundAppException : AppException
{
    public NotFoundAppException(string message = "Recurso não encontrado.") : base(message)
    {
    }
}
