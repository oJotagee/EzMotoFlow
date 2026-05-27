import { LoggerInterceptor } from 'src/commom/interceptors/logger.interceptor';
import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';

@UseInterceptors(LoggerInterceptor)
@Controller()
export class AppController {
  @Get()
  index(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EzMotoFlow API</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0f172a;
        font-family: 'Segoe UI', system-ui, sans-serif;
        color: #e2e8f0;
      }

      .card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 16px;
        padding: 48px 56px;
        text-align: center;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 25px 50px rgba(0,0,0,0.4);
      }

      .logo {
        font-size: 2.4rem;
        font-weight: 800;
        letter-spacing: -1px;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
      }

      .badge {
        display: inline-block;
        background: #0ea5e910;
        border: 1px solid #0ea5e940;
        color: #38bdf8;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: 999px;
        margin-bottom: 28px;
      }

      p {
        color: #94a3b8;
        line-height: 1.7;
        margin-bottom: 36px;
        font-size: 0.97rem;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #38bdf8, #818cf8);
        color: #0f172a;
        font-weight: 700;
        font-size: 0.95rem;
        padding: 14px 32px;
        border-radius: 10px;
        text-decoration: none;
        transition: opacity 0.2s, transform 0.2s;
        box-shadow: 0 4px 20px rgba(56,189,248,0.3);
      }

      .btn:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn:active { transform: translateY(0); }

      .footer {
        margin-top: 36px;
        font-size: 0.78rem;
        color: #475569;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="logo">EzMotoFlow</div>
      <div class="badge">API REST</div>
      <p>
        Bem-vindo à API do EzMotoFlow.<br />
        Acesse a documentação interativa para explorar todos os endpoints disponíveis.
      </p>
      <a class="btn" href="/docs">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        Ver documentação Swagger
      </a>
      <div class="footer">v1.0 &nbsp;·&nbsp; NestJS + Prisma + PostgreSQL</div>
    </div>
  </body>
</html>`);
  }
}
