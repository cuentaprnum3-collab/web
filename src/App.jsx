import { useState, useEffect, useRef } from 'react';
import { THEME, COLORS_MATERIA, CONFIG } from './config';
import { useAuth } from './hooks/useAuth';
import {
  BookIcon,
  HomeIcon,
  LibraryIcon,
  CalendarIcon,
  ChartIcon,
  UserIcon,
  NoteIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
  CheckIcon,
  AppLogoIcon,
} from './components/Common/Icons';
import { ReadingSessionBar } from './components/Common/ReadingSessionBar';
import loadingDotsIcon from '../icons8-dots-loading-48.png';
import { IniciarSesionModal } from './components/Common/IniciarSesionModal';
import { FinalizarSesionModal } from './components/Common/FinalizarSesionModal';
import { authService, materiasService, notasService, librosService, sesionesService, metasService, statsService, logrosService } from './services';

function RestartIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 8-8" />
      <polyline points="8 5 12 1 16 5" />
      <path d="M20 12a8 8 0 0 1-8 8" />
    </svg>
  );
}

function StartIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ContinueIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function RaccoonIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10c0 5 4 8 8 8s8-3 8-8c0-1.5-.5-2.8-1.3-3.8" />
      <path d="M20 10c0-3.7-3.3-7-7-7S6 6.3 6 10" />
      <path d="M8 11.5c1-1.5 2.5-2 4-2s3 0.5 4 2" />
      <path d="M8.5 9.5c.7-.7 1.7-.7 2.4 0" />
      <path d="M15.5 9.5c-.7-.7-1.7-.7-2.4 0" />
      <path d="M10 14.5h4" />
    </svg>
  );
}

const DARK_THEME = {
  dark: '#111827',
  purple: '#8b5cf6',
  lime: '#bef264',
  limeDk: '#84cc16',
  purpleLt: '#c084fc',
  white: '#0f172a',
  g100: '#111827',
  g200: '#1f2937',
  g300: '#374151',
  g400: '#6b7280',
  tPrimary: '#f8fafc',
  tSecondary: '#d1d5db',
  tHint: '#9ca3af',
};

const buildCss = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:${C.g100};color:${C.tPrimary};min-height:100vh;}
  .app{display:flex;min-height:100vh;}
  /* Sidebar */
  .sidebar{width:240px;background:${C.dark};display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .25s ease;}
  .sb-logo{padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px;}
  .sb-icon{width:58px;height:58px;background:transparent;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .sb-name{color:#fff;font-size:15px;font-weight:800;letter-spacing:-.01em;}
  .sb-nav{flex:1;padding:14px 0;}
  .sb-section-label{font-size:9px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.1em;text-transform:uppercase;padding:8px 22px 4px;}
  .nav-item{display:flex;align-items:center;gap:11px;padding:10px 20px;cursor:pointer;border-radius:0;transition:background .12s;}
  .nav-item:hover{background:rgba(255,255,255,.06);}
  .nav-item.active{background:rgba(190,213,47,.1);}
  .nav-ic{color:rgba(255,255,255,.4);font-size:16px;flex-shrink:0;}
  .nav-item.active .nav-ic{color:${C.lime};}
  .nav-lbl{font-size:13.5px;font-weight:500;color:rgba(255,255,255,.5);}
  .nav-item.active .nav-lbl{color:${C.lime};font-weight:700;}
  .nav-badge{margin-left:auto;background:${C.lime};color:${C.dark};font-size:10px;font-weight:800;padding:2px 7px;border-radius:8px;}
  .sb-bottom{padding:14px 18px;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px;}
  .sb-avatar{width:36px;height:36px;background:${C.lime};border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;color:${C.dark};font-size:13px;flex-shrink:0;}
  .sb-user-name{color:#fff;font-size:12.5px;font-weight:600;}
  .sb-user-email{color:rgba(255,255,255,.32);font-size:10px;margin-top:1px;}
  /* Main */
  .main{margin-left:240px;flex:1;display:flex;flex-direction:column;min-height:100vh;}
  .topbar{background:${C.white};border-bottom:1.5px solid ${C.g200};padding:15px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
  .topbar-title{font-size:20px;font-weight:800;color:${C.tPrimary};}
  .topbar-sub{font-size:12px;color:${C.tHint};margin-top:2px;}
  .dashboard-header{display:grid;gap:18px;margin:0;}
  .page{padding:24px 28px;margin-top:0;}
  /* Buttons */
  .btn{height:44px;border:none;border-radius:14px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:0 18px;font-family:inherit;font-size:13px;font-weight:700;transition:transform .15s,background .15s,box-shadow .15s;}
  .btn-lime{background:${C.lime};color:${C.dark};box-shadow:0 14px 28px rgba(190,213,47,.18);border:1px solid transparent;min-width:160px;}
  .btn-lime:hover{background:${C.limeDk};transform:translateY(-1px);box-shadow:0 16px 32px rgba(190,213,47,.22);}
  .btn-lime:active{transform:translateY(0);box-shadow:0 6px 16px rgba(190,213,47,.2);}
  .btn-lime:focus-visible{outline:2px solid ${C.dark};outline-offset:2px;}
  .btn-ghost{background:${C.white};border:1.5px solid ${C.g300};color:${C.tSecondary};}
  .btn-ghost:hover{background:${C.g100};}
  .btn-sm{height:34px;font-size:12px;padding:0 12px;}
  /* Cards */
  .card{background:${C.white};border-radius:16px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,.05);}
  .badge-panel{background:${C.g100};border:1px solid ${C.g200};border-radius:18px;padding:18px;}
  .badge-panel-title{font-size:15px;font-weight:700;color:${C.tPrimary};margin-bottom:14px;}
  .badge-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
  .badge-item{display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:16px;background:${C.g200};border:1px solid transparent;transition:transform .15s ease,background .15s ease;}
  .badge-item.unlocked{background:rgba(190,213,47,.12);border-color:rgba(190,213,47,.25);}
  .badge-item:hover{transform:translateY(-1px);}
  .badge-icon{width:44px;height:44px;border-radius:14px;background:${C.white};display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 8px 18px rgba(0,0,0,.08);}
  .badge-text{display:flex;flex-direction:column;gap:4px;min-width:0;}
  .badge-name{font-size:13px;font-weight:700;color:${C.tPrimary};line-height:1.2;}
  .badge-threshold{font-size:12px;color:${C.tSecondary};}
  .badge-status{font-size:11px;font-weight:700;text-transform:uppercase;color:${C.purple};}
  /* Stats grid */
  .stats-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:12px 20px 0;}
  .stat-card{background:${C.white};border-radius:18px;padding:14px 18px;box-shadow:0 2px 10px rgba(0,0,0,.05);min-height:100px;display:flex;align-items:flex-start;}
  .stat-card-row{display:flex;align-items:center;gap:14px;justify-content:flex-start;width:100%;min-width:0;}
  .stat-icon{width:46px;height:46px;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .stat-value{font-size:36px;font-weight:800;color:${C.tPrimary};line-height:1;}
  .stat-info{display:flex;flex-direction:column;justify-content:center;gap:4px;flex:1 1 auto;min-width:0;}
  .stat-label{font-size:13px;color:${C.tSecondary};min-width:0;}
  .stat-change{font-size:11px;font-weight:600;margin-left:auto;white-space:nowrap;flex-shrink:0;}
  .stat-pos{color:#16a34a;}.stat-neg{color:#dc2626;}
  /* Table */
  .table-wrap{background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05);}
  .table-scroll{max-height:140px;overflow-y:auto;padding-right:6px;}
  .table-scroll::-webkit-scrollbar{width:8px;height:8px}
  .table-scroll::-webkit-scrollbar-thumb{background:rgba(41,49,60,.12);border-radius:6px}
  .table-scroll::-webkit-scrollbar-track{background:transparent}
  table{width:100%;border-collapse:collapse;}
  thead{background:${C.g100};}
  th{font-size:11px;font-weight:700;color:${C.tHint};text-transform:uppercase;letter-spacing:.05em;padding:12px 16px;text-align:left;border-bottom:1.5px solid ${C.g200};}
  td{padding:14px 16px;border-bottom:1px solid ${C.g200};vertical-align:middle;font-size:13.5px;}
  tr:last-child td{border-bottom:none;}
  tr:hover td{background:${C.g100};}
  /* Search */
  .search-wrap{background:${C.white};border:1.5px solid ${C.g300};border-radius:12px;display:flex;align-items:center;gap:10px;padding:0 14px;height:42px;}
  .search-wrap input{border:none;outline:none;font-size:13.5px;color:${C.tPrimary};flex:1;background:transparent;font-family:inherit;}
  /* Chips/tags */
  .chip{padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;}
  .chip-purple{background:rgba(124,42,142,.08);color:${C.purple};}
  .chip-lime{background:rgba(190,213,47,.12);color:${C.limeDk};}
  .chip-gray{background:rgba(41,49,60,.06);color:${C.tPrimary};}
  .chip-green{background:rgba(34,197,94,.1);color:#16a34a;}
  .chip-orange{background:rgba(249,115,22,.1);color:#c2410c;}
  .chip-red{background:rgba(239,68,68,.08);color:#dc2626;}
  /* Progress */
  .prog-track{height:6px;background:${C.g200};border-radius:3px;overflow:hidden;}
  .prog-fill{height:6px;border-radius:3px;background:${C.lime};}
  /* Modals */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center;}
  .modal{background:${C.white};border-radius:20px;padding:28px;width:100%;max-width:500px;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);}
  .modal-title{font-size:18px;font-weight:800;color:${C.tPrimary};margin-bottom:20px;}
  /* Form fields */
  .field-label{font-size:12px;font-weight:600;color:${C.tSecondary};margin-bottom:6px;}
  .field-input{width:100%;height:46px;background:${C.g100};border:1.5px solid ${C.g300};border-radius:11px;padding:0 14px;font-size:14px;font-family:inherit;color:${C.tPrimary};outline:none;transition:border-color .15s;}
  .field-input:focus{border-color:${C.purple};background:${C.white};box-shadow:0 0 0 3px rgba(124,42,142,.08);}
  .field-textarea{width:100%;background:${C.g100};border:1.5px solid ${C.g300};border-radius:11px;padding:12px 14px;font-size:14px;font-family:inherit;color:${C.tPrimary};outline:none;resize:vertical;transition:border-color .15s;}
  .field-textarea:focus{border-color:${C.purple};background:${C.white};box-shadow:0 0 0 3px rgba(124,42,142,.08);}
  /* Materia cards */
  .mat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch;}
  .materia-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:22px;align-items:stretch;}
  @media (max-width:920px){
    .materia-actions{grid-template-columns:repeat(2,1fr);} 
  }
  @media (max-width:520px){
    .materia-actions{grid-template-columns:1fr;} 
  }
  .action-card{background:${C.white};border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,.06);cursor:pointer;display:flex;flex-direction:column;gap:12px;transition:transform .15s,box-shadow .15s;min-height:140px;height:100%;}
  .action-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1);}
  .action-title{font-size:15px;font-weight:800;color:${C.tPrimary};}
  .action-desc{font-size:13px;color:${C.tSecondary};line-height:1.5;}
  .action-cta{margin-top:auto;font-size:12px;font-weight:700;color:${C.lime};}
  .mat-card{background:${C.white};border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05);cursor:pointer;transition:box-shadow .15s,transform .12s;}
  .mat-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.1);transform:translateY(-2px);}
  .mat-stripe{height:5px;}
  .mat-body{padding:18px 20px;}
  /* Nota cards */
  .nota-card{background:${C.white};border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,.05);display:inline-block;cursor:pointer;transition:box-shadow .15s;width:100%;margin-bottom:14px;break-inside:avoid;-webkit-column-break-inside:avoid;}
  .nota-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;}
  .nota-bar{width:4px;min-height:42px;border-radius:999px;flex-shrink:0;}
  .nota-heading{display:flex;flex-direction:column;gap:4px;}
  .nota-content{min-width:0;display:flex;flex-direction:column;gap:10px;font-size:13px;color:${C.tPrimary};line-height:1.5;}
  .file-preview-box{background:${C.g100};border:1px solid ${C.g300};border-radius:14px;padding:14px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
  .file-preview-box .file-meta div:first-child{font-size:15px;}
  .nota-title{font-size:22px;font-weight:800;color:${C.tPrimary};line-height:1.05;margin-bottom:6px;}
  .nota-sub{font-size:13px;color:${C.tSecondary};margin-bottom:6px;}
  .nota-date{font-size:12px;color:#6b7280;font-weight:600;margin-bottom:8px;}

  /* Masonry-like notes grid using column-width to avoid main overflow */
  .notas-grid{column-gap:14px;column-width:320px;max-width:100%;}
  @media (max-width:520px){.notas-grid{column-width:260px;}}
  .file-icon{width:48px;height:48px;border-radius:12px;background:rgba(124,42,142,.08);display:flex;align-items:center;justify-content:center;font-size:18px;color:${C.purple};flex-shrink:0;}
  .file-meta{display:flex;flex-direction:column;gap:4px;min-width:0;}
  .file-chip{display:flex;align-items:center;gap:8px;background:${C.g100};border:1px solid ${C.g300};border-radius:8px;padding:10px;flex-wrap:wrap;text-decoration:none;color:inherit;}
  .nota-card:hover{box-shadow:0 4px 18px rgba(0,0,0,.08);}
  .nota-content{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px;font-size:13px;color:${C.tPrimary};line-height:1.5;}
  .file-preview-box{background:${C.g100};border:1px solid ${C.g300};border-radius:14px;padding:14px;display:flex;align-items:center;gap:14px;}
  .file-icon{width:48px;height:48px;border-radius:12px;background:rgba(124,42,142,.08);display:flex;align-items:center;justify-content:center;font-size:18px;color:${C.purple};}
  .file-meta{display:flex;flex-direction:column;gap:4px;}
  /* Link/File chips */
  .youtube-thumb img{width:100%;border-radius:10px;object-fit:cover;max-height:150px;}
  .attached-image-preview{width:100%;border-radius:10px;object-fit:cover;max-height:150px;}
  .audio-player{width:100%;}
  .audio-player audio{width:100%;height:38px;}
  .document-preview{width:100%;min-height:240px;border:1px solid ${C.g300};border-radius:14px;overflow:hidden;background:${C.g100};}
  .document-preview iframe,.document-preview embed{width:100%;height:100%;min-height:240px;border:none;}
  .link-chip{display:flex;align-items:center;gap:6px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:6px 10px;font-size:11px;}
  .file-chip{display:flex;align-items:center;gap:8px;background:${C.g100};border:1px solid ${C.g300};border-radius:8px;padding:6px 10px;font-size:11px;}
  /* Action icons */
  .act-btn{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .12s;border:none;background:transparent;}
  .act-edit{background:rgba(124,42,142,.08);}.act-edit:hover{background:rgba(124,42,142,.16);}
  .act-del{background:rgba(239,68,68,.08);}.act-del:hover{background:rgba(239,68,68,.16);}
  /* Week calendar */
  .week-cal{display:flex;gap:8px;}
  .wday{width:40px;height:48px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
  .wd-done{background:${C.lime};}
  .wd-today{background:${C.white};border:2px solid ${C.lime};}
  .wd-pending{background:rgba(255,255,255,.05);border:1.5px dashed rgba(255,255,255,.12);}
  .wd-name{font-size:9px;font-weight:700;}
  .wd-done .wd-name{color:${C.dark};}.wd-today .wd-name{color:${C.purple};}.wd-pending .wd-name{color:rgba(255,255,255,.3);}
  /* Login */
  .login-page{min-height:100vh;display:flex;}
  .login-left{width:420px;background:#222b3b;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 44px;flex-shrink:0;position:relative;overflow:hidden;}
  .login-bg{position:absolute;inset:0;background:#222b3b;overflow:hidden;z-index:0;}
  .login-bg .ball{position:absolute;border-radius:50%;backface-visibility:hidden;animation:move linear infinite;opacity:.25;}
  .login-bg .ball:nth-child(1),
  .login-bg .ball:nth-child(3),
  .login-bg .ball:nth-child(5){background:#7b3fa1;}
  .login-bg .ball:nth-child(2),
  .login-bg .ball:nth-child(4),
  .login-bg .ball:nth-child(6){background:#5f6f43;}
  .login-bg .ball:nth-child(1){width:280px;height:280px;top:-80px;right:-80px;transform-origin:-20vw 10vh;animation-duration:45s;}
  .login-bg .ball:nth-child(2){width:240px;height:240px;bottom:-90px;left:-90px;transform-origin:20vw -10vh;animation-duration:55s;}
  .login-bg .ball:nth-child(3){width:140px;height:140px;top:35%;left:60%;transform-origin:-25vw 15vh;animation-duration:60s;}
  .login-bg .ball:nth-child(4){width:120px;height:120px;top:25%;left:-50px;transform-origin:30vw 0;animation-duration:40s;}
  .login-bg .ball:nth-child(5){width:180px;height:180px;top:60%;right:-60px;transform-origin:-25vw -15vh;animation-duration:50s;}
  .login-bg .ball:nth-child(6){width:90px;height:90px;top:-30px;left:15%;transform-origin:20vw 20vh;animation-duration:35s;}
  @keyframes move{100%{transform:translate3d(0,0,1px) rotate(360deg);}}
  .login-right{flex:1;background:${C.white};display:flex;align-items:center;justify-content:center;padding:60px;}
  .login-form-box{width:100%;max-width:420px;}
  .login-tabs{display:flex;background:${C.g200};border-radius:12px;padding:4px;margin-bottom:24px;}
  .login-tab{flex:1;text-align:center;padding:9px 0;font-size:13.5px;font-weight:600;color:${C.tSecondary};border-radius:9px;cursor:pointer;transition:all .12s;}
  .login-tab.active{background:${C.white};color:${C.dark};box-shadow:0 2px 10px rgba(41,49,60,.12);}
  /* Racha */
  .racha-card{background:linear-gradient(135deg,${C.dark},#3d4a5c);border-radius:16px;padding:20px;color:#fff;}
  /* Meta card */
  .meta-big{background:linear-gradient(135deg,${C.dark},#3d4a5c);border-radius:16px;padding:22px;margin-bottom:16px;}
  /* Logros */
  .logro-badge{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;}
  .lb-earned{background:${C.purple};box-shadow:0 4px 14px rgba(124,42,142,.3);}
  .lb-locked{background:${C.g200};opacity:.6;}
  /* Filter tabs */
  .filter-tabs{display:flex;gap:8px;}
  .ftab{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;transition:all .12s;}
  .ftab-active{background:${C.dark};color:#fff;}
  .ftab-normal{background:${C.white};color:${C.tSecondary};border:1.5px solid ${C.g300};}
  .ftab-normal:hover{background:${C.g100};}
  /* Notifications */
  .toast{position:fixed;bottom:24px;right:24px;background:${C.dark};color:#fff;padding:14px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:999;display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:slideUp .2s ease;}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  /* Charts */
  .bar-chart{display:flex;align-items:flex-end;gap:8px;height:100px;padding-top:8px;}
  .bar{flex:1;border-radius:6px 6px 0 0;background:rgba(190,213,47,.25);position:relative;transition:background .15s;cursor:pointer;}
  .bar:hover{background:${C.lime};}
  .bar.today{background:${C.lime};}
  .bar-label{font-size:9px;color:${C.tHint};text-align:center;margin-top:4px;}
  /* Breadcrumb */
  .bc{font-size:12px;color:${C.tHint};margin-bottom:6px;}
  .bc span{color:${C.tPrimary};font-weight:600;}

  /* ============================================================
     RESPONSIVE / MOBILE (solo se activa por debajo de los breakpoints,
     no modifica ninguna regla de arriba usada por la version de escritorio)
     ============================================================ */
  .mobile-menu-btn{display:none;}
  .sidebar-overlay{display:none;}
  .dash-mobile-order{display:none;}
  .biblio-cards-mobile{display:none;}
  .cal-mobile{display:none;}

  @media (max-width:900px){
    .sidebar{transform:translateX(-100%);}
    .sidebar.sidebar-open{transform:translateX(0);}
    .main{margin-left:0;overflow-x:hidden;}
    html, body{overflow-x:hidden;max-width:100vw;}
    .mobile-menu-btn{
      display:flex;align-items:center;justify-content:center;
      position:fixed;top:14px;left:14px;z-index:150;
      width:42px;height:42px;border-radius:12px;border:none;
      background:${C.dark};color:#fff;cursor:pointer;
      box-shadow:0 4px 14px rgba(0,0,0,.22);
    }
    .sidebar-overlay{
      display:block;position:fixed;inset:0;background:rgba(0,0,0,.45);
      z-index:99;
    }
    /* Topbars y contenido */
    .topbar{flex-wrap:wrap;row-gap:12px;padding:14px 16px 14px 64px;}
    .dashboard-header .topbar{padding:14px 16px 14px 64px;}
    .page{padding:16px;}

    /* Inicio: en movil se muestra en el orden acciones -> stats -> card
       (en escritorio no cambia nada, .dash-desktop-only y .dash-desktop-row
       siguen visibles y .dash-mobile-order permanece oculto).
       Los !important son necesarios porque esos divs tienen un style
       inline con display:grid que si no, gana por sobre esta regla. */
    .dash-desktop-only{display:none !important;}
    .dash-desktop-row{display:none !important;}
    .dash-mobile-order{display:flex;flex-direction:column;gap:20px;margin-bottom:20px;}

    /* Racha de lectura: la franja de 7 dias tenia ancho fijo (40px c/u) que
       no cabe en pantallas angostas y desbordaba toda la pagina hacia la
       derecha. Se hace flexible para que siempre quepa. */
    .racha-card{padding:16px !important;}
    .week-cal{gap:4px !important;}
    .wday{width:auto !important;flex:1;min-width:0;height:42px !important;}
    .wd-name{font-size:8px !important;}

    /* Stats: siempre en una sola fila de 3, mas compactas.
       min-width:0 evita que el grid/las tarjetas se desborden del
       contenedor flex y empujen la tercera tarjeta fuera de pantalla. */
    .stats-grid{grid-template-columns:repeat(3,1fr) !important;gap:8px !important;margin:12px 16px 0 !important;min-width:0 !important;width:auto !important;}
    .stat-card{padding:12px 8px !important;min-height:auto !important;min-width:0 !important;}
    .stat-card-row{gap:6px !important;}
    .stat-icon{width:32px !important;height:32px !important;}
    .stat-icon svg{width:16px !important;height:16px !important;}
    .stat-value{font-size:18px !important;line-height:1.1 !important;}
    .stat-label{font-size:9.5px !important;line-height:1.2 !important;}
    .dash-mobile-order > *{min-width:0;}

    /* Grids que colapsan a una sola columna */
    .mat-grid,
    .badge-grid,
    .rt-grid-stack{grid-template-columns:1fr !important;}

    /* Mis metas: el panel de insignias se ve apretado en movil, se le
       da mas aire (menos padding lateral, mas separacion del titulo) */
    .badge-panel{padding:16px !important;margin-bottom:90px;}
    .badge-panel-title{font-size:14px !important;margin-bottom:10px !important;}
    .badge-grid{gap:10px !important;}
    .badge-item{padding:12px !important;gap:10px !important;}

    /* Materias: boton "+ Nueva materia" flotante abajo a la derecha en movil.
       No afecta el boton en escritorio (fuera de este media query sigue
       dentro del topbar como siempre). */
    .fab-nueva-materia{
      position:fixed;
      bottom:22px;
      right:18px;
      z-index:120;
      box-shadow:0 10px 24px rgba(0,0,0,.28) !important;
    }

    /* Materias (detalle): las 4 tarjetas de accion (crear nota, foto, audio,
       archivo) siempre en 2x2 en movil, mas compactas */
    .materia-actions{grid-template-columns:repeat(2,1fr) !important;gap:10px !important;}
    .action-card{padding:14px !important;min-height:auto !important;gap:8px !important;}
    .action-desc{display:none !important;}
    .action-title{font-size:13.5px !important;}
    .action-cta{font-size:11px !important;}

    /* Mi biblioteca: tabla se oculta y se muestra un listado de tarjetas */
    .biblio-table-desktop{display:none !important;}
    .biblio-cards-mobile{display:flex !important;flex-direction:column;gap:12px;padding-bottom:90px;}
    .libro-card-mobile{
      background:${C.white};
      border:1.5px solid ${C.g200};
      border-radius:16px;
      padding:14px;
    }

    .mat-grid{padding-bottom:90px;}
    .notas-grid{padding-bottom:90px;}

    /* Buscadores y filas de acciones del topbar */
    .search-wrap{width:100% !important;}
    .topbar-actions{width:100%;flex-wrap:wrap;row-gap:10px;}
    .topbar-actions .search-wrap{flex:1 1 160px;}
    .rt-mobile-wrap{flex-wrap:wrap;row-gap:10px;}
    .rt-mobile-scroll-x{overflow-x:auto;flex-wrap:nowrap !important;-webkit-overflow-scrolling:touch;padding-bottom:4px;}

    /* Tablas: permitir scroll horizontal en vez de romper el layout */
    .table-wrap{overflow-x:auto;}
    .table-wrap table{min-width:520px;}

    /* Modales */
    .modal-overlay{padding:16px;align-items:flex-start;padding-top:8vh;}
    .modal{max-width:100%;padding:20px;max-height:84vh;}

    /* Login */
    .login-page{flex-direction:column;min-height:auto;}
    .login-left{width:100%;padding:32px 24px;}
    .login-right{padding:32px 24px;}

    /* Calendario: en movil se oculta la version de escritorio (paneles
       fijos de 380px/12 meses) y se muestra .cal-mobile en su lugar */
    .rt-cal-wrap{display:none !important;}

    .cal-mobile{display:flex !important;flex-direction:column;gap:14px;}
    .cal-mobile-card{background:${C.white};border-radius:18px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.05);}
    .cal-mobile-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
    .cal-mobile-nav-btn{width:30px;height:30px;border-radius:999px;border:1px solid ${C.g300};background:${C.g100};color:${C.tPrimary};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;flex-shrink:0;}
    .cal-mobile-month-title{font-size:15px;font-weight:700;color:${C.tPrimary};cursor:pointer;text-align:center;}
    .cal-mobile-weekdays{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;color:${C.tHint};font-size:11px;font-weight:600;margin-bottom:6px;}
    .cal-mobile-grid{display:grid;grid-template-columns:repeat(7,1fr);row-gap:4px;}
    .cal-mobile-day{border:none;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:2px;padding:3px 0;font-family:inherit;}
    .cal-mobile-day-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12.5px;color:${C.tPrimary};}
    .cal-mobile-day-selected{background:${C.dark};color:#fff;font-weight:700;}
    .cal-mobile-dots{display:flex;gap:3px;height:6px;}
    .cal-mobile-dots i{width:5px;height:5px;border-radius:50%;display:block;}
    .cal-mobile-legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;padding-top:12px;border-top:1px solid ${C.g200};font-size:11px;color:${C.tSecondary};}
    .cal-mobile-legend span{display:flex;align-items:center;gap:6px;}
    .cal-mobile-legend i{width:8px;height:8px;border-radius:50%;display:inline-block;}
    .cal-mobile-day-title{font-size:15px;font-weight:700;color:${C.tPrimary};margin-bottom:14px;}
    .cal-mobile-section{margin-bottom:16px;}
    .cal-mobile-section:last-child{margin-bottom:0;}
    .cal-mobile-section-title{font-size:12.5px;font-weight:700;margin-bottom:10px;}
    .cal-mobile-empty{color:${C.tSecondary};font-size:12.5px;line-height:1.7;}
    .cal-mobile-item{border-radius:12px;padding:12px;background:${C.g100};border:1px solid #fff;}
    .cal-mobile-item-title{font-size:12.5px;font-weight:700;color:${C.tPrimary};margin-bottom:5px;}
    .cal-mobile-item-meta{font-size:11px;color:${C.tSecondary};margin-bottom:3px;}

    /* Barra flotante de sesion de lectura activa (definida en ReadingSessionBar.jsx).
       En movil se reorganiza en columna: arriba libro, abajo cronometro+botones.
       Los !important son necesarios porque esos elementos tienen estilos inline. */
    .session-bar{
      left:0 !important;
      height:auto !important;
      min-height:84px;
      flex-direction:column !important;
      align-items:stretch !important;
      justify-content:center !important;
      gap:10px !important;
      padding:12px 16px !important;
    }
    .session-bar-info{gap:10px !important;}
    .session-badge{padding:5px 10px !important;font-size:11px !important;flex-shrink:0;}
    .session-book-title{font-size:15px !important;max-width:60vw !important;}
    .session-book-author{display:none !important;}
    .session-controls-wrap{width:100%;justify-content:space-between !important;gap:12px !important;}
    .session-timer-digits{font-size:22px !important;}
    .session-buttons{gap:8px !important;}
    .session-btn{width:38px !important;height:38px !important;border-radius:9px !important;}
    .session-pageinfo{display:none !important;}
    .session-progress{left:0 !important;}

    /* Toast */
    .toast{left:16px;right:16px;bottom:16px;}
  }

  @media (max-width:480px){
    .login-features{display:none;}
    .rt-cal-months{grid-template-columns:repeat(4,1fr) !important;}
  }
`;

export default function ReadTrackApp() {
  const { user, token, isAuthenticated, login, register, logout, updateProfile, loading: authLoading, verifyEmail, resendCode, recuperarPassword, resetearPassword, pendingVerification } = useAuth();

  const [page, setPage] = useState('app');
  const [loginTab, setLoginTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', nombre: '', confirm: '', acepta: false });
  const [loginError, setLoginError] = useState('');
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [recuperarPaso, setRecuperarPaso] = useState('email'); // 'email' | 'codigo'
  const [recuperarError, setRecuperarError] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [activeMateria, setActiveMateria] = useState(null);
  const [activeLibro, setActiveLibro] = useState(null);
  const [activeNota, setActiveNota] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filtroLibros, setFiltroLibros] = useState('TODOS');
  const [librosSortOrder, setLibrosSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [sesionActiva, setSesionActiva] = useState(null);
  const [mostrarFinalizarSesion, setMostrarFinalizarSesion] = useState(false);
  const [filterTipo, setFilterTipo] = useState('todas');
  const [profileForm, setProfileForm] = useState({ nombre: user?.nombre || '', passwordActual: '', nuevaPassword: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [papelera, setPapelera] = useState(null);
  const [cargandoPapelera, setCargandoPapelera] = useState(false);
  const [mostrarPapelera, setMostrarPapelera] = useState(false);
  const [activeMateriaTab, setActiveMateriaTab] = useState('propias');
  const [emailsComparticion, setEmailsComparticion] = useState('');
  const [editandoMateria, setEditandoMateria] = useState(null);
  const [buscandoGrupo, setBuscandoGrupo] = useState('');
  const [convertirAGrupo, setConvertirAGrupo] = useState(false);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);
  const [cargandoInvitaciones, setCargandoInvitaciones] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setProfileForm({
      nombre: user?.nombre || '',
      passwordActual: '',
      nuevaPassword: '',
    });
  }, [user]);

  // API Data state
  const WEEKDAY_SHORT = ['D','L','M','X','J','V','S'];
  const MONTH_NAMES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const MONTH_NAMES_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

  const NOTIF_CONFIG_STORAGE_KEY = 'readtrack_notif_config';
  const DEFAULT_NOTIF_CONFIG = {
    recordatorios: true,
    modoOscuro: false,
    recordatorioHora: '08:00',
    recordatorioSilenciadoHasta: null, // fecha ISO hasta la que se silencian los recordatorios
    recordatorioFuente: 'todas', // 'todas' | 'propias' | 'grupo'
    notificarNotasGrupo: true,
  };
  const cargarConfigGuardada = () => {
    try {
      const guardada = localStorage.getItem(NOTIF_CONFIG_STORAGE_KEY);
      return guardada ? { ...DEFAULT_NOTIF_CONFIG, ...JSON.parse(guardada) } : DEFAULT_NOTIF_CONFIG;
    } catch {
      return DEFAULT_NOTIF_CONFIG;
    }
  };

  const [data, setData] = useState({
    user: user,
    materias: [],
    libros: [],
    notas: [],
    sesiones: [],
    meta: { paginasSemana: 400, paginasLeidas: 0, porcentaje: 0, historial: [] },
    racha: { actual: 5, maxima: 7 },
    logros: [],
    config: cargarConfigGuardada(),
    actividadSemanal: [],
  });

  // Las preferencias de notificaciones/recordatorios son propias de este
  // navegador (los permisos de notificacion tambien lo son), asi que se
  // guardan en localStorage en vez del backend.
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
    } catch {
      // Si localStorage no esta disponible simplemente no persistimos.
    }
  }, [data.config]);

  const themeColors = data.config.modoOscuro ? DARK_THEME : THEME.colors;
  const C = themeColors;
  const css = buildCss(themeColors);

  const DEFAULT_NOTAS_RAPIDAS = 'Notas rápidas';
  const normalizeMateriaNombre = (nombre) =>
    String(nombre || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[ -\u036f]/g, '');
  const findNotasRapidasMateria = (materiasList) =>
    (materiasList || data.materias).find(
      (m) => normalizeMateriaNombre(m.nombre) === normalizeMateriaNombre(DEFAULT_NOTAS_RAPIDAS)
    );

  const parseLocalDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    if (typeof value === 'string') {
      const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (dateOnlyMatch) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  };

  const formatLocalDateString = (value) => {
    const date = parseLocalDate(value);
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const ensureNotasRapidasMateria = async (materiasList = data.materias) => {
    const existing = findNotasRapidasMateria(materiasList);
    if (existing) return existing;
    try {
      const response = await materiasService.crear({
        nombre: DEFAULT_NOTAS_RAPIDAS,
        descripcion: 'Notas rápidas y recordatorios rápidos',
        semestre: '2026-1',
        color: String((materiasList?.length || data.materias.length) % COLORS_MATERIA.length),
      });
      setData((d) => ({ ...d, materias: [response.data, ...(d.materias || [])] }));
      return response.data;
    } catch (err) {
      console.error('Error creando materia Notas rápidas:', err);
      return null;
    }
  };

  const getCurrentWeekBounds = (date = new Date()) => {
    const today = new Date(date);
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
  };

  const getWeekLabel = () => {
    const { monday, sunday } = getCurrentWeekBounds();
    const startDay = monday.getDate();
    const endDay = sunday.getDate();
    const startMonth = MONTH_NAMES[monday.getMonth()];
    const endMonth = MONTH_NAMES[sunday.getMonth()];
    return startMonth === endMonth ? `${startDay}-${endDay} ${endMonth}` : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const getTodayIndex = () => new Date().getDay();
  const getTodayIndexMonday = () => (getTodayIndex() + 6) % 7;

  const getWeekActivityByDay = () => {
    return (data.actividadSemanal || []).reduce((acc, item) => {
      const localDate = parseLocalDate(item.fecha);
      const day = localDate ? localDate.getDay() : null;
      if (day !== null) {
        const index = (day + 6) % 7;
        acc[index] = item.pags || 0;
      }
      return acc;
    }, {});
  };

  const getWeekCalendarItems = () => {
    const todayIndex = getTodayIndexMonday();
    const activityByDay = getWeekActivityByDay();
    const labels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
    return labels.map((label, i) => ({
      label,
      done: activityByDay[i] > 0,
      today: i === todayIndex,
    }));
  };

  const formatSessionDate = (value) => {
    const date = parseLocalDate(value);
    if (!date) return '';
    const day = date.getDate();
    const month = MONTH_NAMES_SHORT[date.getMonth()];
    return `${day} ${month}`;
  };

  const formatWeekLabel = (value) => {
    const start = new Date(value);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startLabel = `${start.getDate()} ${MONTH_NAMES_SHORT[start.getMonth()]}`;
    const endLabel = `${end.getDate()} ${MONTH_NAMES_SHORT[end.getMonth()]}`;
    return start.getMonth() === end.getMonth() ? `${start.getDate()}-${end.getDate()} ${MONTH_NAMES_SHORT[start.getMonth()]}` : `${startLabel} - ${endLabel}`;
  };

  const getDaysLeftInWeek = () => {
    const now = new Date();
    const { sunday } = getCurrentWeekBounds(now);
    // diferencia en milisegundos, redondear hacia arriba días parciales
    const diff = Math.ceil((sunday.setHours(23,59,59,999) - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  const isInCurrentWeek = (value) => {
    const date = parseLocalDate(value);
    const { monday, sunday } = getCurrentWeekBounds();
    return date ? date >= monday && date <= sunday : false;
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated) {
      loadAppData();
      cargarInvitaciones();
    }
  }, [isAuthenticated]);

  const cargarInvitaciones = async () => {
    setCargandoInvitaciones(true);
    try {
      const response = await materiasService.listarInvitaciones();
      setInvitacionesPendientes(response.data || []);
    } catch (e) {
      console.error('Error cargando invitaciones:', e);
    } finally {
      setCargandoInvitaciones(false);
    }
  };

  const handleAceptarInvitacion = async (miembroId) => {
    try {
      await materiasService.aceptarInvitacion(miembroId);
      showToast('✅ Te uniste al grupo');
      setInvitacionesPendientes((prev) => prev.filter((inv) => inv.id !== miembroId));
      await loadAppData();
    } catch (e) {
      showToast('❌ ' + (e.data?.mensaje || 'No se pudo aceptar la invitación'));
    }
  };

  const handleRechazarInvitacion = async (miembroId) => {
    try {
      await materiasService.rechazarInvitacion(miembroId);
      showToast('Invitación rechazada');
      setInvitacionesPendientes((prev) => prev.filter((inv) => inv.id !== miembroId));
    } catch (e) {
      showToast('❌ ' + (e.data?.mensaje || 'No se pudo rechazar la invitación'));
    }
  };

  // Bandera confiable de "ya hubo al menos una carga real de datos".
  // No se puede usar solo el estado 'loading' porque su valor inicial es
  // false (arranca en false ANTES de que loadAppData siquiera se llame),
  // asi que durante ese primer instante loading tambien parece "false"
  // aunque los datos reales todavia no llegaron.
  const datosListosRef = useRef(false);

  const loadAppData = async () => {
    setLoading(true);
    try {
      const [materias, libros, notas, actividadSemanal, sesiones, racha, metaActiva, metaHistorial] = await Promise.all([
        materiasService.listar().catch(() => ({ data: [] })),
        librosService.listar().catch(() => ({ data: [] })),
        notasService.listar().catch(() => ({ data: [] })),
        statsService.actividadSemanal().catch(() => ({ data: [] })),
        sesionesService.listar().catch(() => ({ data: [] })),
        statsService.racha().catch(() => ({ data: { rachaActual: 0, rachMaxima: 0 } })),
        metasService.obtenerMeta().catch(() => ({ data: null })),
        metasService.historial().catch(() => ({ data: [] })),
      ]);

      let materiasData = materias.data || [];
      const notasRapidasMateria = findNotasRapidasMateria(materiasData);
      if (!notasRapidasMateria) {
        try {
          const responseNotasRapidas = await materiasService.crear({
            nombre: DEFAULT_NOTAS_RAPIDAS,
            descripcion: 'Notas rápidas y recordatorios rápidos',
            semestre: '2026-1',
            color: String(materiasData.length % COLORS_MATERIA.length),
          });
          if (responseNotasRapidas?.data) {
            materiasData = [responseNotasRapidas.data, ...materiasData];
          }
        } catch (err) {
          console.error('No se pudo crear la materia Notas rápidas:', err);
        }
      }
      let weekBounds = getCurrentWeekBounds();

      const formatDateOnly = formatLocalDateString;

      // Determinar el rango de semana: desde semanaInicio de la meta si existe, o desde el lunes actual
      let weekStart, weekEnd;
      if (metaActiva.data?.semanaInicio) {
        const metaStart = parseLocalDate(metaActiva.data.semanaInicio);
        if (metaStart) {
          metaStart.setHours(0, 0, 0, 0);
          const metaEnd = new Date(metaStart);
          metaEnd.setDate(metaEnd.getDate() + 6); // 7 días total
          metaEnd.setHours(23, 59, 59, 999);
          weekBounds = { monday: metaStart, sunday: metaEnd };
          weekStart = formatDateOnly(metaStart);
          weekEnd = formatDateOnly(metaEnd);
        } else {
          weekStart = formatDateOnly(weekBounds.monday);
          weekEnd = formatDateOnly(weekBounds.sunday);
        }
      } else {
        weekStart = formatDateOnly(weekBounds.monday);
        weekEnd = formatDateOnly(weekBounds.sunday);
      }

      const activityMap = new Map(
        (actividadSemanal.data || [])
          .map((item) => {
            const fechaStr = item.fecha ? formatLocalDateString(item.fecha) : null;
            return {
              ...item,
              fecha: fechaStr,
              pags: Number(item.paginas ?? item.pags ?? 0),
            };
          })
          .filter((item) => item.fecha && item.fecha >= weekStart && item.fecha <= weekEnd)
          .map((item) => [item.fecha, item])
      );


      const actividadActual = Array.from({ length: 7 }, (_, index) => {
        const diaFecha = new Date(weekBounds.monday);
        diaFecha.setDate(weekBounds.monday.getDate() + index);
        diaFecha.setHours(0, 0, 0, 0);
        const fecha = diaFecha.toISOString().split('T')[0];
        const item = activityMap.get(fecha);
        return {
          fecha,
          dia: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][index],
          pags: item?.pags || 0,
        };
      });
      
      const totalPaginas = actividadActual.reduce((sum, d) => sum + d.pags, 0);



      setData(d => ({
        ...d,
        materias: materiasData,
        libros: libros.data || [],
        notas: notas.data || [],
        sesiones: sesiones.data || [],
        actividadSemanal: actividadActual,
        meta: {
          paginasSemana: metaActiva.data?.paginasSemana || d.meta.paginasSemana,
          paginasLeidas: metaActiva.data?.paginasLeidas || 0,
          porcentaje: metaActiva.data?.porcentaje || 0,
          semanaInicio: metaActiva.data?.semanaInicio || null,
          historial: metaHistorial.data || [],
        },
        racha: {
          actual: racha.data?.rachaActual || d.racha.actual,
          maxima: racha.data?.rachMaxima || d.racha.maxima,
        },
        user: user,
      }));
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
    setLoading(false);
    datosListosRef.current = true;
  };

  const openNotaRapida = async () => {
    let materia = findNotasRapidasMateria(data.materias);
    if (!materia) {
      materia = await ensureNotasRapidasMateria();
    }
    if (!materia) {
      showToast('No se pudo encontrar o crear la materia Notas rápidas.');
      return;
    }
    setActiveMateria(materia);
    setModal('nueva_nota');
  };

  const openFotoRapida = async () => {
    let materia = findNotasRapidasMateria(data.materias);
    if (!materia) {
      materia = await ensureNotasRapidasMateria();
    }
    if (!materia) {
      showToast('No se pudo encontrar o crear la materia Notas rápidas.');
      return;
    }
    setActiveMateria(materia);
    setModal('agregar_foto');
  };

  const openAudioRapido = async () => {
    let materia = findNotasRapidasMateria(data.materias);
    if (!materia) {
      materia = await ensureNotasRapidasMateria();
    }
    if (!materia) {
      showToast('No se pudo encontrar o crear la materia Notas rápidas.');
      return;
    }
    setActiveMateria(materia);
    setModal('agregar_audio');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ===== Notificaciones nativas del navegador (recordatorios) =====
  const solicitarPermisoNotificaciones = async () => {
    if (!('Notification' in window)) {
      showToast('Tu navegador no soporta notificaciones');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') {
      showToast('Las notificaciones están bloqueadas para este sitio. Actívalas desde la configuración del navegador.');
      return false;
    }
    const permiso = await Notification.requestPermission();
    if (permiso !== 'granted') {
      showToast('No se concedió permiso para mostrar notificaciones');
    }
    return permiso === 'granted';
  };

  const mostrarNotificacionNativa = async (titulo, cuerpo) => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta Notification API');
      return;
    }
    if (Notification.permission !== 'granted') {
      console.warn('Permiso de notificaciones no concedido:', Notification.permission);
      return;
    }
    const opciones = {
      body: cuerpo,
      icon: '/vite.svg',
      tag: 'readtrack-recordatorio-' + Date.now(), // tag unico: si repite tag antes de que la anterior se cierre, el navegador la reemplaza en silencio
    };
    try {
      // Chrome para Android (y varios navegadores moviles) bloquean el
      // constructor new Notification() directo con "Illegal constructor" y
      // exigen mostrarlas a traves de un Service Worker. En escritorio
      // ambos caminos funcionan, asi que se prefiere el Service Worker
      // cuando esta disponible para que funcione igual en los dos casos.
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(titulo, opciones);
      } else {
        const notif = new Notification(titulo, opciones);
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      }
      // Confirmacion en pantalla de que el codigo se ejecuto sin errores.
      // Si Chrome tiene la pestaña enfocada, no muestra el globo emergente
      // y la manda directo al Centro de notificaciones de Windows/macOS/
      // Android, asi que esto ayuda a distinguir "no se ejecuto" de "el
      // sistema la escondio".
      showToast('🔔 Notificación creada (si no ves el globo emergente, revisa el Centro de notificaciones del sistema)');
    } catch (e) {
      console.error('Error mostrando notificación:', e);
      showToast('❌ Error al crear la notificación: ' + e.message);
    }
  };

  // Chequeo periódico: ¿ya es la hora configurada del recordatorio y hay
  // notas pendientes con fecha de cumplimiento según la fuente elegida?
  useEffect(() => {
    const revisar = () => {
      if (!data.config.recordatorios) return;
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

      const silenciadoHasta = data.config.recordatorioSilenciadoHasta;
      if (silenciadoHasta && new Date(silenciadoHasta) > new Date()) return;

      const ahora = new Date();
      const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
      if (horaActual !== (data.config.recordatorioHora || '08:00')) return;

      const hoyStr = formatLocalDateString(ahora);
      if (localStorage.getItem('readtrack_recordatorio_ultimo_envio') === hoyStr) return;

      const materiasGrupoIds = new Set(data.materias.filter(m => m.esGrupo).map(m => m.id));
      const fuente = data.config.recordatorioFuente || 'todas';
      const notasPendientes = data.notas.filter(n => {
        if (!n.fechaCumplimiento) return false;
        const esDeGrupo = materiasGrupoIds.has(n.materiaId);
        if (fuente === 'propias' && esDeGrupo) return false;
        if (fuente === 'grupo' && !esDeGrupo) return false;
        // Solo notas cuya fecha de cumplimiento es HOY (no cualquier fecha
        // pasada; una nota vencida hace semanas no debe seguir avisando
        // todos los dias para siempre).
        return formatLocalDateString(new Date(n.fechaCumplimiento)) === hoyStr;
      });

      localStorage.setItem('readtrack_recordatorio_ultimo_envio', hoyStr);

      if (notasPendientes.length > 0) {
        mostrarNotificacionNativa(
          '📚 ReadTrack UTS · Recordatorio de lectura',
          `Tienes ${notasPendientes.length} nota${notasPendientes.length > 1 ? 's' : ''} pendiente${notasPendientes.length > 1 ? 's' : ''} con fecha de cumplimiento.`
        );
      }
    };

    const intervalo = setInterval(revisar, 30000);
    revisar();
    return () => clearInterval(intervalo);
  }, [data.config, data.notas, data.materias]);

  // Aviso cuando se agrega una nota nueva en una materia de grupo
  const notasGrupoVistasRef = useRef(null);
  useEffect(() => {
    // Importante: antes de la primera carga real de datos, data.notas
    // todavia esta vacio (el placeholder inicial), asi que hay que esperar
    // a que termine para no tomar ese arreglo vacio como base y terminar
    // "avisando" de todas las notas viejas ya existentes.
    if (!datosListosRef.current) return;

    const materiasGrupo = data.materias.filter(m => m.esGrupo);
    const materiasGrupoIds = new Set(materiasGrupo.map(m => m.id));
    const notasGrupoActuales = data.notas.filter(n => materiasGrupoIds.has(n.materiaId));
    const idsActuales = new Set(notasGrupoActuales.map(n => n.id));

    console.log('[notif-grupo] chequeo:', {
      miUserId: user?.id,
      materiasGrupo: materiasGrupo.map(m => ({ id: m.id, nombre: m.nombre, dueño: m.usuarioId })),
      notasGrupoActuales: notasGrupoActuales.map(n => ({ id: n.id, materiaId: n.materiaId, autorId: n.autorId, texto: (n.texto || '').slice(0, 20) })),
      vistasAntes: notasGrupoVistasRef.current ? [...notasGrupoVistasRef.current] : null,
    });

    if (notasGrupoVistasRef.current === null) {
      // Primera vez con datos reales ya cargados: solo se guarda el set
      // inicial, no se notifica nada retroactivo.
      notasGrupoVistasRef.current = idsActuales;
      console.log('[notif-grupo] primera carga, guardando base sin notificar:', [...idsActuales]);
      return;
    }

    if (data.config.notificarNotasGrupo && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      // El campo del autor de la nota es "autorId" (no "usuarioId"). Con
      // esto nos aseguramos de notificar solo las notas que agregó un
      // compañero, y nunca las que el propio usuario acaba de crear.
      const nuevas = notasGrupoActuales.filter(n => !notasGrupoVistasRef.current.has(n.id) && n.autorId !== user?.id);
      console.log('[notif-grupo] notas nuevas detectadas:', nuevas.map(n => ({ id: n.id, materiaId: n.materiaId, autorId: n.autorId })));
      nuevas.forEach(n => {
        const materia = data.materias.find(m => m.id === n.materiaId);
        mostrarNotificacionNativa(
          '👥 Nueva nota en grupo',
          `Se agregó una nota nueva en "${materia?.nombre || 'un grupo'}".`
        );
      });
    }

    notasGrupoVistasRef.current = idsActuales;
  }, [data.notas, data.materias, data.config.notificarNotasGrupo, user?.id]);

  // Actualizacion periodica en segundo plano de notas y materias.
  // Sin esto, data.notas solo se llena una vez al cargar la pagina y nunca
  // vuelve a pedirse al servidor, asi que una nota que agregue un
  // compañero mientras ya tienes la app abierta nunca se detecta (por eso
  // antes solo aparecia si recargabas la pagina a mano).
  useEffect(() => {
    const activo = data.config.notificarNotasGrupo || data.config.recordatorios;
    if (!activo) return;

    const actualizarEnSegundoPlano = async () => {
      if (!datosListosRef.current) return; // aun no termina la carga inicial
      try {
        const [notasResp, materiasResp] = await Promise.all([
          notasService.listar().catch(() => null),
          materiasService.listar().catch(() => null),
        ]);
        setData(d => ({
          ...d,
          notas: notasResp?.data || d.notas,
          materias: materiasResp?.data || d.materias,
        }));
      } catch (e) {
        console.error('Error actualizando notas/materias en segundo plano:', e);
      }
    };

    // Cada 60 segundos mientras la pestaña esta abierta...
    const intervalo = setInterval(actualizarEnSegundoPlano, 60000);

    // ...y tambien apenas vuelves a esta pestaña despues de estar en otra
    // app o con la pantalla bloqueada (los navegadores pausan los timers
    // en segundo plano para ahorrar batería, asi que el intervalo de
    // arriba no es confiable mientras el celular esta con la pantalla
    // apagada; esto ayuda a que se ponga al dia apenas vuelves a mirarla).
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') actualizarEnSegundoPlano();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(intervalo);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [data.config.notificarNotasGrupo, data.config.recordatorios]);

  const handleCrearMateria = async (form, close) => {
    if (!form.nombre) {
      showToast('El nombre de la materia es obligatorio');
      return;
    }
    try {
      const response = await materiasService.crear({
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        semestre: form.semestre || '2026-1',
        color: String(data.materias.length % COLORS_MATERIA.length),
      });
      setData(d => ({ ...d, materias: [response.data, ...d.materias] }));
      showToast('✅ Materia creada exitosamente');
      close();
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo crear la materia');
    }
  };

  const handleVerNota = async (n) => {
    setActiveNota(n);
    setModal('ver_nota');
    try {
      const res = await notasService.detalle(n.id);
      if (res?.data) setActiveNota(res.data);
    } catch {
      // queda con el objeto local si falla
    }
  };

  const handleCrearNota = async (form, close) => {
    if (!activeMateria) {
      showToast('Selecciona una materia antes de crear una nota');
      return;
    }
    const archivos = form.archivos && form.archivos.length > 0 ? form.archivos : (form.archivo ? [form.archivo] : []);
    if (!form.texto && !form.enlace && archivos.length === 0) {
      showToast('La nota debe tener texto, enlace o al menos un archivo');
      return;
    }
    try {
      let response;
      if (archivos.length > 0) {
        const formData = new FormData();
        formData.append('materiaId', activeMateria.id);
        if (form.texto) formData.append('texto', form.texto);
        if (form.enlace) formData.append('enlace', form.enlace);
        if (form.fechaCumplimiento) formData.append('fechaCumplimiento', formatLocalDateString(form.fechaCumplimiento));
        archivos.forEach((archivo) => formData.append('archivos', archivo));
        response = await notasService.crearConArchivo(formData);
      } else {
        response = await notasService.crear({ materiaId: activeMateria.id, texto: form.texto || null, enlace: form.enlace || null, fechaCumplimiento: form.fechaCumplimiento ? formatLocalDateString(form.fechaCumplimiento) : null });
      }
      setData(d => ({ ...d, notas: [response.data, ...d.notas] }));
      showToast('✅ Nota creada exitosamente');
      close();
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo crear la nota');
    }
  };

  const handleEditarNota = async (form, close) => {
    if (!activeNota) {
      showToast('Selecciona una nota para editar');
      return;
    }
    if (!form.texto && !form.enlace) {
      showToast('La nota debe tener texto o enlace');
      return;
    }
    try {
      const response = await notasService.actualizar(activeNota.id, { texto: form.texto || null, enlace: form.enlace || null, fechaCumplimiento: form.fechaCumplimiento ? formatLocalDateString(form.fechaCumplimiento) : null });
      setData(d => ({ ...d, notas: d.notas.map(n => (n.id === activeNota.id ? response.data : n)) }));
      showToast('✅ Nota actualizada');
      close();
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo actualizar la nota');
    }
  };

  const handleCrearLibro = async (form, close) => {
    if (!form.titulo || !form.totalPaginas) {
      showToast('Título y total de páginas son obligatorios');
      return;
    }
    try {
      const response = await librosService.crear({
        titulo: form.titulo,
        autor: form.autor || null,
        totalPaginas: Number(form.totalPaginas) || 0,
        estado: form.estado || 'PENDIENTE',
        paginasLeidas: form.estado === 'LEYENDO' ? (Number(form.paginasLeidas) || 0) : undefined,
      });
      setData(d => ({ ...d, libros: [response.data, ...d.libros] }));
      showToast('✅ Libro agregado a tu biblioteca');
      close();
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo agregar el libro');
    }
  };

  const handleEditarLibro = async (form, close) => {
    if (!activeLibro) {
      showToast('Selecciona un libro para editar');
      return;
    }
    if (!form.titulo || !form.totalPaginas) {
      showToast('Título y total de páginas son obligatorios');
      return;
    }
    try {
      const response = await librosService.actualizar(activeLibro.id, {
        titulo: form.titulo,
        autor: form.autor || null,
        totalPaginas: Number(form.totalPaginas) || 0,
        estado: form.estado || 'PENDIENTE',
      });
      setData(d => ({ ...d, libros: d.libros.map(l => (l.id === activeLibro.id ? response.data : l)) }));
      showToast('✅ Libro actualizado');
      close();
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo actualizar el libro');
    }
  };

  const handleEliminarMateria = async (materia) => {
    try {
      await materiasService.eliminar(materia.id);
      setData(d => ({
        ...d,
        materias: d.materias.filter(x => x.id !== materia.id),
        notas: d.notas.filter(n => n.materiaId !== materia.id),
      }));
      if (activeMateria?.id === materia.id) {
        setActiveMateria(null);
      }
      showToast('✅ Materia eliminada');
    } catch (err) {
      console.error('Error eliminando materia:', err);
      showToast(err.data?.mensaje || 'No se pudo eliminar la materia');
    }
  };

  const handleEliminarLibro = async (libro) => {
    try {
      await librosService.eliminar(libro.id);
      setData(d => ({ ...d, libros: d.libros.filter(x => x.id !== libro.id) }));
      if (activeLibro?.id === libro.id) {
        setActiveLibro(null);
      }
      showToast('✅ Libro eliminado');
    } catch (err) {
      console.error('Error eliminando libro:', err);
      showToast(err.data?.mensaje || 'No se pudo eliminar el libro');
    }
  };

  const handleCambiarEstadoLibro = async (libro) => {
    const ciclo = { PENDIENTE: 'LEYENDO', LEYENDO: 'TERMINADO', TERMINADO: 'PENDIENTE' };
    const estado = ciclo[libro.estado] || 'PENDIENTE';
    try {
      const response = await librosService.cambiarEstado(libro.id, estado);
      setData(d => ({ ...d, libros: d.libros.map(l => (l.id === libro.id ? response.data : l)) }));
      showToast(`✅ Estado actualizado a ${estado.toLowerCase()}`);
    } catch (err) {
      showToast(err.data?.mensaje || 'No se pudo actualizar el estado del libro');
    }
  };

  const handleIniciarSesion = async (config) => {
    if (!activeLibro) return;
    const reiniciandoDesdeTerminado = activeLibro.estado === 'TERMINADO';
    let libroEnLectura = activeLibro;

    if (reiniciandoDesdeTerminado) {
      try {
        const response = await librosService.cambiarEstado(activeLibro.id, 'PENDIENTE');
        libroEnLectura = response.data;
        setData((d) => ({
          ...d,
          libros: d.libros.map((l) => (l.id === activeLibro.id ? libroEnLectura : l)),
        }));
        setActiveLibro(libroEnLectura);
      } catch (err) {
        showToast(err.data?.mensaje || 'No se pudo reiniciar el libro.');
        return;
      }
    }

    setSesionActiva({
      libro: libroEnLectura,
      paginaInicial: config.paginaInicial,
      tiempoMinutos: config.tiempoMinutos,
      tipo: config.tipo,
      horaInicio: new Date(),
      musicaActiva: config.musicaActiva || false,
      musicaNombre: config.musicaNombre || '',
      musicaSrc: config.musicaSrc || '',
    });
    setModal(null);
    showToast('✅ Sesión de lectura iniciada');
  };

  const handleActualizarSesion = (config) => {
    if (!sesionActiva) return;
    setSesionActiva(s => ({
      ...s,
      ...config,
    }));
    showToast('✅ Tiempo de sesión actualizado');
  };

  const handleFinalizarSesion = async (paginaFinal, paginasLidas) => {
    if (!sesionActiva) return;
    if (paginasLidas <= 0) {
      showToast('Debes registrar al menos una página leída para guardar la sesión');
      return;
    }
    try {
      // Guardar la sesión en el backend
      const response = await sesionesService.crearSesion({
        libroId: sesionActiva.libro.id,
        paginaInicio: sesionActiva.paginaInicial,
        paginaFin: paginaFinal,
        duracionMinutos: sesionActiva.tiempoMinutos,
        fecha: formatLocalDateString(new Date()),
      });

      const libroActualizado = response.data.libroActualizado;
      const nuevaSesion = {
        ...response.data.sesion,
        libro: {
          id: sesionActiva.libro.id,
          titulo: sesionActiva.libro.titulo,
        },
      };

      setData(d => ({
        ...d,
        libros: d.libros.map(l => (l.id === sesionActiva.libro.id ? libroActualizado : l)),
        sesiones: [nuevaSesion, ...(d.sesiones || [])],
      }));

      setSesionActiva(null);
      setMostrarFinalizarSesion(false);
      showToast(`✅ Sesión guardada - ${paginasLidas} páginas leídas`);
      await loadAppData();
    } catch (err) {
      showToast(err.data?.mensaje || 'Error al guardar la sesión');
    }
  };

  const handleLogin = async () => {
    setLoginError('');
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Por favor completa los campos');
      showToast('Por favor completa los campos');
      return;
    }
    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      setLoginError('');
      showToast('✅ Sesión iniciada');
      setPage('app');
      setLoginForm({ email: '', password: '', nombre: '', confirm: '', acepta: false });
    } else {
      setLoginError(result.error || 'No se pudo iniciar sesión');
      showToast('❌ ' + result.error);
    }
  };

  const handleRegister = async () => {
    setLoginError('');
    if (!loginForm.nombre || !loginForm.email || !loginForm.password || !loginForm.confirm) {
      setLoginError('Por favor completa todos los campos');
      showToast('Por favor completa todos los campos');
      return;
    }
    if (loginForm.password !== loginForm.confirm) {
      setLoginError('Las contraseñas no coinciden');
      showToast('Las contraseñas no coinciden');
      return;
    }
    if (!loginForm.acepta) {
      setLoginError('Debes aceptar los términos');
      showToast('Debes aceptar los términos');
      return;
    }
    const result = await register(loginForm.nombre, loginForm.email, loginForm.password, loginForm.acepta);
    if (result.success) {
      setLoginError('');
      if (result.emailEnviado === false) {
        showToast('⚠️ Cuenta creada, pero no se pudo enviar el correo. Usa "Reenviar código" o contacta al administrador.');
        if (result.errorDev) console.error('Detalle error envío correo:', result.errorDev);
      } else {
        showToast('✅ Cuenta creada. Verifica tu correo');
      }
      if (result.codigoDev) {
        console.log('Código de verificación (modo desarrollo):', result.codigoDev);
      }
      setModal('verificar_correo');
      setLoginForm({ email: '', password: '', nombre: '', confirm: '', acepta: false });
    } else {
      setLoginError(result.error || 'No se pudo crear la cuenta');
      showToast('❌ ' + result.error);
    }
  };

  const handleOpenEditProfile = () => {
    setProfileForm({
      nombre: user?.nombre || '',
      passwordActual: '',
      nuevaPassword: '',
    });
    setModal('editar_perfil');
  };

  const handleSaveProfile = async () => {
    if (!profileForm.nombre.trim()) {
      showToast('El nombre no puede quedar vacío');
      return;
    }
    if (profileForm.nuevaPassword && profileForm.nuevaPassword.length < 8) {
      showToast('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (profileForm.nuevaPassword && !profileForm.passwordActual) {
      showToast('Debes ingresar la contraseña actual para cambiarla');
      return;
    }

    setProfileSaving(true);
    const result = await updateProfile({
      nombre: profileForm.nombre.trim(),
      passwordActual: profileForm.passwordActual || undefined,
      nuevaPassword: profileForm.nuevaPassword || undefined,
    });
    setProfileSaving(false);

    if (result.success) {
      showToast('✅ Perfil actualizado');
      setModal(null);
      setProfileForm((prev) => ({ ...prev, passwordActual: '', nuevaPassword: '' }));
      await loadAppData().catch(() => {});
    } else {
      showToast('❌ ' + result.error);
    }
  };

  const cargarPapelera = async () => {
    try {
      setCargandoPapelera(true);
      const result = await authService.obtenerPapelera();
      setPapelera(result.datos || result.data || result);
    } catch (error) {
      console.error('Error cargando papelera:', error);
      showToast('❌ Error al cargar papelera');
    } finally {
      setCargandoPapelera(false);
    }
  };

  useEffect(() => {
    if (mostrarPapelera && !papelera) {
      cargarPapelera();
    }
  }, [mostrarPapelera]);

  const handleRestaurarElemento = async (tipo, id) => {
    try {
      if (tipo === 'libro') {
        await librosService.restaurar(id);
        showToast('✅ Libro restaurado');
      } else if (tipo === 'nota') {
        await notasService.restaurar(id);
        showToast('✅ Nota restaurada');
      } else if (tipo === 'materia') {
        await materiasService.restaurar(id);
        showToast('✅ Materia restaurada');
      }
      await cargarPapelera();
      await loadAppData();
    } catch (error) {
      console.error('Error restaurando elemento:', error);
      showToast('❌ Error al restaurar elemento');
    }
  };

  const handleEliminarCuenta = async () => {
    const confirmar = window.confirm(
      '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\n' +
      'Esto eliminará permanentemente tu cuenta, todos tus datos y no se puede deshacer.\n\n' +
      'Escribe tu nombre completo para confirmar.'
    );
    
    if (!confirmar) return;

    const nombreConfirmacion = window.prompt('Escribe tu nombre completo para confirmar la eliminación:');
    if (nombreConfirmacion !== user?.nombre) {
      showToast('❌ Nombre no coincide. Operación cancelada.');
      return;
    }

    try {
      await authService.eliminarCuenta();
      showToast('✅ Cuenta eliminada');
      logout();
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      showToast('❌ ' + (error.data?.mensaje || 'Error al eliminar cuenta'));
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <img
          src={loadingDotsIcon}
          alt="Cargando"
          style={{ width: 48, height: 48, display: 'block' }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <style>{css}</style>
        <div className="login-left">
          <div className="login-bg">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <AppLogoIcon size={96} withBackground={false} />
          </div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 6, position: 'relative', zIndex: 1 }}>
            ReadTrack UTS
          </div>
          <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 1 }}>
            Tu hábito lector y estudio, siempre organizados
          </div>
          <div className="login-features">
            {[
              { color: 'rgba(124,42,142,.3)', ic: <BookIcon size={18} color={C.lime} />, txt: <>
                <b style={{ color: '#fff' }}>Organiza tus materias</b> — notas, apuntes, videos y archivos en un solo lugar
              </> },
              { color: 'rgba(190,213,47,.2)', ic: <ChartIcon size={18} />, txt: <>
                <b style={{ color: '#fff' }}>Sigue tu progreso lector</b> — estadísticas, metas semanales y rachas
              </> },
              { color: 'rgba(255,255,255,.1)', ic: <StarIcon size={18} color="rgba(255,255,255,.7)" />, txt: <>
                <b style={{ color: '#fff' }}>Gana logros</b> — insignias por constancia y metas cumplidas
              </> },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.color, flexShrink: 0 }}>
                  {f.ic}
                </div>
                <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 13.5, lineHeight: 1.5 }}>{f.txt}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-box">
            <div style={{ fontSize: 25, fontWeight: 800, color: C.tPrimary, marginBottom: 4 }}>
              {loginTab === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </div>
            <div style={{ fontSize: 13.5, color: C.tHint, marginBottom: 22 }}>
              {loginTab === 'login' ? 'Ingresa con tu correo institucional UTS' : 'Completa el formulario para unirte'}
            </div>
            <div className="login-tabs">
              <div className={`login-tab ${loginTab === 'login' ? 'active' : ''}`} onClick={() => { setLoginTab('login'); setLoginError(''); }}>
                Ingresar
              </div>
              <div className={`login-tab ${loginTab === 'registro' ? 'active' : ''}`} onClick={() => { setLoginTab('registro'); setLoginError(''); }}>
                Registrarse
              </div>
            </div>

            {loginTab === 'registro' && (
              <div style={{ marginBottom: 14 }}>
                <div className="field-label">Nombre completo</div>
                <input
                  className="field-input"
                  placeholder="Tu nombre completo"
                  value={loginForm.nombre}
                  onChange={(e) => setLoginForm({ ...loginForm, nombre: e.target.value })}
                  style={{ marginBottom: 0 }}
                />
              </div>
            )}

            <div style={{ marginBottom: loginTab === 'registro' ? 0 : 14 }}>
              <div className="field-label">Correo institucional</div>
              <input
                className="field-input"
                type="email"
                placeholder="usuario@uts.edu.co"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>

            {loginForm.email.includes('@') && loginForm.email.endsWith('uts.edu.co') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '9px 14px', marginBottom: 14 }}>
                <CheckIcon />
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Dominio UTS verificado</span>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div className="field-label">Contraseña</div>
              <input
                className="field-input"
                type="password"
                placeholder={loginTab === 'registro' ? 'Mínimo 8 caracteres' : 'Tu contraseña'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            {loginTab === 'registro' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div className="field-label">Confirmar contraseña</div>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Repetir contraseña"
                    value={loginForm.confirm}
                    onChange={(e) => setLoginForm({ ...loginForm, confirm: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
                  <div
                    onClick={() => setLoginForm({ ...loginForm, acepta: !loginForm.acepta })}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: loginForm.acepta ? C.purple : C.g200,
                      border: `2px solid ${loginForm.acepta ? C.purple : C.g300}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {loginForm.acepta && <CheckIcon />}
                  </div>
                  <span style={{ fontSize: 12.5, color: C.tSecondary, lineHeight: 1.55 }}>
                    He leído y acepto los <span style={{ color: C.purple, fontWeight: 600 }}>términos y condiciones</span> y autorizo el tratamiento de mis datos personales conforme a la{' '}
                    <span style={{ color: C.purple, fontWeight: 600 }}> Ley 1581 de 2012</span>
                  </span>
                </div>
              </>
            )}

            {loginTab === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 18 }}>
                <span
                  style={{ fontSize: 12.5, color: C.purple, fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    setRecuperarPaso('email');
                    setRecuperarEmail(loginForm.email || '');
                    setRecuperarError('');
                    setModal('recuperar_password');
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            )}

            {loginError && (
              <div style={{
                background: 'rgba(239,68,68,.12)',
                border: '1px solid rgba(239,68,68,.4)',
                color: '#ef4444',
                fontSize: 13,
                padding: '10px 14px',
                borderRadius: 10,
                marginBottom: 14,
              }}>
                ⚠️ {loginError}
              </div>
            )}

            <button
              className="btn btn-lime"
              style={{ width: '100%', justifyContent: 'center', height: 50, fontSize: 15, marginBottom: 14 }}
              onClick={() => (loginTab === 'login' ? handleLogin() : handleRegister())}
            >
              {loginTab === 'login' ? 'Ingresar a ReadTrack UTS' : 'Crear cuenta en ReadTrack UTS'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13.5, color: C.tSecondary }}>
              {loginTab === 'login' ? (
                <>
                  ¿No tienes cuenta?{' '}
                  <span style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }} onClick={() => { setLoginTab('registro'); setLoginError(''); }}>
                    Regístrate aquí
                  </span>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <span style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }} onClick={() => { setLoginTab('login'); setLoginError(''); }}>
                    Inicia sesión
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {modal === 'verificar_correo' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}>
            <div style={{
              background: C.white,
              borderRadius: 16,
              padding: 40,
              maxWidth: 420,
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,.15)',
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tPrimary, marginBottom: 12 }}>Verifica tu correo</h2>
              <p style={{ fontSize: 14, color: C.tSecondary, marginBottom: 24, lineHeight: 1.6 }}>
                Enviamos un código de 6 dígitos a <span style={{ fontWeight: 600, color: C.tPrimary }}>{pendingVerification || user?.email || 'tu correo'}</span>, Ingresalo aquí para activar tu cuenta. Revisa tu carpeta de spam o haz clic en "Reenviar código"
              </p>
              
              <input
                id="verification-code"
                type="text"
                maxLength="6"
                placeholder="000000"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 24,
                  fontWeight: 700,
                  textAlign: 'center',
                  letterSpacing: '8px',
                  border: `2px solid ${C.g300}`,
                  borderRadius: 10,
                  marginBottom: 20,
                  fontFamily: 'monospace',
                }}
              />

              <button
                className="btn btn-lime"
                style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 12, justifyContent: 'center' }}
                onClick={async () => {
                  const code = document.getElementById('verification-code').value;
                  if (!code || code.length !== 6) {
                    showToast('Por favor ingresa el código de 6 dígitos');
                    return;
                  }
                  try {
                    await verifyEmail(pendingVerification || user?.email, code);
                    showToast('✅ Correo verificado exitosamente');
                    setModal(null);
                    document.getElementById('verification-code').value = '';
                    setLoginTab('login'); setLoginError('');
                  } catch (err) {
                    showToast('❌ ' + (err.data?.mensaje || 'Código inválido o expirado'));
                  }
                }}
              >
                Verificar
              </button>
              
              <button
                style={{
                  width: '100%',
                  height: 46,
                  border: `2px solid ${C.g300}`,
                  background: 'transparent',
                  borderRadius: 10,
                  fontSize: 14,
                  color: C.tPrimary,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setModal(null);
                  setLoginTab('login'); setLoginError('');
                }}
              >
                Cancelar
              </button>

              <p style={{ fontSize: 12, color: C.tHint, textAlign: 'center', marginTop: 16 }}>
                ¿No recibes el código?{' '}
                <span
                  style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }}
                  onClick={async () => {
                    const email = pendingVerification || user?.email;
                    if (!email) return;
                    const result = await resendCode(email);
                    if (result.success) {
                      showToast(result.emailEnviado === false ? '⚠️ ' + result.mensaje : '✅ Código reenviado');
                      if (result.codigoDev) {
                        console.log('Código de verificación (modo desarrollo):', result.codigoDev);
                      }
                      if (result.errorDev) {
                        console.error('Detalle error envío correo:', result.errorDev);
                      }
                    } else {
                      showToast('❌ ' + result.error);
                    }
                  }}
                >
                  Reenviar código
                </span>
              </p>
            </div>
          </div>
        )}

        {modal === 'recuperar_password' && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}>
            <div style={{
              background: C.white,
              borderRadius: 16,
              padding: 40,
              maxWidth: 420,
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,.15)',
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tPrimary, marginBottom: 12 }}>
                Recuperar contraseña
              </h2>

              {recuperarError && (
                <div style={{
                  background: 'rgba(239,68,68,.12)',
                  border: '1px solid rgba(239,68,68,.4)',
                  color: '#ef4444',
                  fontSize: 13,
                  padding: '10px 14px',
                  borderRadius: 10,
                  marginBottom: 16,
                }}>
                  ⚠️ {recuperarError}
                </div>
              )}

              {recuperarPaso === 'email' ? (
                <>
                  <p style={{ fontSize: 14, color: C.tSecondary, marginBottom: 20, lineHeight: 1.6 }}>
                    Ingresa tu correo institucional y te enviaremos un código para restablecer tu contraseña.
                  </p>
                  <input
                    type="email"
                    placeholder="tucorreo@uts.edu.co"
                    value={recuperarEmail}
                    onChange={(e) => setRecuperarEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: 14,
                      border: `2px solid ${C.g300}`,
                      borderRadius: 10,
                      marginBottom: 20,
                      color: C.tPrimary,
                      background: 'transparent',
                    }}
                  />
                  <button
                    className="btn btn-lime"
                    style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 12, justifyContent: 'center' }}
                    onClick={async () => {
                      setRecuperarError('');
                      if (!recuperarEmail) {
                        setRecuperarError('Ingresa tu correo');
                        return;
                      }
                      const result = await recuperarPassword(recuperarEmail);
                      if (result.success) {
                        showToast(result.emailEnviado === false ? '⚠️ ' + (result.mensaje || 'No se pudo enviar el correo') : '✅ Código enviado a tu correo');
                        if (result.codigoDev) {
                          console.log('Código de recuperación (modo desarrollo):', result.codigoDev);
                        }
                        if (result.errorDev) {
                          console.error('Detalle error envío correo:', result.errorDev);
                        }
                        setRecuperarPaso('codigo');
                      } else {
                        setRecuperarError(result.error || 'No se pudo procesar la solicitud');
                      }
                    }}
                  >
                    Enviar código
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: C.tSecondary, marginBottom: 20, lineHeight: 1.6 }}>
                    Ingresa el código de 6 dígitos que enviamos a <span style={{ fontWeight: 600, color: C.tPrimary }}>{recuperarEmail}</span> y tu nueva contraseña.
                  </p>
                  <input
                    id="recuperar-codigo"
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: 22,
                      fontWeight: 700,
                      textAlign: 'center',
                      letterSpacing: '6px',
                      border: `2px solid ${C.g300}`,
                      borderRadius: 10,
                      marginBottom: 14,
                      fontFamily: 'monospace',
                      color: C.tPrimary,
                      background: 'transparent',
                    }}
                  />
                  <input
                    id="recuperar-nueva-password"
                    type="password"
                    placeholder="Nueva contraseña (mínimo 8 caracteres)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: 14,
                      border: `2px solid ${C.g300}`,
                      borderRadius: 10,
                      marginBottom: 20,
                      color: C.tPrimary,
                      background: 'transparent',
                    }}
                  />
                  <button
                    className="btn btn-lime"
                    style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 12, justifyContent: 'center' }}
                    onClick={async () => {
                      setRecuperarError('');
                      const codigo = document.getElementById('recuperar-codigo').value;
                      const nuevaPassword = document.getElementById('recuperar-nueva-password').value;
                      if (!codigo || codigo.length !== 6) {
                        setRecuperarError('Ingresa el código de 6 dígitos');
                        return;
                      }
                      if (!nuevaPassword || nuevaPassword.length < 8) {
                        setRecuperarError('La contraseña debe tener al menos 8 caracteres');
                        return;
                      }
                      const result = await resetearPassword(recuperarEmail, codigo, nuevaPassword);
                      if (result.success) {
                        showToast('✅ Contraseña restablecida. Ya puedes iniciar sesión');
                        setModal(null);
                        setRecuperarPaso('email');
                        setLoginForm((f) => ({ ...f, email: recuperarEmail, password: '' }));
                        setLoginTab('login');
                      } else {
                        setRecuperarError(result.error || 'Código inválido o expirado');
                      }
                    }}
                  >
                    Restablecer contraseña
                  </button>
                  <p style={{ fontSize: 12, color: C.tHint, textAlign: 'center', marginBottom: 12 }}>
                    ¿No recibiste el código?{' '}
                    <span
                      style={{ color: C.purple, fontWeight: 600, cursor: 'pointer' }}
                      onClick={async () => {
                        const result = await recuperarPassword(recuperarEmail);
                        if (result.success) {
                          showToast('✅ Código reenviado');
                          if (result.codigoDev) {
                            console.log('Código de recuperación (modo desarrollo):', result.codigoDev);
                          }
                        }
                      }}
                    >
                      Reenviar
                    </span>
                  </p>
                </>
              )}

              <button
                style={{
                  width: '100%',
                  height: 46,
                  border: `2px solid ${C.g300}`,
                  background: 'transparent',
                  borderRadius: 10,
                  fontSize: 14,
                  color: C.tPrimary,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setModal(null);
                  setRecuperarPaso('email');
                  setRecuperarError('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: <HomeIcon /> },
    { id: 'materias', label: 'Mis materias', icon: <BookIcon size={16} />, badge: data.materias.filter(m => !m.archivada).length },
    { id: 'biblioteca', label: 'Mi biblioteca', icon: <LibraryIcon />, badge: data.libros.length },
    { id: 'calendario', label: 'Calendario', icon: <CalendarIcon size={16} />, badge: data.sesiones.length + data.notas.filter(n => n.fechaCumplimiento).length },
    { id: 'metas', label: 'Mis metas', icon: <ChartIcon size={16} /> },
    { id: 'perfil', label: 'Mi perfil', icon: <UserIcon /> },
  ];

  const renderEditProfileModal = () => (
    modal === 'editar_perfil' ? (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}>
        <div style={{
          background: C.white,
          borderRadius: 16,
          padding: 36,
          maxWidth: 500,
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,.15)',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.tPrimary, marginBottom: 12 }}>Editar perfil</h2>
          <p style={{ fontSize: 14, color: C.tSecondary, marginBottom: 24, lineHeight: 1.6 }}>
            Actualiza tu nombre y, si lo deseas, cambia tu contraseña.
          </p>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Nombre completo</div>
            <input
              className="field-input"
              value={profileForm.nombre}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, nombre: e.target.value }))}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Contraseña actual</div>
            <input
              className="field-input"
              type="password"
              placeholder="Deja vacío si no cambias contraseña"
              value={profileForm.passwordActual}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, passwordActual: e.target.value }))}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <div className="field-label">Nueva contraseña</div>
            <input
              className="field-input"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={profileForm.nuevaPassword}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, nuevaPassword: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-lime"
              style={{ minWidth: 140, justifyContent: 'center' }}
              disabled={profileSaving}
              onClick={handleSaveProfile}
            >
              {profileSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              className="btn btn-ghost"
              style={{ minWidth: 140, borderColor: C.g300, color: C.tPrimary }}
              onClick={() => setModal(null)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-ghost"
              style={{ minWidth: 140, borderColor: '#fecdd3', color: '#ef4444', marginTop: 12, width: '100%' }}
              onClick={handleEliminarCuenta}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    ) : null
  );

  // Total de páginas leídas esta semana según la actividad semanal cargada para la meta activa
  const totalPaginasEstaSemana = (data.actividadSemanal || [])
    .reduce((sum, item) => sum + (item.pags || 0), 0);

  const renderDashboard = () => {
    const totalPaginas = data.libros.reduce((s, l) => s + l.paginasLeidas, 0);
    const totalPaginasAllWeeks = (data.sesiones || []).reduce((sum, s) => sum + (s.paginasLeidas || 0), 0);
    const totalSesiones = data.libros.reduce((s, l) => s + (l.sesiones?.length || 0), 0) + 12;

    const statsGridContent = (
      <div className="stats-grid">
        {[
          { label: 'Materias activas', value: data.materias.filter(m => !m.archivada).length, icon: <BookIcon size={20} color={C.purple} />, bg: 'rgba(124,42,142,.08)', change: '+1 este semestre', pos: true },
          { label: 'Notas creadas', value: data.notas.length, icon: <NoteIcon />, bg: 'rgba(190,213,47,.12)', change: '+3 esta semana', pos: true },
          { label: 'Páginas leídas', value: totalPaginasAllWeeks.toLocaleString(), icon: <ChartIcon size={20} />, bg: 'rgba(249,115,22,.1)', change: '+248 esta semana', pos: true },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-row">
              {s.icon && <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>}
              <div className="stat-info">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    const chartCardContent = (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.tPrimary }}>Actividad semanal — páginas leídas</div>
          <span className="chip chip-lime">{getWeekLabel()}</span>
        </div>
        <div className="bar-chart">
          {data.actividadSemanal.length > 0 ? data.actividadSemanal.map((d, i) => {
            const max = Math.max(...data.actividadSemanal.map(x => x.pags), 1);
            const h = d.pags ? Math.max((d.pags / max) * 80, 8) : 4;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`bar ${i === getTodayIndexMonday() ? 'today' : ''}`} style={{ height: h, width: '100%', minHeight: d.pags ? 8 : 4, opacity: d.pags ? 1 : 0.25 }}></div>
                <div className="bar-label">{d.dia}</div>
                {d.pags > 0 && <div style={{ fontSize: 9, color: C.tHint }}>{d.pags}</div>}
              </div>
            );
          }) : Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="bar" style={{ height: 4, width: '100%', opacity: 0.25 }}></div>
              <div className="bar-label">-</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.tPrimary }}>Historial de sesiones</div>
            <span className="chip chip-gray">{data.sesiones.filter(s => isInCurrentWeek(s.fecha)).length} sesiones</span>
          </div>
          {data.sesiones.filter(s => isInCurrentWeek(s.fecha)).length > 0 ? (
            <div className="table-wrap">
              <div className="table-scroll">
                <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Libro</th>
                    <th>Páginas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sesiones
                    .filter(s => isInCurrentWeek(s.fecha))
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map((sesion) => (
                      <tr key={sesion.id}>
                        <td>{formatSessionDate(sesion.fecha)}</td>
                        <td>{sesion.libro?.titulo || 'Libro'}</td>
                        <td>{sesion.paginasLeidas}</td>
                      </tr>
                    ))}
                </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: C.tHint, padding: '14px 0' }}>
              Aún no hay sesiones guardadas esta semana. Guarda tu próxima lectura para verla aquí.
            </div>
          )}
        </div>
      </div>
    );

    const actionsColumnContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="racha-card">
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Racha de lectura
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>{data.racha.actual}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>días consecutivos</div>
          </div>
          <div className="prog-track" style={{ marginBottom: 8, background: 'rgba(255,255,255,.1)' }}>
            <div className="prog-fill" style={{ width: `${(data.racha.actual / data.racha.maxima) * 100}%` }}></div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 14 }}>Máxima racha: {data.racha.maxima} días</div>
          <div className="week-cal">
            {getWeekCalendarItems().map((item, i) => (
              <div key={i} className={`wday ${item.done ? 'wd-done' : item.today ? 'wd-today' : 'wd-pending'}`}>
                <div style={{ fontSize: 13 }}>{item.done ? '✓' : item.today ? '●' : '○'}</div>
                <div className="wd-name">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            className="btn btn-lime"
            style={{ flex: '1 1 calc(50% - 5px)', boxSizing: 'border-box', minWidth: 0, width: 0, height: 'auto', minHeight: 44, padding: '10px 10px', textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25 }}
            onClick={openNotaRapida}
          >
            Crear nota rápida
          </button>
          <button
            className="btn btn-lime"
            style={{ flex: '1 1 calc(50% - 5px)', boxSizing: 'border-box', minWidth: 0, width: 0, height: 'auto', minHeight: 44, padding: '10px 10px', textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25 }}
            onClick={() => setModal('nueva_materia')}
          >
            Agregar materia
          </button>
          <button
            className="btn btn-lime"
            style={{ flex: '1 1 calc(50% - 5px)', boxSizing: 'border-box', minWidth: 0, width: 0, height: 'auto', minHeight: 44, padding: '10px 10px', textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25 }}
            onClick={openFotoRapida}
          >
            Tomar foto
          </button>
          <button
            className="btn btn-lime"
            style={{ flex: '1 1 calc(50% - 5px)', boxSizing: 'border-box', minWidth: 0, width: 0, height: 'auto', minHeight: 44, padding: '10px 10px', textAlign: 'center', whiteSpace: 'normal', lineHeight: 1.25 }}
            onClick={openAudioRapido}
          >
            Grabar audio
          </button>
        </div>
      </div>
    );

    return (
      <>
        <div className="dashboard-header">
          <div className="topbar">
            <div>
              <div className="topbar-title">Buenos días, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋</div>
              <div className="topbar-sub">Semestre 2026-1 · miércoles, 27 de mayo de 2026</div>
            </div>
          </div>

          <div className="dash-desktop-only">
            {statsGridContent}
          </div>
        </div>

        <div className="page">
          {/* Orden exclusivo para móvil: acciones -> stats -> card. No afecta la vista de escritorio. */}
          <div className="dash-mobile-order">
            {actionsColumnContent}
            {statsGridContent}
            {chartCardContent}
          </div>

          <div className="rt-grid-stack dash-desktop-row" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>
            {chartCardContent}
            {actionsColumnContent}
          </div>
        </div>
      </>
    );
  };

  const openNotaInMateria = (nota) => {
    const materia = data.materias.find(m => m.id === nota.materiaId);
    if (!materia) return;
    setActivePage('materias');
    setActiveMateria(materia);
    setSearch('');
    setFilterTipo('todas');
    setActiveNota(nota);
    setModal('editar_nota');
  };

  const getContentType = (nota) => {
    const archivo = nota.archivo || nota.archivos?.[0];
    if (archivo?.tipo?.startsWith('audio/')) return 'audio';
    if (archivo?.tipo?.startsWith('image/')) return 'foto';
    if (archivo?.tipo) return 'archivo';
    return 'nota';
  };

  const renderMaterias = () => {
    if (activeMateria) {
      const notas = data.notas.filter(n => n.materiaId === activeMateria.id);
      
      let filtered = notas.filter(n => !search || (n.texto || '').toLowerCase().includes(search.toLowerCase()));
      if (filterTipo !== 'todas') {
        filtered = filtered.filter(n => getContentType(n) === filterTipo);
      }

      const conteos = {
        todas: notas.length,
        nota: notas.filter(n => getContentType(n) === 'nota').length,
        foto: notas.filter(n => getContentType(n) === 'foto').length,
        audio: notas.filter(n => getContentType(n) === 'audio').length,
        archivo: notas.filter(n => getContentType(n) === 'archivo').length,
      };

      return (
        <>
          <div className="topbar">
            <div>
              <div className="bc">
                <span style={{ cursor: 'pointer', color: C.purple }} onClick={() => setActiveMateria(null)}>
                  Materias
                </span>{' '}
                › <span>{activeMateria.nombre}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 28, background: COLORS_MATERIA[activeMateria.color], borderRadius: 3 }}></div>
                <div className="topbar-title">{activeMateria.nombre}</div>
                <span className="chip chip-purple">{activeMateria.semestre}</span>
              </div>
            </div>
            <div className="topbar-actions" style={{ display: 'flex', gap: 10 }}>
              <div className="search-wrap" style={{ width: 240 }}>
                <SearchIcon />
                <input placeholder="Buscar en esta materia..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-lime fab-nueva-materia" onClick={() => setModal('nueva_nota')}>
                + Nueva nota
              </button>
            </div>
          </div>
          <div className="page">
            <div className="materia-actions">
              <div className="action-card" onClick={() => setModal('nueva_nota')}>
                <div className="action-title">+ Crear nota</div>
                <div className="action-desc">Agrega una nota nueva para esta materia.</div>
                <div className="action-cta">Texto de la nota y enlace opcional</div>
              </div>
              <div className="action-card" onClick={() => setModal('agregar_foto')}>
                <div className="action-title">Agregar foto</div>
                <div className="action-desc">Sube una imagen y revísala antes de guardar.</div>
                <div className="action-cta">Previsualización y fecha de subida</div>
              </div>
              <div className="action-card" onClick={() => setModal('agregar_audio')}>
                <div className="action-title">Agregar audio</div>
                <div className="action-desc">Adjunta una nota de voz a la materia.</div>
                <div className="action-cta">Solo archivo de audio</div>
              </div>
              <div className="action-card" onClick={() => setModal('agregar_archivo')}>
                <div className="action-title">Agregar archivo</div>
                <div className="action-desc">Adjunta un documento, PDF, Word, PowerPoint u otro archivo.</div>
                <div className="action-cta">Previsualización de archivo</div>
              </div>
            </div>

            <div className="rt-mobile-scroll-x" style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: `1.5px solid ${C.g200}`, paddingBottom: 14 }}>
              {[
                { id: 'todas', label: 'Todas', count: conteos.todas },
                { id: 'nota', label: 'Notas', count: conteos.nota },
                { id: 'foto', label: 'Fotos', count: conteos.foto },
                { id: 'audio', label: 'Audios', count: conteos.audio },
                { id: 'archivo', label: 'Archivos', count: conteos.archivo },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTipo(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: filterTipo === tab.id ? 700 : 500,
                    color: filterTipo === tab.id ? C.purple : C.tHint,
                    paddingBottom: 8,
                    borderBottom: filterTipo === tab.id ? `2.5px solid ${C.purple}` : 'none',
                    transition: 'all .2s',
                  }}
                >
                  {tab.label} <span style={{ marginLeft: 6, opacity: 0.6 }}>({tab.count})</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {filterTipo === 'foto' ? '📸' : filterTipo === 'audio' ? '🎙️' : filterTipo === 'archivo' ? '📎' : ''}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.tPrimary, marginBottom: 6 }}>Sin {filterTipo === 'todas' ? 'contenido' : filterTipo === 'nota' ? 'notas' : filterTipo === 'foto' ? 'fotos' : filterTipo === 'audio' ? 'audios' : 'archivos'}</div>
                <div style={{ fontSize: 13, color: C.tHint, marginBottom: 20 }}>Crea tu primer {filterTipo === 'nota' ? 'nota' : filterTipo === 'foto' ? 'foto' : filterTipo === 'audio' ? 'audio' : filterTipo === 'archivo' ? 'archivo' : 'contenido'} para esta materia</div>
                <button className="btn btn-lime" onClick={() => {
                  if (filterTipo === 'nota') setModal('nueva_nota');
                  else if (filterTipo === 'foto') setModal('agregar_foto');
                  else if (filterTipo === 'audio') setModal('agregar_audio');
                  else if (filterTipo === 'archivo') setModal('agregar_archivo');
                  else setModal('nueva_nota');
                }}>
                  + Crear {filterTipo === 'nota' ? 'nota' : filterTipo === 'foto' ? 'foto' : filterTipo === 'audio' ? 'audio' : filterTipo === 'archivo' ? 'archivo' : 'contenido'}
                </button>
              </div>
            ) : (
              (() => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const ayer = new Date(hoy);
                ayer.setDate(ayer.getDate() - 1);

                const etiquetaGrupo = (fechaStr) => {
                  const fecha = parseLocalDate(fechaStr) || new Date(fechaStr);
                  const fechaSinHora = new Date(fecha);
                  fechaSinHora.setHours(0, 0, 0, 0);
                  if (fechaSinHora.getTime() === hoy.getTime()) return 'Hoy';
                  if (fechaSinHora.getTime() === ayer.getTime()) return 'Ayer';
                  return fechaSinHora.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: fechaSinHora.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined });
                };

                const grupos = [];
                const indicePorEtiqueta = {};
                filtered.forEach((n) => {
                  const etiqueta = etiquetaGrupo(n.creadoEn);
                  if (indicePorEtiqueta[etiqueta] === undefined) {
                    indicePorEtiqueta[etiqueta] = grupos.length;
                    grupos.push({ etiqueta, notas: [] });
                  }
                  grupos[indicePorEtiqueta[etiqueta]].notas.push(n);
                });

                return grupos.map((grupo) => (
                  <div key={grupo.etiqueta} style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.tHint, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, paddingLeft: 2 }}>
                      {grupo.etiqueta}
                      <span style={{ fontWeight: 500, marginLeft: 8, color: C.g400 }}>({grupo.notas.length})</span>
                    </div>
                    <div className="notas-grid">
                      {grupo.notas.map(n => (
                        <NotaCard
                          key={n.id}
                          nota={n}
                          color={COLORS_MATERIA[activeMateria.color]}
                          C={C}
                          esGrupo={activeMateria.esGrupo}
                          onOpen={() => handleVerNota(n)}
                          onEdit={() => {
                            setActiveNota(n);
                            setModal('editar_nota');
                          }}
                          onDelete={async () => {
                            try {
                              await notasService.eliminar(n.id);
                              setData(d => ({ ...d, notas: d.notas.filter(x => x.id !== n.id) }));
                              showToast('✅ Nota eliminada');
                            } catch (error) {
                              console.error('Error eliminando nota:', error);
                              showToast(error.data?.mensaje || 'No se pudo eliminar la nota');
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()
            )}
          </div>
        </>
      );
    }

    // Vista de lista de materias
    const mats = data.materias ? data.materias.filter(m => !m.archivada) : [];
    
    // Filtrar por tab
    const propias = mats.filter(m => !m.esGrupo);
    const grupo = mats.filter(m => m.esGrupo);
    const materiasAMostrar = activeMateriaTab === 'propias' ? propias : grupo;
    const filtered = materiasAMostrar.filter(m => !search || m.nombre.toLowerCase().includes(search.toLowerCase()));

    return (
      <>
        <div className="topbar">
          <div>
            <div className="topbar-title">Materias</div>
            <div className="topbar-sub">Semestre 2026-1 · {propias.length} propias · {grupo.length} en grupo</div>
          </div>
          <div className="topbar-actions" style={{ display: 'flex', gap: 10 }}>
            <div className="search-wrap" style={{ width: 240 }}>
              <SearchIcon />
              <input placeholder="Buscar materia..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-lime fab-nueva-materia" onClick={() => setModal('nueva_materia')}>
              + Nueva materia
            </button>
          </div>
        </div>
        
        {/* Invitaciones pendientes */}
        {invitacionesPendientes.length > 0 && (
          <div className="page" style={{ paddingBottom: 0 }}>
            <div style={{ background: 'rgba(190,213,47,.08)', border: `2px solid ${C.lime}`, borderRadius: 14, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 10 }}>
                📩 Invitaciones pendientes ({invitacionesPendientes.length})
              </div>
              {invitacionesPendientes.map((inv) => (
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.white, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>{inv.materia?.nombre}</div>
                    <div style={{ fontSize: 11, color: C.tHint }}>
                      Invitado por {inv.materia?.usuario?.nombre || inv.materia?.usuario?.email || 'un compañero'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => handleRechazarInvitacion(inv.id)}
                    >
                      Rechazar
                    </button>
                    <button
                      type="button"
                      className="btn btn-lime"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => handleAceptarInvitacion(inv.id)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="page" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: `2px solid ${C.g200}`, paddingBottom: 12 }}>
            <button
              onClick={() => setActiveMateriaTab('propias')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeMateriaTab === 'propias' ? 700 : 500,
                color: activeMateriaTab === 'propias' ? C.purple : C.tHint,
                paddingBottom: 8,
                borderBottom: activeMateriaTab === 'propias' ? `3px solid ${C.purple}` : 'none',
                transition: 'all .2s',
              }}
            >
              Mis materias <span style={{ marginLeft: 6, opacity: 0.6 }}>({propias.length})</span>
            </button>
            <button
              onClick={() => setActiveMateriaTab('grupo')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: activeMateriaTab === 'grupo' ? 700 : 500,
                color: activeMateriaTab === 'grupo' ? C.purple : C.tHint,
                paddingBottom: 8,
                borderBottom: activeMateriaTab === 'grupo' ? `3px solid ${C.purple}` : 'none',
                transition: 'all .2s',
              }}
            >
              Materias en grupo <span style={{ marginLeft: 6, opacity: 0.6 }}>({grupo.length})</span>
            </button>
          </div>
        </div>

        <div className="page">
          {activeMateriaTab === 'grupo' && grupo.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sin materias en grupo</div>
              <div style={{ fontSize: 13, color: C.tHint, marginBottom: 20 }}>Busca un grupo existente usando el ID que te comparta el creador</div>
              <button className="btn btn-lime" onClick={() => setModal('buscar_grupo')}>
                🔍 Buscar grupo
              </button>
            </div>
          )}

          {filtered.length === 0 && activeMateriaTab === 'propias' ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sin resultados</div>
              <div style={{ fontSize: 13, color: C.tHint }}>No se encontraron materias con ese nombre</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sin resultados</div>
              <div style={{ fontSize: 13, color: C.tHint }}>No se encontraron materias en grupo con ese nombre</div>
            </div>
          ) : (
            <div className="mat-grid">
              {filtered.map(m => {
                const nCount = data.notas.filter(n => n.materiaId === m.id).length;
                const aCount = data.notas.filter(n => n.materiaId === m.id && (n.archivos?.length || n.archivo)).length;
                const esPropietario = m.usuarioId === user?.id;
                return (
                  <div key={m.id} className="mat-card" onClick={() => { setActiveMateria(m); setSearch(''); setFilterTipo('todas'); }}>
                    <div className="mat-stripe" style={{ background: COLORS_MATERIA[m.color] }}></div>
                    <div className="mat-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.tPrimary }}>{m.nombre}</div>
                          <div style={{ fontSize: 12, color: C.tHint, marginBottom: 10 }}>{m.semestre}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {esPropietario ? (
                            <>
                              {m.esGrupo && (
                                <button 
                                  className="act-btn" 
                                  onClick={(e) => { e.stopPropagation(); setActiveMateria(m); setModal('compartir_materia'); }} 
                                  title="Compartir"
                                  style={{ background: 'rgba(190,213,47,.2)', color: C.lime }}
                                >
                                  👥
                                </button>
                              )}
                              <button className="act-btn act-edit" onClick={(e) => { e.stopPropagation(); setEditandoMateria(m); setModal('editar_materia'); }} title="Editar">
                                <EditIcon />
                              </button>
                              <button className="act-btn act-del" onClick={(e) => { e.stopPropagation(); handleEliminarMateria(m); }} title="Eliminar">
                                <TrashIcon />
                              </button>
                            </>
                          ) : (
                            <button
                              className="act-btn act-del"
                              title="Salir del grupo"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!window.confirm(`¿Salir del grupo "${m.nombre}"? No afectará a los demás integrantes.`)) return;
                                try {
                                  await materiasService.salirGrupo(m.id);
                                  showToast('Saliste del grupo');
                                  setData((d) => ({ ...d, materias: d.materias.filter((mat) => mat.id !== m.id) }));
                                  if (activeMateria?.id === m.id) setActiveMateria(null);
                                } catch (err) {
                                  showToast('❌ ' + (err.data?.mensaje || 'No se pudo salir del grupo'));
                                }
                              }}
                            >
                              🚪
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className="chip chip-purple">{nCount} notas</span>
                        <span className="chip chip-lime">{aCount} archivos</span>
                        {m.esGrupo && <span className="chip chip-lime" style={{ background: 'rgba(190,213,47,.2)', color: C.lime }}>👥 Grupo</span>}
                        {m.esGrupo && !esPropietario && <span className="chip" style={{ background: C.g100, color: C.tHint }}>Compañero</span>}
                      </div>
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.g200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: C.tHint, display: 'flex', alignItems: 'center', gap: 6 }}>
                          Abrir materia →
                          {m.esGrupo && m.usuario?.nombre && (
                            <span style={{ color: C.lime, fontWeight: 600 }}>· Creada por {m.usuario.nombre}</span>
                          )}
                        </span>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth={2}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderBiblioteca = () => {
    const filtrados = data.libros.filter(l => {
      const matchFilter = filtroLibros === 'TODOS' || l.estado === filtroLibros;
      const matchSearch = !search || l.titulo.toLowerCase().includes(search.toLowerCase()) || (l.autor || '').toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

    const librosOrdenados = [...filtrados].sort((a, b) => {
      const aTitulo = (a.titulo || '').trim().toLowerCase();
      const bTitulo = (b.titulo || '').trim().toLowerCase();
      return librosSortOrder === 'asc' ? aTitulo.localeCompare(bTitulo) : bTitulo.localeCompare(aTitulo);
    });

    const statusChip = {
      LEYENDO: { cls: 'chip-lime', label: 'Leyendo' },
      TERMINADO: { cls: 'chip-green', label: 'Terminado' },
      PENDIENTE: { cls: 'chip-gray', label: 'Pendiente' },
    };

    return (
      <>
        <div className="topbar">
          <div>
            <div className="topbar-title">Mi biblioteca</div>
            <div className="topbar-sub">
              {data.libros.length} materiales · {data.libros.filter(l => l.estado === 'LEYENDO').length} leyendo ·{' '}
              {data.libros.filter(l => l.estado === 'TERMINADO').length} terminados · {data.libros.filter(l => l.estado === 'PENDIENTE').length} pendientes
            </div>
          </div>
          <button className="btn btn-lime fab-nueva-materia" onClick={() => setModal('nuevo_libro')}>
            + Agregar libro
          </button>
        </div>
        <div className="page">
          <div className="rt-mobile-wrap" style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
            <div className="search-wrap" style={{ flex: 1 }}>
              <SearchIcon />
              <input placeholder="Buscar por título o autor..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div className="filter-tabs">
                {['TODOS', 'LEYENDO', 'PENDIENTE', 'TERMINADO'].map(f => (
                  <div key={f} className={`ftab ${filtroLibros === f ? 'ftab-active' : 'ftab-normal'}`} onClick={() => setFiltroLibros(f)}>
                    {f === 'TODOS' ? 'Todos' : f.charAt(0) + f.slice(1).toLowerCase()}
                  </div>
                ))}
              </div>
              <div className="filter-tabs" style={{ marginLeft: 'auto' }}>
                {[
                  { id: 'asc', label: 'Ascendente' },
                  { id: 'desc', label: 'Descendente' },
                ].map(option => (
                  <div
                    key={option.id}
                    className={`ftab ${librosSortOrder === option.id ? 'ftab-active' : 'ftab-normal'}`}
                    onClick={() => setLibrosSortOrder(option.id)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla: version de escritorio (se oculta en movil) */}
          <div className="table-wrap biblio-table-desktop">
            <table>
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Progreso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {librosOrdenados.map(l => {
                  const paginasLeidas = l.estado === 'TERMINADO' ? l.totalPaginas : l.paginasLeidas;
                  const pct = Math.round((paginasLeidas / l.totalPaginas) * 100);
                  const sc = statusChip[l.estado];
                  return (
                    <tr key={l.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 48, borderRadius: 8, background: 'rgba(124,42,142,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <BookIcon size={16} color={C.purple} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.tPrimary }}>{l.titulo}</div>
                            <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>{l.autor}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ minWidth: 160 }}>
                        <div className="prog-track" style={{ marginBottom: 4 }}>
                          <div className="prog-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div style={{ fontSize: 11, color: C.tHint }}>
                          {paginasLeidas} / {l.totalPaginas} págs · {pct}%
                        </div>
                      </td>
                      <td>
                        <span className={`chip ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-lime btn-sm"
                            style={{
                              minWidth: 110,
                              width: 110,
                              justifyContent: 'center',
                              background: l.estado === 'TERMINADO' ? '#3bce71' : l.estado === 'PENDIENTE' ? '#DAD6D6' : undefined,
                              boxShadow: l.estado === 'TERMINADO'
                                ? '0 10px 20px rgba(59, 206, 113, 0.25)'
                                : l.estado === 'PENDIENTE'
                                ? '0 10px 20px rgba(0, 0, 0, 0.12)'
                                : undefined,
                            }}
                            onClick={() => { setActiveLibro(l); setModal('iniciar_sesion'); }}
                          >
                            {l.estado === 'TERMINADO' ? (
                              <>
                                <RestartIcon size={16} />
                                Reiniciar
                              </>
                            ) : l.estado === 'PENDIENTE' ? (
                              <>
                                <StartIcon size={16} />
                                Comenzar
                              </>
                            ) : (
                              <>
                                <ContinueIcon size={16} />
                                Seguir
                              </>
                            )}
                          </button>
                          <button
                            className="act-btn act-edit"
                            title="Editar"
                            onClick={(e) => { e.stopPropagation(); setActiveLibro(l); setModal('editar_libro'); }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="act-btn act-del"
                            title="Eliminar"
                            onClick={() => handleEliminarLibro(l)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtrados.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: C.tHint, fontSize: 13.5 }}>
                No se encontraron libros con los filtros seleccionados.
              </div>
            )}
          </div>

          {/* Tarjetas: version movil (se oculta en escritorio) */}
          <div className="biblio-cards-mobile">
            {librosOrdenados.map(l => {
              const paginasLeidas = l.estado === 'TERMINADO' ? l.totalPaginas : l.paginasLeidas;
              const pct = Math.round((paginasLeidas / l.totalPaginas) * 100);
              const sc = statusChip[l.estado];
              return (
                <div key={l.id} className="libro-card-mobile">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 34, height: 44, borderRadius: 8, background: 'rgba(124,42,142,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookIcon size={15} color={C.purple} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.tPrimary, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{l.titulo}</div>
                        {l.autor && <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>{l.autor}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span className={`chip ${sc.cls}`}>{sc.label}</span>
                      <button
                        className="act-btn act-edit"
                        title="Editar"
                        onClick={(e) => { e.stopPropagation(); setActiveLibro(l); setModal('editar_libro'); }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="act-btn act-del"
                        title="Eliminar"
                        onClick={() => handleEliminarLibro(l)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="prog-track" style={{ marginTop: 12 }}>
                    <div className="prog-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 10 }}>
                    <div style={{ fontSize: 11, color: C.tHint }}>
                      {paginasLeidas} / {l.totalPaginas} págs · {pct}%
                    </div>
                    <button
                      className="btn btn-lime btn-sm"
                      style={{
                        minWidth: 110,
                        width: 110,
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: l.estado === 'TERMINADO' ? '#3bce71' : l.estado === 'PENDIENTE' ? '#DAD6D6' : undefined,
                        boxShadow: l.estado === 'TERMINADO'
                          ? '0 10px 20px rgba(59, 206, 113, 0.25)'
                          : l.estado === 'PENDIENTE'
                          ? '0 10px 20px rgba(0, 0, 0, 0.12)'
                          : undefined,
                      }}
                      onClick={() => { setActiveLibro(l); setModal('iniciar_sesion'); }}
                    >
                      {l.estado === 'TERMINADO' ? (
                        <>
                          <RestartIcon size={16} />
                          Reiniciar
                        </>
                      ) : l.estado === 'PENDIENTE' ? (
                        <>
                          <StartIcon size={16} />
                          Comenzar
                        </>
                      ) : (
                        <>
                          <ContinueIcon size={16} />
                          Seguir
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            {filtrados.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: C.tHint, fontSize: 13.5 }}>
                No se encontraron libros con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderMetas = () => {
    const pct = data.meta.paginasSemana > 0 ? Math.round((totalPaginasEstaSemana / data.meta.paginasSemana) * 100) : 0;
    const diasFaltan = getDaysLeftInWeek();
    return (
      <>
        <div className="topbar">
          <div>
            <div className="topbar-title">Mis metas</div>
            <div className="topbar-sub">
              {getWeekLabel()} · {totalPaginasEstaSemana} de {data.meta.paginasSemana} páginas leídas
            </div>
          </div>
          <button className="btn btn-lime fab-nueva-materia" onClick={() => setModal('cambiar_meta')}>
            Cambiar meta
          </button>
        </div>
        <div className="page">
          <div className="rt-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div className="meta-big">
                <div style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {getWeekLabel()}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: '#fff' }}>{data.meta.paginasSemana}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>páginas / semana</div>
                  <div style={{ marginLeft: 'auto', background: C.lime, color: C.dark, fontSize: 15, fontWeight: 800, padding: '4px 14px', borderRadius: 10, alignSelf: 'flex-start' }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ height: 12, background: 'rgba(255,255,255,.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ height: 12, borderRadius: 6, background: C.lime, width: `${pct}%`, transition: 'width .5s ease' }}></div>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 18 }}>
                  {totalPaginasEstaSemana} de {data.meta.paginasSemana} páginas leídas · quedan {diasFaltan} días
                </div>
                <div className="week-cal">
                  {getWeekCalendarItems().map((wd, i) => (
                    <div key={i} className={`wday ${wd.done ? 'wd-done' : wd.today ? 'wd-today' : 'wd-pending'}`}>
                      <div style={{ fontSize: 12 }}>{wd.done ? '✓' : wd.today ? '●' : '○'}</div>
                      <div className="wd-name">{wd.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Historial de metas</div>
              <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.g100 }}>
                    <th style={{ fontSize: 10, fontWeight: 700, color: C.tHint, textTransform: 'uppercase', padding: '10px 12px', textAlign: 'left', borderBottom: `1.5px solid ${C.g200}` }}>
                      Semana
                    </th>
                    <th style={{ fontSize: 10, fontWeight: 700, color: C.tHint, textTransform: 'uppercase', padding: '10px 12px', textAlign: 'left', borderBottom: `1.5px solid ${C.g200}` }}>
                      Meta
                    </th>
                    <th style={{ fontSize: 10, fontWeight: 700, color: C.tHint, textTransform: 'uppercase', padding: '10px 12px', textAlign: 'right', borderBottom: `1.5px solid ${C.g200}` }}>
                      Cumplimiento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.meta.historial.slice(0, 3).map((h, i) => {
                    const p = Math.round((h.paginasLeidas / h.paginasSemana) * 100);
                    const chipCls = p >= 100 ? 'chip-green' : p >= 75 ? 'chip-lime' : 'chip-red';
                    return (
                      <tr key={i}>
                        <td style={{ padding: '12px', borderBottom: `1px solid ${C.g200}` }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>
                            {h.semana || (h.semanaInicio ? formatWeekLabel(h.semanaInicio) : '-')}
                          </div>
                          <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>
                            {h.paginasLeidas}/{h.paginasSemana} páginas
                          </div>
                        </td>
                        <td style={{ padding: '12px', borderBottom: `1px solid ${C.g200}`, fontSize: 14, fontWeight: 600 }}>
                          {h.paginasSemana} pág
                        </td>
                        <td style={{ padding: '12px', borderBottom: `1px solid ${C.g200}`, textAlign: 'right' }}>
                          <span className={`chip ${chipCls}`}>{p}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
                {data.meta.historial.length > 3 && (
                  <div style={{ padding: '12px', color: C.tSecondary, fontSize: 12, textAlign: 'center' }}>
                    Mostrando las últimas 3 entradas de historial.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="badge-panel" style={{ marginTop: 20 }}>
            <div className="badge-panel-title">Insignias por desbloquear</div>
            <div style={{ color: C.tSecondary, fontSize: 13, marginBottom: 14 }}>
              Lecturas acumuladas: {data.meta.paginasLeidas || totalPaginasEstaSemana} páginas
            </div>
            <div className="badge-grid">
              {[
                { name: 'Mapache Aprendiz', title: '0–10 páginas', threshold: 10 },
                { name: 'Mapache Curioso', title: '10–50 páginas', threshold: 50 },
                { name: 'Mapache Constante', title: '50–100 páginas', threshold: 100 },
                { name: 'Mapache Persistente', title: '100–250 páginas', threshold: 250 },
                { name: 'Mapache Experto', title: '250–500 páginas', threshold: 500 },
                { name: 'Mapache Leyenda', title: '500–1000 páginas', threshold: 1000 },
              ].map((badge) => {
                const acquired = (data.meta.paginasLeidas || totalPaginasEstaSemana) >= badge.threshold;
                return (
                  <div key={badge.threshold} className={`badge-item ${acquired ? 'unlocked' : ''}`}>
                    <div className="badge-icon"><RaccoonIcon size={18} /></div>
                    <div className="badge-text">
                      <div className="badge-name">{badge.name}</div>
                      <div className="badge-threshold">{badge.title}</div>
                      <div className="badge-status">{acquired ? 'Desbloqueada' : 'Pendiente'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCalendario = () => {
    const now = new Date();
    const selectedDate = new Date(selectedCalendarDate || now);
    selectedDate.setHours(0, 0, 0, 0);
    const currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    
    // Función para convertir fecha a string YYYY-MM-DD usando hora local (sin UTC)
    const selectedDateString = formatLocalDateString(selectedDate);

    const todayString = new Date().toISOString().split('T')[0];

    const getDayName = (date) => date.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
    const getMonthName = (date) => date.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
    const getMonthNameCap = (date) => {
      const m = date.toLocaleDateString('es-ES', { month: 'long' });
      return m.charAt(0).toUpperCase() + m.slice(1);
    };

    // Debuggear sesiones y notas
    console.log('🔍 CALENDARIO DEBUG - data.sesiones:', data.sesiones, 'length:', data.sesiones?.length);
    console.log('🔍 CALENDARIO DEBUG - data.notas:', data.notas, 'length:', data.notas?.length);
    
    // Inspeccionar estructura de primera sesión
    if (data.sesiones && data.sesiones.length > 0) {
      console.log('🔍 PRIMERA SESIÓN:', data.sesiones[0]);
      console.log('🔍 TODAS LAS SESIONES SIN FECHA:', data.sesiones.filter(s => !s.fecha).slice(0, 2));
      console.log('🔍 TODAS LAS SESIONES CON FECHA:', data.sesiones.filter(s => s.fecha).slice(0, 2));
    }
    if (data.notas && data.notas.length > 0) {
      console.log('🔍 PRIMERA NOTA:', data.notas[0]);
    }

    const sessionDates = new Set((data.sesiones || []).map(sesion => {
      if (!sesion || !sesion.fecha) return null;
      return formatLocalDateString(sesion.fecha);
    }).filter(Boolean));

    const noteDates = new Set(
      (data.notas || []).filter(nota => nota && nota.fechaCumplimiento).map(nota => formatLocalDateString(nota.fechaCumplimiento))
    );

    console.log('🔍 CALENDARIO DEBUG - sessionDates:', Array.from(sessionDates));
    console.log('🔍 CALENDARIO DEBUG - noteDates:', Array.from(noteDates));
    console.log('🔍 CALENDARIO DEBUG - notas con fechaCumplimiento:', (data.notas || []).filter(nota => nota && nota.fechaCumplimiento).map(nota => ({ id: nota.id, fechaCumplimiento: nota.fechaCumplimiento })));

    const getMateriaNombre = (id) => data.materias.find(m => m.id === id)?.nombre || 'Materia';

    const sesionesDelDia = (data.sesiones || []).filter(sesion => {
      if (!sesion || !sesion.fecha) return false;
      return formatLocalDateString(sesion.fecha) === selectedDateString;
    });
    console.log('🔍 CALENDARIO DEBUG - sesionesDelDia:', sesionesDelDia.map(sesion => ({ id: sesion.id, fecha: sesion.fecha, libro: sesion.libro?.titulo })));

    const notasDelDia = (data.notas || []).filter(nota => {
      if (!nota || !nota.fechaCumplimiento) return false;
      return formatLocalDateString(nota.fechaCumplimiento) === selectedDateString;
    });
    console.log('🔍 CALENDARIO DEBUG - notasDelDia:', notasDelDia.map(nota => ({ id: nota.id, fechaCumplimiento: nota.fechaCumplimiento })));

    const currentMonthFirstWeekday = (currentMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const dayCells = [
      ...Array(currentMonthFirstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
    const padCells = (7 - (dayCells.length % 7)) % 7;
    const calendarCells = [...dayCells, ...Array(padCells).fill(null)];

    return (
      <>
        <div className="topbar">
          <div>
            <div className="topbar-title">Calendario</div>
            <div className="topbar-sub">Fechas de lectura y notas con fecha de cumplimiento</div>
          </div>
        </div>

        <div className="page" style={{ paddingBottom: 24 }}>
          <div className="rt-cal-wrap" style={{ display: 'flex', gap: 20, background: C.white, borderRadius: 22, overflow: 'hidden', border: '1px solid #374151' }}>
            <div className="rt-cal-side" style={{ width: 380, background: C.dark, padding: '40px 36px', display: 'flex', flexDirection: 'column', flexShrink: 0, border: '1px solid #374151' }}>
              <div>
                <div style={{ color: '#9bdf2e', fontSize: 20, fontWeight: 300, lineHeight: 1, letterSpacing: '1px' }}>{currentMonth.getFullYear()}</div>
                <div style={{ color: '#fff', fontSize: 50, fontWeight: 300, lineHeight: 1, letterSpacing: '1px', textTransform: 'uppercase', marginTop: 12 }}>{getDayName(selectedDate)}</div>
                <div style={{ color: '#a739c0', fontSize: 20, fontWeight: 300, marginTop: 6 }}>{getMonthName(selectedDate)} {selectedDate.getDate()}</div>
              </div>
              <div className="rt-cal-side-box" style={{ width: 308, height: 280, background: C.white, marginTop: 32, padding: 20, overflowY: 'scroll', border: '1px solid #374151', borderRadius: 18 }}>
                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#7C2A8E', marginBottom: 12 }}>Sesiones de lectura</div>
                    {sesionesDelDia.length === 0 ? (
                      <div style={{ color: C.tSecondary, fontSize: 13, lineHeight: 1.8 }}>
                        No hay sesiones para este día.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: 12 }}>
                        {sesionesDelDia.map((sesion) => (
                          <div key={sesion.id} style={{ borderRadius: 14, padding: 14, background: C.g100, boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #fff' }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 6 }}>{sesion.libro?.titulo || 'Sesión de lectura'}</div>
                                  <div style={{ fontSize: 11, color: C.tSecondary, marginBottom: 6 }}>Páginas: {sesion.paginaInicio} - {sesion.paginaFin}</div>
                                  <div style={{ fontSize: 11, color: C.tSecondary }}>Duración: {sesion.duracionMinutos} min</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#9bdf2e', marginBottom: 12 }}>Notas</div>
                    {notasDelDia.length === 0 ? (
                      <div style={{ color: C.tSecondary, fontSize: 13, lineHeight: 1.8 }}>
                        No hay notas guardadas para este día.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: 12 }}>
                        {notasDelDia.map((nota) => {
                          const fecha = formatDate(nota.fechaCumplimiento);
                          return (
                            <div key={nota.id} style={{ borderRadius: 14, padding: 14, background: C.g100, boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #fff' }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 6 }}>{nota.texto || nota.titulo || 'Nota'}</div>
                              <div style={{ fontSize: 11, color: C.tSecondary, marginBottom: 6 }}>{getMateriaNombre(nota.materiaId)}</div>
                              {fecha && <div style={{ fontSize: 11, color: C.tSecondary }}>Fecha: {fecha}</div>}
                              <button
                                type="button"
                                onClick={() => openNotaInMateria(nota)}
                                style={{
                                  marginTop: 10,
                                  background: C.white,
                                  //borde de color negro
                                  color: '#a8a8a8',
                                  border: '1px solid #a8a8a8',
                                  borderRadius: 10,
                                  padding: '8px 10px',
                                  cursor: 'pointer',
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                Ver nota en materia
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rt-cal-main" style={{ flex: 1, background: C.white, padding: '40px 40px', position: 'relative', display: 'flex', flexDirection: 'column', border: `1px solid ${C.white}`, borderRadius: 14 }}>
              <div className="rt-cal-months" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', textAlign: 'center', color: C.g400, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>
                {MONTH_NAMES_SHORT.map((month, index) => (
                  <div
                    key={month}
                    onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), index, 1))}
                    style={{ cursor: 'pointer', color: index === currentMonth.getMonth() ? C.dark : C.g400, fontWeight: index === currentMonth.getMonth() ? 700 : 400 }}
                  >
                    {month}
                  </div>
                ))}
              </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, color: C.tSecondary, fontSize: 11, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple, display: 'inline-block' }}></span>
                  Sesiones de lectura
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
                  Notas con fecha de cumplimiento
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    style={{ background: C.g100, color: C.dark, borderRadius: 999, width: 28, height: 28, cursor: 'pointer', fontSize: 13, border: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Mes anterior"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDate(new Date())}
                    style={{ background: C.dark, color: '#fff', borderRadius: 999, padding: '6px 14px', cursor: 'pointer', fontSize: 11, border: '1px solid #374151' }}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    style={{ background: C.g100, color: C.dark, borderRadius: 999, width: 28, height: 28, cursor: 'pointer', fontSize: 13, border: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Mes siguiente"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16, color: C.tSecondary, fontSize: 12, letterSpacing: '1px', textAlign: 'center' }}>
                {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((weekday) => (
                  <div key={weekday} style={{ fontWeight: 600 }}>{weekday}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, flex: 1, border: `1px solid ${C.white}`, borderRadius: 12, padding: 10 }}>
                {calendarCells.map((day, index) => {
                  const dateKey = day ? formatLocalDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) : null;
                  const hasSession = dateKey && sessionDates && sessionDates.size > 0 ? sessionDates.has(dateKey) : false;
                  const hasNote = dateKey && noteDates && noteDates.size > 0 ? noteDates.has(dateKey) : false;
                  const isSelected = dateKey === selectedDateString;
                  if (day === 1 || (hasSession && day) || (hasNote && day)) {
                    console.log(`🔍 Día ${day}: dateKey="${dateKey}", hasSession=${hasSession}, hasNote=${hasNote}, sessionDates=${Array.from(sessionDates).join(', ')}`);
                  }

                  if (!day) {
                    return <div key={`empty-${index}`} />;
                  }

                    return (
                    <button
                      key={`${day}-${index}`}
                      type="button"
                      onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                      style={{
                        borderRadius: 12,
                        border: 'none',
                          background: 'transparent',
                          color: C.dark,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: isSelected ? C.dark : 'transparent', color: isSelected ? '#fff' : C.tSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500 }}>
                        {day}
                      </div>
                      {(hasSession || hasNote) && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {hasSession && <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.purple, display: 'inline-block' }} />}
                          {hasNote && <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }} />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Version movil del calendario (se oculta en escritorio) */}
          <div className="cal-mobile">
            <div className="cal-mobile-card">
              <div className="cal-mobile-nav">
                <button
                  type="button"
                  className="cal-mobile-nav-btn"
                  onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  title="Mes anterior"
                >
                  ◀
                </button>
                <div className="cal-mobile-month-title" onClick={() => setSelectedCalendarDate(new Date())} title="Ir a hoy">
                  {getMonthNameCap(currentMonth)} {currentMonth.getFullYear()}
                </div>
                <button
                  type="button"
                  className="cal-mobile-nav-btn"
                  onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  title="Mes siguiente"
                >
                  ▶
                </button>
              </div>

              <div className="cal-mobile-weekdays">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={`${d}-${i}`}>{d}</div>
                ))}
              </div>

              <div className="cal-mobile-grid">
                {calendarCells.map((day, index) => {
                  const dateKey = day ? formatLocalDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) : null;
                  const hasSession = dateKey && sessionDates && sessionDates.size > 0 ? sessionDates.has(dateKey) : false;
                  const hasNote = dateKey && noteDates && noteDates.size > 0 ? noteDates.has(dateKey) : false;
                  const isSelected = dateKey === selectedDateString;

                  if (!day) {
                    return <div key={`empty-cm-${index}`} />;
                  }

                  return (
                    <button
                      key={`cm-${day}-${index}`}
                      type="button"
                      className="cal-mobile-day"
                      onClick={() => setSelectedCalendarDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                    >
                      <span className={isSelected ? 'cal-mobile-day-num cal-mobile-day-selected' : 'cal-mobile-day-num'}>
                        {day}
                      </span>
                      <span className="cal-mobile-dots">
                        {hasSession && <i style={{ background: C.purple }} />}
                        {hasNote && <i style={{ background: C.lime }} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="cal-mobile-legend">
                <span><i style={{ background: C.purple }} />Sesiones de lectura</span>
                <span><i style={{ background: C.lime }} />Notas con cumplimiento</span>
              </div>
            </div>

            <div className="cal-mobile-card">
              <div className="cal-mobile-day-title">{selectedDate.getDate()} De {getMonthNameCap(selectedDate)}</div>

              <div className="cal-mobile-section">
                <div className="cal-mobile-section-title" style={{ color: '#7C2A8E' }}>📅 Sesiones de lectura</div>
                {sesionesDelDia.length === 0 ? (
                  <div className="cal-mobile-empty">No hay sesiones para este día.</div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {sesionesDelDia.map((sesion) => (
                      <div key={sesion.id} className="cal-mobile-item">
                        <div className="cal-mobile-item-title">{sesion.libro?.titulo || 'Sesión de lectura'}</div>
                        <div className="cal-mobile-item-meta">Páginas: {sesion.paginaInicio} - {sesion.paginaFin}</div>
                        <div className="cal-mobile-item-meta">Duración: {sesion.duracionMinutos} min</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cal-mobile-section">
                <div className="cal-mobile-section-title" style={{ color: '#7a9a1e' }}>📝 Notas</div>
                {notasDelDia.length === 0 ? (
                  <div className="cal-mobile-empty">No hay notas guardadas para este día.</div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {notasDelDia.map((nota) => {
                      const fecha = formatDate(nota.fechaCumplimiento);
                      return (
                        <div key={nota.id} className="cal-mobile-item">
                          <div className="cal-mobile-item-title">{nota.texto || nota.titulo || 'Nota'}</div>
                          <div className="cal-mobile-item-meta">{getMateriaNombre(nota.materiaId)}</div>
                          {fecha && <div className="cal-mobile-item-meta">Fecha: {fecha}</div>}
                          <button
                            type="button"
                            onClick={() => openNotaInMateria(nota)}
                            style={{
                              marginTop: 10,
                              background: C.white,
                              color: '#a8a8a8',
                              border: '1px solid #a8a8a8',
                              borderRadius: 10,
                              padding: '8px 10px',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            Ver nota en materia
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPerfil = () => (
    <>
      <div className="topbar" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="topbar-title">Mi perfil</div>
        </div>
        <div className="topbar-actions" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={handleOpenEditProfile}>Editar perfil</button>
          <button
            className="btn btn-ghost"
            style={{ color: '#ef4444', borderColor: '#fecdd3' }}
            onClick={() => logout()}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="page">
        <div className="rt-grid-stack" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div>
            <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: `linear-gradient(135deg,${C.lime},${C.limeDk})`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.dark,
                  margin: '0 auto 12px',
                  border: `3px solid ${C.g200}`,
                }}
              >
                {user?.nombre?.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.tPrimary }}>{user?.nombre}</div>
              <div style={{ fontSize: 12, color: C.tHint, margin: '4px 0 14px' }}>{user?.email}</div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Configuración</div>
              {[
                {
                  ic: <span style={{ fontSize: 16 }}>🔔</span>,
                  bg: 'rgba(124,42,142,.08)',
                  title: 'Recordatorios de lectura',
                  sub: data.config.recordatorios
                    ? `${data.config.recordatorioHora || '08:00'} · ${
                        data.config.recordatorioFuente === 'propias' ? 'Solo materias propias'
                        : data.config.recordatorioFuente === 'grupo' ? 'Solo materias en grupo'
                        : 'Todas tus materias'
                      }`
                    : 'Desactivados',
                  toggle: true,
                  key: 'recordatorios',
                  configurable: true,
                },
                { ic: <span style={{ fontSize: 16 }}>🌙</span>, bg: 'rgba(41,49,60,.06)', title: 'Modo oscuro', sub: 'Activar tema oscuro', toggle: true, key: 'modoOscuro' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 2 ? `1px solid ${C.g200}` : 'none' }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: s.configurable ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (s.configurable) setModal('configurar_recordatorios');
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, flexShrink: 0 }}>
                      {s.ic}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: s.danger ? '#ef4444' : C.tPrimary }}>{s.title}</div>
                      {s.sub && <div style={{ fontSize: 11, color: C.tHint, marginTop: 1 }}>{s.sub}</div>}
                    </div>
                    {s.configurable && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.purple }}>Configurar ›</span>
                    )}
                  </div>
                  {s.toggle && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (s.key) setData(d => ({ ...d, config: { ...d.config, [s.key]: !d.config[s.key] } }));
                      }}
                      style={{ width: 44, height: 24, borderRadius: 12, background: data.config[s.key] ? C.lime : C.g300, position: 'relative', transition: 'background .2s', flexShrink: 0, cursor: 'pointer' }}
                    >
                      <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: data.config[s.key] ? 22 : 2, transition: 'left .2s', boxShadow: '0 2px 4px rgba(0,0,0,.15)' }}></div>
                    </div>
                  )}
                  {!s.toggle && !s.danger && <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
        <button
          className="btn btn-lime"
          onClick={() => {
            if (!papelera) {
              cargarPapelera();
            }
            setMostrarPapelera(!mostrarPapelera);
          }}
          style={{ marginBottom: 16 }}
        >
          {mostrarPapelera ? '📦 Ocultar papelera' : '📦 Ver papelera (elementos eliminados)'}
        </button>

        {mostrarPapelera && (
          <div style={{ marginTop: 12, background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.g200}` }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.tPrimary, marginBottom: 16 }}>
              Elementos eliminados
            </div>
            <p style={{ fontSize: 12, color: C.tHint, marginBottom: 20, lineHeight: 1.6 }}>
              ⏱️ Los elementos eliminados se mantienen disponibles por <strong>72 horas</strong> antes de ser eliminados permanentemente.
              Después de este tiempo, no podrán ser recuperados.
            </p>

            {cargandoPapelera ? (
              <div style={{ textAlign: 'center', color: C.tHint, fontSize: 13 }}>Cargando papelera...</div>
            ) : !papelera || (!papelera.libros?.length && !papelera.notas?.length && !papelera.materias?.length) ? (
              <div style={{ textAlign: 'center', color: C.tHint, fontSize: 13, padding: '20px' }}>
                ✨ Tu papelera está vacía
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {/* Libros eliminados */}
                {papelera?.libros?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary, marginBottom: 12 }}>
                      📚 Libros ({papelera.libros.length})
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {papelera.libros.map((libro) => {
                        const horas = Math.ceil(libro.tiempoRestante / 3600);
                        return (
                          <div
                            key={`libro-${libro.id}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 12,
                              background: C.g100,
                              borderRadius: 10,
                              border: `1px solid ${C.g200}`,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>{libro.titulo}</div>
                              <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>
                                ⏱️ {horas}h restantes · {libro.autor || 'Sin autor'}
                              </div>
                            </div>
                            <button
                              className="btn btn-lime btn-sm"
                              style={{ minWidth: 100 }}
                              onClick={() => handleRestaurarElemento('libro', libro.id)}
                            >
                              Restaurar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notas eliminadas */}
                {papelera?.notas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary, marginBottom: 12 }}>
                      📝 Notas ({papelera.notas.length})
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {papelera.notas.map((nota) => {
                        const horas = Math.ceil(nota.tiempoRestante / 3600);
                        return (
                          <div
                            key={`nota-${nota.id}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 12,
                              background: C.g100,
                              borderRadius: 10,
                              border: `1px solid ${C.g200}`,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>
                                {nota.texto?.substring(0, 50) || nota.enlace || 'Nota sin título'}
                              </div>
                              <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>
                                ⏱️ {horas}h restantes · {nota.materia?.nombre || 'Materia desconocida'}
                              </div>
                            </div>
                            <button
                              className="btn btn-lime btn-sm"
                              style={{ minWidth: 100 }}
                              onClick={() => handleRestaurarElemento('nota', nota.id)}
                            >
                              Restaurar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Materias eliminadas */}
                {papelera?.materias?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary, marginBottom: 12 }}>
                      🎓 Materias ({papelera.materias.length})
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {papelera.materias.map((materia) => {
                        const horas = Math.ceil(materia.tiempoRestante / 3600);
                        return (
                          <div
                            key={`materia-${materia.id}`}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: 12,
                              background: C.g100,
                              borderRadius: 10,
                              border: `1px solid ${C.g200}`,
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>{materia.nombre}</div>
                              <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>
                                ⏱️ {horas}h restantes · {materia.semestre || 'Sin semestre'}
                              </div>
                            </div>
                            <button
                              className="btn btn-lime btn-sm"
                              style={{ minWidth: 100 }}
                              onClick={() => handleRestaurarElemento('materia', materia.id)}
                            >
                              Restaurar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      
    </>
  );

  return (
    <div className="app">
      <style>{css}</style>

      <button
        type="button"
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(v => !v)}
        aria-label="Abrir menú"
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <div className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sb-logo">
          <div className="sb-icon">
            <AppLogoIcon size={36} />
          </div>
          <div>
            <div className="sb-name">ReadTrack UTS</div>
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: 9, marginTop: 1 }}>v1.0</div>
          </div>
        </div>
        <div className="sb-nav">
          <div className="sb-section-label">Navegación</div>
          {navItems.map(n => (
            <div
              key={n.id}
              className={`nav-item ${activePage === n.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(n.id);
                setActiveMateria(null);
                setActiveLibro(null);
                setActiveNota(null);
                if (n.id === 'materias') {
                  setActiveMateriaTab('propias');
                }
                setMobileMenuOpen(false);
              }}
            >
              <span className="nav-ic">{n.icon}</span>
              <span className="nav-lbl">{n.label}</span>
              {n.badge && <span className="nav-badge">{n.badge}</span>}
            </div>
          ))}
        </div>
        <div className="sb-bottom">
          <div className="sb-avatar">{user?.nombre?.substring(0, 2).toUpperCase()}</div>
          <div>
            <div className="sb-user-name">{user?.nombre}</div>
            <div className="sb-user-email">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="main">
        {activePage === 'dashboard' && renderDashboard()}
        {activePage === 'materias' && renderMaterias()}
        {activePage === 'biblioteca' && renderBiblioteca()}
        {activePage === 'calendario' && renderCalendario()}
        {activePage === 'metas' && renderMetas()}
        {activePage === 'perfil' && renderPerfil()}
      </div>

      {modal && <RenderModals
        modal={modal}
        setModal={setModal}
        data={data}
        setData={setData}
        activeMateria={activeMateria}
        activeLibro={activeLibro}
        activeNota={activeNota}
        setActiveNota={setActiveNota}
        showToast={showToast}
        handleCrearMateria={handleCrearMateria}
        handleCrearNota={handleCrearNota}
        handleEditarNota={handleEditarNota}
        handleCrearLibro={handleCrearLibro}
        handleEditarLibro={handleEditarLibro}
        C={C}
        COLORS_MATERIA={COLORS_MATERIA}
        emailsComparticion={emailsComparticion}
        setEmailsComparticion={setEmailsComparticion}
        editandoMateria={editandoMateria}
        setEditandoMateria={setEditandoMateria}
        convertirAGrupo={convertirAGrupo}
        setConvertirAGrupo={setConvertirAGrupo}
        solicitarPermisoNotificaciones={solicitarPermisoNotificaciones}
        mostrarNotificacionNativa={mostrarNotificacionNativa}
      />}

      {renderEditProfileModal()}

      {modal === 'iniciar_sesion' && activeLibro && (
        <IniciarSesionModal
          libro={activeLibro}
          onStart={handleIniciarSesion}
          onCancel={() => { setModal(null); setActiveLibro(null); }}
          C={C}
        />
      )}

      {sesionActiva && mostrarFinalizarSesion && (
        <FinalizarSesionModal
          libro={sesionActiva.libro}
          sesion={sesionActiva}
          onConfirm={handleFinalizarSesion}
          onCancel={() => setMostrarFinalizarSesion(false)}
          C={C}
        />
      )}

      {sesionActiva && (
        <ReadingSessionBar
          session={sesionActiva}
          onUpdateSession={handleActualizarSesion}
          onEndSession={() => setMostrarFinalizarSesion(true)}
          C={C}
        />
      )}

      {toast && (
        <div className="toast">
          <span>✅</span>
          {toast}
        </div>
      )}
    </div>
  );
}

function RenderModals({ modal, setModal, data, setData, activeMateria, activeLibro, activeNota, setActiveNota, showToast, handleCrearMateria, handleCrearNota, handleEditarNota, handleCrearLibro, handleEditarLibro, C, COLORS_MATERIA, emailsComparticion, setEmailsComparticion, editandoMateria, setEditandoMateria, convertirAGrupo, setConvertirAGrupo, solicitarPermisoNotificaciones, mostrarNotificacionNativa }) {
  const [form, setForm] = useState({});
  const [filePreviews, setFilePreviews] = useState([]);
  const close = () => { setModal(null); setForm({}); setActiveNota(null); setEmailsComparticion(''); };

  useEffect(() => {
    const archivos = form.archivos || [];
    if (archivos.length === 0 || !['agregar_foto', 'agregar_audio', 'agregar_archivo'].includes(modal)) {
      setFilePreviews([]);
      return;
    }

    const previews = archivos.map((file) => ({
      file,
      objectUrl: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null,
      fecha: new Date(file.lastModified || Date.now()).toLocaleString(),
    }));
    setFilePreviews(previews);

    return () => {
      previews.forEach((p) => { if (p.objectUrl) URL.revokeObjectURL(p.objectUrl); });
    };
  }, [form.archivos, modal]);

  useEffect(() => {
    if (modal === 'editar_nota' && activeNota) {
      const toDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setForm({
        texto: activeNota.texto || '',
        enlace: activeNota.enlace || '',
        fechaCumplimiento: activeNota.fechaCumplimiento ? toDateString(activeNota.fechaCumplimiento) : '',
      });
      return;
    }
    if (modal === 'editar_libro' && activeLibro) {
      setForm({
        titulo: activeLibro.titulo || '',
        autor: activeLibro.autor || '',
        totalPaginas: activeLibro.totalPaginas || '',
        estado: activeLibro.estado || 'PENDIENTE',
      });
      return;
    }
    if (modal === 'editar_materia' && editandoMateria) {
      setConvertirAGrupo(false);
      setForm({
        nombre: editandoMateria.nombre || '',
        semestre: editandoMateria.semestre || '',
        descripcion: editandoMateria.descripcion || '',
      });
      return;
    }
    if (modal) {
      setForm({});
    }
  }, [modal, activeNota, activeLibro, editandoMateria]);

  const modalConfigs = {
    nueva_materia: {
      title: 'Nueva materia',
      fields: [
        { key: 'nombre', label: 'Nombre de la materia', placeholder: 'Ej: Cálculo Diferencial' },
        { key: 'semestre', label: 'Semestre', placeholder: 'Ej: 2026-1' },
        { key: 'descripcion', label: 'Descripción (opcional)', placeholder: 'Descripción breve...', textarea: true },
      ],
      onSave: async (form) => {
        await handleCrearMateria(form, close);
      },
    },
    nueva_nota: {
      title: 'Nueva nota',
      fields: [
        { key: 'texto', label: 'Texto de la nota', placeholder: 'Escribe tu nota aquí...', textarea: true },
        { key: 'enlace', label: 'Enlace (opcional)', placeholder: 'https://...' },
        { key: 'fechaCumplimiento', label: 'Fecha de cumplimiento (opcional)', type: 'date' },
      ],
      onSave: async (form) => {
        await handleCrearNota(form, close);
      },
    },
    agregar_foto: {
      title: 'Agregar foto',
      fields: [
        { key: 'archivo', label: 'Selecciona una foto', placeholder: '', type: 'file', accept: 'image/*' },
        { key: 'texto', label: 'Comentario (opcional)', placeholder: 'Describe brevemente esta foto...', textarea: true },
        { key: 'fechaCumplimiento', label: 'Fecha de cumplimiento (opcional)', type: 'date' },
      ],
      onSave: async (form) => {
        await handleCrearNota(form, close);
      },
    },
    agregar_audio: {
      title: 'Adjuntar nota de voz',
      fields: [
        { key: 'archivo', label: 'Selecciona un audio', placeholder: '', type: 'file', accept: 'audio/*' },
        { key: 'fechaCumplimiento', label: 'Fecha de cumplimiento (opcional)', type: 'date' },
      ],
      onSave: async (form) => {
        await handleCrearNota(form, close);
      },
    },
    agregar_archivo: {
      title: 'Adjuntar archivo',
      fields: [
        { key: 'archivo', label: 'Selecciona un archivo', placeholder: '', type: 'file', accept: '*/*' },
        { key: 'texto', label: 'Comentario (opcional)', placeholder: 'Describe este archivo...', textarea: true },
        { key: 'fechaCumplimiento', label: 'Fecha de cumplimiento (opcional)', type: 'date' },
      ],
      onSave: async (form) => {
        await handleCrearNota(form, close);
      },
    },
    editar_nota: {
      title: 'Editar nota',
      fields: [
        { key: 'texto', label: 'Texto de la nota', placeholder: 'Escribe tu nota aquí...', textarea: true },
        { key: 'enlace', label: 'Enlace (opcional)', placeholder: 'https://...' },
        { key: 'fechaCumplimiento', label: 'Fecha de cumplimiento (opcional)', type: 'date' },
      ],
      onSave: async (form) => {
        await handleEditarNota(form, close);
      },
    },
    ver_nota: {
      title: 'Ver nota',
      customContent: true,
    },
    nuevo_libro: {
      title: 'Agregar libro',
      fields: [
        { key: 'titulo', label: 'Título del libro', placeholder: 'Ej: El Principito' },
        { key: 'autor', label: 'Autor', placeholder: 'Ej: Antoine de Saint-Exupéry' },
        { key: 'totalPaginas', label: 'Total de páginas', placeholder: 'Ej: 350', type: 'number' },
        { key: 'estado', label: 'Estado', type: 'select', options: [
          { value: 'PENDIENTE', label: 'Pendiente' },
          { value: 'LEYENDO', label: 'Leyendo' },
          { value: 'TERMINADO', label: 'Terminado' },
        ] },
        { key: 'paginasLeidas', label: '¿En qué página vas?', placeholder: 'Ej: 120', type: 'number', showIf: (f) => f.estado === 'LEYENDO' },
      ],
      onSave: async (form) => {
        await handleCrearLibro(form, close);
      },
    },
    editar_libro: {
      title: 'Editar libro',
      fields: [
        { key: 'titulo', label: 'Título del libro', placeholder: 'Ej: El Principito' },
        { key: 'autor', label: 'Autor', placeholder: 'Ej: Antoine de Saint-Exupéry' },
        { key: 'totalPaginas', label: 'Total de páginas', placeholder: 'Ej: 350', type: 'number' },
        { key: 'estado', label: 'Estado', type: 'select', options: [
          { value: 'PENDIENTE', label: 'Pendiente' },
          { value: 'LEYENDO', label: 'Leyendo' },
          { value: 'TERMINADO', label: 'Terminado' },
        ] },
      ],
      onSave: async (form) => {
        await handleEditarLibro(form, close);
      },
    },
    cambiar_meta: {
      title: 'Cambiar meta semanal',
      fields: [{ key: 'meta', label: 'Páginas por semana', placeholder: 'Ej: 350', type: 'number' }],
      onSave: async (form) => {
        const nuevaMeta = parseInt(form.meta) || null;
        if (!nuevaMeta) {
          showToast('Por favor ingresa un valor válido');
          return;
        }
        if (data.meta.paginasSemana === nuevaMeta) {
          showToast('La meta ya está configurada con ese valor');
          return;
        }
        try {
          await metasService.actualizarMeta(nuevaMeta);
          showToast('✅ Meta actualizada');
          // Recargar la página para que se actualicen todos los datos
          setTimeout(() => window.location.reload(), 500);
          close();
        } catch (error) {
          console.error('Error actualizando meta:', error);
          showToast('Error al actualizar la meta. Intenta de nuevo.');
        }
      },
    },
    crear_grupo_materia: {
      title: 'Crear materia de grupo',
      fields: [
        { key: 'nombre', label: 'Nombre de la materia', placeholder: 'Ej: Cálculo Diferencial' },
        { key: 'semestre', label: 'Semestre', placeholder: 'Ej: 2026-1' },
        { key: 'descripcion', label: 'Descripción (opcional)', placeholder: 'Descripción breve...', textarea: true },
      ],
      onSave: async (form) => {
        if (!form.nombre) {
          showToast('El nombre de la materia es obligatorio');
          return;
        }
        try {
          const response = await materiasService.crear({
            nombre: form.nombre,
            descripcion: form.descripcion || null,
            semestre: form.semestre || '2026-1',
            color: String(data.materias.length % COLORS_MATERIA.length),
            esGrupo: true,
          });
          setData(d => ({ ...d, materias: [response.data, ...d.materias] }));
          showToast('✅ Materia de grupo creada exitosamente');
          close();
        } catch (err) {
          showToast(err.data?.mensaje || 'No se pudo crear la materia de grupo');
        }
      },
    },
    editar_materia: {
      title: 'Editar materia',
      customContent: true,
    },
    compartir_materia: {
      title: 'Compartir materia con compañeros',
      customContent: true,
    },
    configurar_recordatorios: {
      title: 'Configurar recordatorios',
      customContent: true,
    },
    buscar_grupo: {
      title: 'Buscar grupo',
      customContent: true,
    },
  };

  const cfg = modalConfigs[modal];
  if (!cfg) return null;

  // Modal de solo lectura para ver el contenido completo de una nota
  if (modal === 'ver_nota' && activeNota) {
    const archivosVer = Array.isArray(activeNota.archivos) && activeNota.archivos.length > 0
      ? activeNota.archivos
      : (activeNota.archivo ? [activeNota.archivo] : []);
    console.log('🔍 Modal ver_nota - activeNota:', activeNota, '| archivosVer:', archivosVer);
    const fechaCumplimientoVer = formatDate(activeNota.fechaCumplimiento);
    const youtubeThumbnailVer = getYoutubeThumbnail(activeNota.enlace);
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="modal" style={{ maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="modal-title" style={{ margin: 0 }}>Nota</div>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>×</button>
          </div>

          {activeNota.texto && (
            <div style={{ marginBottom: 16, fontSize: 15, color: C.tPrimary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {activeNota.texto}
            </div>
          )}

          {fechaCumplimientoVer && (
            <div style={{ fontSize: 13, color: C.tSecondary, marginBottom: 16 }}>
              📅 Fecha de cumplimiento: {fechaCumplimientoVer}
            </div>
          )}

          {activeNota.enlace && (
            youtubeThumbnailVer ? (
              <a href={activeNota.enlace} target="_blank" rel="noreferrer" className="youtube-thumb" style={{ display: 'block', marginBottom: 16 }}>
                <img src={youtubeThumbnailVer} alt="Miniatura YouTube" />
              </a>
            ) : (
              <a href={activeNota.enlace} target="_blank" rel="noreferrer" className="link-chip" style={{ marginBottom: 16, textDecoration: 'none' }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={2}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span style={{ fontSize: 12, color: '#0369a1', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeNota.enlace}
                </span>
              </a>
            )
          )}

          {archivosVer.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.tHint, marginBottom: 10 }}>
                📎 {archivosVer.length} archivo{archivosVer.length > 1 ? 's' : ''} adjunto{archivosVer.length > 1 ? 's' : ''}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {archivosVer.map((archivo, idx) => (
                  <div key={archivo.id || idx} className="file-preview-box" style={{ flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                        <div className="file-icon">
                          {archivo.tipo?.includes('pdf') ? 'PDF' : archivo.tipo?.includes('word') ? 'DOC' : archivo.tipo?.includes('spreadsheet') ? 'XLS' : archivo.tipo?.includes('presentation') ? 'PPT' : archivo.tipo?.startsWith('image/') ? 'IMG' : archivo.tipo?.startsWith('audio/') ? 'AUD' : 'FILE'}
                        </div>
                        <div className="file-meta">
                          <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getArchivoNombre(archivo)}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{archivo.tipo || 'Archivo'}</div>
                        </div>
                      </div>
                      <a href={getArchivoUrl(archivo)} target="_blank" rel="noreferrer" style={{ marginLeft: 12, color: C.purple, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Abrir</a>
                    </div>
                    {archivo.tipo?.startsWith('image/') && (
                      <img src={getArchivoUrl(archivo)} alt={getArchivoNombre(archivo)} className="attached-image-preview" style={{ marginTop: 12 }} />
                    )}
                    {archivo.tipo === 'application/pdf' && (
                      <div className="document-preview" style={{ marginTop: 12 }}>
                        <iframe src={getArchivoPreviewUrl(archivo)} title="Vista previa del archivo" />
                      </div>
                    )}
                    {archivo.tipo?.startsWith('audio/') && (
                      <audio controls src={getArchivoUrl(archivo)} style={{ width: '100%', marginTop: 12 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
              Cerrar
            </button>
            <button
              className="btn btn-lime"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setModal('editar_nota')}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal personalizado para buscar grupo
  if (modal === 'buscar_grupo') {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="modal" style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="modal-title" style={{ margin: 0 }}>
              🔍 Buscar grupo
            </div>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>
              ×
            </button>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">ID del grupo (Formato: id-creador)</div>
            <input 
              className="field-input" 
              type="text"
              placeholder="Ej: 1706959200000-5"
              value={buscandoGrupo}
              onChange={(e) => setBuscandoGrupo(e.target.value)}
            />
            <div style={{ fontSize: 11, color: C.tHint, marginTop: 8 }}>
              Pídele al creador del grupo que comparta contigo el ID del grupo (aparece como: id-creador)
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
              Cancelar
            </button>
            <button 
              className="btn btn-lime" 
              style={{ flex: 1, justifyContent: 'center' }} 
              onClick={async () => {
                if (!buscandoGrupo.trim()) {
                  showToast('Por favor ingresa un ID válido');
                  return;
                }
                try {
                  const response = await fetch(`${CONFIG.API_BASE_URL}/materias/grupo/${buscandoGrupo}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_STORAGE_KEY)}` }
                  });
                  if (!response.ok) {
                    const errJson = await response.json().catch(() => ({}));
                    showToast(errJson.mensaje || 'Grupo no encontrado');
                    return;
                  }
                  const { datos: grupoData } = await response.json();
                  
                  // Unirse al grupo
                  const unirseResponse = await fetch(`${CONFIG.API_BASE_URL}/materias/grupo/unirse`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_STORAGE_KEY)}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ grupoId: buscandoGrupo })
                  });
                  
                  if (!unirseResponse.ok) {
                    const errJson = await unirseResponse.json().catch(() => ({}));
                    showToast(errJson.mensaje || 'Error al unirse al grupo');
                    return;
                  }
                  
                  // Recargar datos
                  await loadAppData();
                  showToast(`✅ Te uniste al grupo: ${grupoData.nombre}`);
                  setBuscandoGrupo('');
                  close();
                } catch (err) {
                  console.error('Error:', err);
                  showToast('Error al buscar o unirse al grupo');
                }
              }}
            >
              Unirse al grupo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal personalizado para editar materia
  if (modal === 'editar_materia' && editandoMateria) {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="modal" style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="modal-title" style={{ margin: 0 }}>
              Editar materia
            </div>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>
              ×
            </button>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Nombre de la materia</div>
            <input 
              className="field-input" 
              type="text"
              placeholder="Ej: Cálculo Diferencial"
              value={form.nombre || ''}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Semestre</div>
            <input 
              className="field-input" 
              type="text"
              placeholder="Ej: 2026-1"
              value={form.semestre || ''}
              onChange={(e) => setForm({ ...form, semestre: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Descripción (opcional)</div>
            <textarea 
              className="field-textarea" 
              rows={3}
              placeholder="Descripción breve..."
              value={form.descripcion || ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {!editandoMateria.esGrupo && (
            <div style={{ background: 'rgba(190,213,47,.1)', border: `2px solid ${C.lime}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 0 }}>
                <input 
                  type="checkbox" 
                  checked={convertirAGrupo}
                  onChange={(e) => setConvertirAGrupo(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary }}>Convertir a materia de grupo</div>
                  <div style={{ fontSize: 12, color: C.tSecondary, marginTop: 4 }}>Permite que otros usuarios se unan a esta materia compartiendo el ID</div>
                </div>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
              Cancelar
            </button>
            <button 
              className="btn btn-lime" 
              style={{ flex: 1, justifyContent: 'center' }} 
              onClick={async () => {
                if (!form.nombre?.trim()) {
                  showToast('El nombre de la materia es obligatorio');
                  return;
                }
                try {
                  const response = await materiasService.actualizar(editandoMateria.id, {
                    nombre: form.nombre,
                    descripcion: form.descripcion || null,
                    semestre: form.semestre || editandoMateria.semestre,
                    color: editandoMateria.color,
                    esGrupo: convertirAGrupo || editandoMateria.esGrupo,
                  });
                  setData(d => ({
                    ...d,
                    materias: d.materias.map(m => m.id === editandoMateria.id ? response.data : m)
                  }));
                  setEditandoMateria(null);
                  setConvertirAGrupo(false);
                  showToast('✅ Materia actualizada exitosamente');
                  close();
                } catch (err) {
                  console.error('Error:', err);
                  showToast('No se pudo actualizar la materia');
                }
              }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal personalizado para compartir materia
  if (modal === 'compartir_materia') {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="modal" style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="modal-title" style={{ margin: 0 }}>
              {cfg.title}
            </div>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>
              ×
            </button>
          </div>

          {/* Alerta de responsabilidad */}
          <div style={{ background: 'rgba(190,213,47,.1)', border: `2px solid ${C.lime}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 20, marginTop: 2 }}>⚠️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.tPrimary, marginBottom: 6 }}>Responsabilidad del grupo</div>
                <div style={{ fontSize: 12, color: C.tSecondary, lineHeight: 1.6 }}>
                  Al compartir esta materia, Usted se hace responsable de mantener la organización del grupo, responder preguntas de los compañeros y asegurar que todos tengan acceso a la información correcta.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div className="field-label">Emails de compañeros (separados por coma o Enter)</div>
            <textarea 
              className="field-textarea" 
              rows={4} 
              placeholder="usuario1@uts.edu.co, usuario2@uts.edu.co" 
              value={emailsComparticion}
              onChange={(e) => setEmailsComparticion(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
            <div style={{ fontSize: 11, color: C.tHint, marginTop: 8 }}>
              Ingresa los emails de los compañeros con los que deseas compartir esta materia
            </div>
          </div>

          <div style={{ background: C.g100, borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.tPrimary, marginBottom: 8 }}>Resumen</div>
            <div style={{ fontSize: 12, color: C.tSecondary }}>
              <div>📚 Materia: <span style={{ fontWeight: 600 }}>{activeMateria?.nombre}</span></div>
              <div style={{ marginTop: 4 }}>👥 Invitaciones: <span style={{ fontWeight: 600 }}>{emailsComparticion.split(',').filter(e => e.trim()).length}</span></div>
            </div>
            {activeMateria?.grupoId && (
              <div style={{ display: 'none', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.g300}` }}>
                <div style={{ fontSize: 11, color: C.tHint, marginBottom: 4 }}>
                  ID del grupo (respaldo manual, por si la invitación no llega):
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 12, fontFamily: 'monospace', color: C.tPrimary, background: C.white, padding: '4px 8px', borderRadius: 6, flex: 1 }}>
                    {activeMateria.grupoId}
                  </code>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: '4px 10px', fontSize: 11 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(activeMateria.grupoId);
                      showToast('📋 ID del grupo copiado');
                    }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
              Cancelar
            </button>
            <button 
              className="btn btn-lime" 
              style={{ flex: 1, justifyContent: 'center' }} 
              onClick={async () => {
                const emails = emailsComparticion.split(',').filter(e => e.trim());
                if (emails.length === 0) {
                  showToast('Por favor ingresa al menos un email');
                  return;
                }
                try {
                  const response = await materiasService.compartir(activeMateria.id, emails);
                  showToast('✅ ' + (response.data?.mensaje || `Compartida con ${emails.length} compañero${emails.length > 1 ? 's' : ''}`));
                  setEmailsComparticion('');
                  close();
                } catch (err) {
                  console.error('Error al compartir materia:', err);
                  showToast(err.data?.mensaje || 'Error al compartir la materia');
                }
              }}
            >
              Compartir
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (modal === 'configurar_recordatorios') {
    const cfgNotif = data.config;
    const permisoActual = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    const silenciadoHasta = cfgNotif.recordatorioSilenciadoHasta;
    const estaSilenciado = silenciadoHasta && new Date(silenciadoHasta) > new Date();

    const actualizarConfig = (cambios) => {
      setData(d => ({ ...d, config: { ...d.config, ...cambios } }));
    };

    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="modal" style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="modal-title" style={{ margin: 0 }}>
              {cfg.title}
            </div>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>
              ×
            </button>
          </div>

          {/* Estado del permiso del navegador */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: 12,
            borderRadius: 12,
            background: permisoActual === 'granted' ? 'rgba(190,213,47,.12)' : 'rgba(239,68,68,.08)',
            border: `1px solid ${permisoActual === 'granted' ? 'rgba(190,213,47,.3)' : 'rgba(239,68,68,.25)'}`,
          }}>
            <div style={{ fontSize: 18 }}>{permisoActual === 'granted' ? '🔔' : '🔕'}</div>
            <div style={{ flex: 1, fontSize: 12, color: C.tSecondary }}>
              {permisoActual === 'granted' && 'Las notificaciones de este navegador están activadas.'}
              {permisoActual === 'denied' && 'Bloqueaste las notificaciones para este sitio. Actívalas desde los ajustes de tu navegador para poder recibirlas.'}
              {permisoActual === 'default' && 'Aún no has dado permiso para recibir notificaciones en este navegador.'}
              {permisoActual === 'unsupported' && 'Tu navegador no soporta notificaciones.'}
            </div>
            {permisoActual !== 'granted' && permisoActual !== 'unsupported' && (
              <button
                type="button"
                className="btn btn-lime btn-sm"
                style={{ flexShrink: 0 }}
                onClick={async () => {
                  const ok = await solicitarPermisoNotificaciones();
                  if (ok) showToast('✅ Notificaciones activadas');
                }}
              >
                Activar
              </button>
            )}
          </div>

          {/* Hora del recordatorio */}
          <div style={{ marginBottom: 16 }}>
            <div className="field-label">Hora del recordatorio</div>
            <input
              type="time"
              className="field-input"
              value={cfgNotif.recordatorioHora || '08:00'}
              onChange={(e) => actualizarConfig({ recordatorioHora: e.target.value })}
            />
            <div style={{ fontSize: 11, color: C.tHint, marginTop: 6 }}>
              Todos los días a esta hora, si tienes notas con fecha de cumplimiento pendientes, te llega una notificación.
            </div>
          </div>

          {/* Fuente de materias */}
          <div style={{ marginBottom: 16 }}>
            <div className="field-label">Avisarme sobre notas de</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
              {[
                { value: 'todas', label: 'Todas mis materias (propias y de grupo)' },
                { value: 'propias', label: 'Solo mis materias propias' },
                { value: 'grupo', label: 'Solo materias en grupo' },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.tSecondary, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="recordatorioFuente"
                    checked={(cfgNotif.recordatorioFuente || 'todas') === opt.value}
                    onChange={() => actualizarConfig({ recordatorioFuente: opt.value })}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Notas nuevas en grupo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingTop: 4 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary }}>Avisarme de notas nuevas en grupo</div>
              <div style={{ fontSize: 11, color: C.tHint, marginTop: 2 }}>
                Notificación cuando un compañero agrega una nota en una materia de grupo
              </div>
            </div>
            <div
              onClick={() => actualizarConfig({ notificarNotasGrupo: !cfgNotif.notificarNotasGrupo })}
              style={{ width: 44, height: 24, borderRadius: 12, background: cfgNotif.notificarNotasGrupo ? C.lime : C.g300, position: 'relative', transition: 'background .2s', flexShrink: 0, cursor: 'pointer' }}
            >
              <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: cfgNotif.notificarNotasGrupo ? 22 : 2, transition: 'left .2s', boxShadow: '0 2px 4px rgba(0,0,0,.15)' }}></div>
            </div>
          </div>

          {/* Silenciar por X días */}
          <div style={{ background: C.g100, borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.tPrimary, marginBottom: 8 }}>
              {estaSilenciado ? `🔕 Silenciado hasta ${new Date(silenciadoHasta).toLocaleDateString('es-ES')}` : 'Silenciar notificaciones'}
            </div>
            {estaSilenciado ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  actualizarConfig({ recordatorioSilenciadoHasta: null });
                  showToast('🔔 Recordatorios reactivados');
                }}
              >
                Quitar silencio
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  id="dias-silencio-input"
                  type="number"
                  min="1"
                  max="90"
                  defaultValue="3"
                  className="field-input"
                  style={{ width: 90 }}
                />
                <span style={{ fontSize: 12, color: C.tSecondary }}>días</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {
                    const input = document.getElementById('dias-silencio-input');
                    const dias = Math.max(1, parseInt(input?.value, 10) || 3);
                    const hasta = new Date();
                    hasta.setDate(hasta.getDate() + dias);
                    actualizarConfig({ recordatorioSilenciadoHasta: hasta.toISOString() });
                    showToast(`🔕 Recordatorios silenciados por ${dias} día${dias > 1 ? 's' : ''}`);
                  }}
                >
                  Silenciar
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={async () => {
                const ok = await solicitarPermisoNotificaciones();
                if (ok) {
                  mostrarNotificacionNativa('📚 ReadTrack UTS', 'Así se verán tus recordatorios de lectura.');
                }
              }}
            >
              Probar notificación
            </button>
            <button className="btn btn-lime" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
              Listo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="modal-title" style={{ margin: 0 }}>
            {cfg.title}
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tHint, fontSize: 20 }}>
            ×
          </button>
        </div>
        {cfg.fields.filter(f => !f.showIf || f.showIf(form)).map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div className="field-label">{f.label}</div>
            {f.textarea ? (
              <textarea className="field-textarea" rows={3} placeholder={f.placeholder} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            ) : f.type === 'file' ? (
              <input
                className="field-input"
                type="file"
                accept={f.accept || undefined}
                multiple
                onChange={(e) => {
                  const nuevos = Array.from(e.target.files || []);
                  setForm((prev) => ({ ...prev, archivos: [...(prev.archivos || []), ...nuevos] }));
                  e.target.value = '';
                }}
              />
            ) : f.type === 'select' ? (
              <select
                className="field-input"
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              >
                <option value="">Selecciona una opción</option>
                {f.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                className="field-input"
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={form[f.key] || ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
        {(modal === 'agregar_foto' || modal === 'agregar_audio' || modal === 'agregar_archivo') && filePreviews.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.tHint, marginBottom: 8 }}>
              {filePreviews.length} archivo{filePreviews.length > 1 ? 's' : ''} seleccionado{filePreviews.length > 1 ? 's' : ''}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: 8,
                scrollSnapType: 'x proximity',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filePreviews.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    flex: '0 0 140px',
                    width: 140,
                    scrollSnapAlign: 'start',
                    background: C.g100,
                    border: `1px solid ${C.g300}`,
                    borderRadius: 10,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, archivos: prev.archivos.filter((_, i) => i !== idx) }))}
                    style={{ position: 'absolute', top: 6, right: 6, background: '#fee2e2', border: 'none', borderRadius: 6, width: 20, height: 20, cursor: 'pointer', color: '#dc2626', fontSize: 13, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    title="Quitar archivo"
                  >
                    ×
                  </button>
                  {p.objectUrl ? (
                    <img
                      src={p.objectUrl}
                      alt={p.file.name}
                      style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                    />
                  ) : (
                    <div className="file-icon" style={{ marginBottom: 8 }}>
                      {p.file.type?.includes('pdf') ? 'PDF' : p.file.type?.includes('word') ? 'DOC' : p.file.type?.includes('spreadsheet') ? 'XLS' : p.file.type?.includes('presentation') ? 'PPT' : p.file.type?.startsWith('audio/') ? 'AUD' : 'FILE'}
                    </div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.tPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }} title={p.file.name}>
                    {p.file.name}
                  </div>
                  <div style={{ fontSize: 10, color: C.tHint, marginTop: 2 }}>
                    {(p.file.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>
            Cancelar
          </button>
          <button className="btn btn-lime" style={{ flex: 1, justifyContent: 'center' }} onClick={() => cfg.onSave(form)}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function getFileExtension(value) {
  if (!value) return '';
  const match = value.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  return match ? match[1].toLowerCase() : '';
}

function getArchivoNombre(archivo) {
  if (!archivo) return 'Archivo adjunto';
  if (archivo.nombreOriginal) return archivo.nombreOriginal;
  if (archivo.nombre) return archivo.nombre;
  try {
    const parsed = new URL(archivo.url, window.location.origin);
    const parts = parsed.pathname.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : 'Archivo adjunto';
  } catch {
    return 'Archivo adjunto';
  }
}

function getBackendOrigin() {
  try {
    const parsed = new URL(CONFIG.API_BASE_URL);
    return parsed.origin;
  } catch {
    return window.location.origin;
  }
}

function getArchivoUrl(archivo) {
  if (!archivo || !archivo.url) return null;
  const url = archivo.url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) {
    return `${getBackendOrigin()}${url}`;
  }
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

function isOfficeDocument(archivo) {
  if (!archivo) return false;
  const tipo = (archivo.tipo || '').toLowerCase();
  if (tipo === 'application/pdf') return true;
  if (tipo.includes('officedocument') || tipo.includes('msword') || tipo.includes('presentation') || tipo.includes('spreadsheet')) return true;
  const nombre = (archivo.nombreOriginal || archivo.url || '').toLowerCase();
  return ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf'].some(ext => nombre.endsWith(ext));
}

function getArchivoPreviewUrl(archivo) {
  if (!archivo) return null;
  if (archivo.tipo === 'application/pdf') {
    const url = getArchivoUrl(archivo);
    return url ? `${encodeURI(url)}#page=1` : null;
  }
  return getArchivoUrl(archivo);
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-ES');
}

function getYoutubeThumbnail(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:.*v=|embed\/|v\/))([A-Za-z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

function NotaCard({ nota, color, C, esGrupo, onEdit, onDelete, onOpen }) {
  const archivos = Array.isArray(nota.archivos) && nota.archivos.length > 0
    ? nota.archivos
    : (nota.archivo ? [nota.archivo] : []);
  const youtubeThumbnail = getYoutubeThumbnail(nota.enlace);
  const fechaCumplimiento = formatDate(nota.fechaCumplimiento);

  if (archivos.length > 0) {
    console.log('🔍 NotaCard - nota.id:', nota.id, '| archivos:', archivos);
  }

  const renderArchivoMini = (archivo) => {
    const tipo = archivo?.tipo || '';
    const esImagen = tipo.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(archivo?.nombreOriginal || archivo?.url || '');
    if (esImagen) {
      const url = getArchivoUrl(archivo);
      return (
        <img
          src={url}
          alt={getArchivoNombre(archivo)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      );
    }
    const etiqueta = tipo.includes('pdf') ? 'PDF' : tipo.includes('word') ? 'DOC' : tipo.includes('spreadsheet') ? 'XLS' : tipo.includes('presentation') ? 'PPT' : tipo.startsWith('audio/') ? '🎙️' : '📄';
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef0f2', color: C.tSecondary, fontSize: 13, fontWeight: 700 }}>
        {etiqueta}
      </div>
    );
  };

  return (
    <div className="nota-card" onClick={onOpen} style={{ cursor: onOpen ? 'pointer' : undefined }}>
      <div className="nota-header">
        <div className="nota-bar" style={{ background: color }}></div>
        <div className="nota-heading">
          {nota.titulo && <div className="nota-sub">{nota.titulo}</div>}
          {nota.texto && <div className="nota-title">{nota.texto}</div>}
          {fechaCumplimiento && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Fecha de cumplimiento: {fechaCumplimiento}</div>}
        </div>
      </div>
      <div className="nota-content">
        {youtubeThumbnail && (
          <a href={nota.enlace} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="youtube-thumb">
            <img src={youtubeThumbnail} alt="Miniatura YouTube" />
          </a>
        )}

        {archivos.length === 1 && (
          <div style={{ width: '100%', height: 180, borderRadius: 10, overflow: 'hidden' }}>
            {renderArchivoMini(archivos[0])}
          </div>
        )}

        {archivos.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, width: '100%', height: 180, borderRadius: 10, overflow: 'hidden' }}>
            {archivos.slice(0, 4).map((archivo, idx) => {
              const esUltimaCeldaConExtra = idx === 3 && archivos.length > 4;
              const restantes = archivos.length - 4;
              return (
                <div key={archivo.id || idx} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  {renderArchivoMini(archivo)}
                  {esUltimaCeldaConExtra && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                      +{restantes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {archivos.length > 1 && (
          <div style={{ fontSize: 11, color: '#9ba3ad', marginTop: 6 }}>📎 {archivos.length} archivos adjuntos</div>
        )}

        {nota.enlace && !youtubeThumbnail && (
          <div className="link-chip">
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={2}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span style={{ fontSize: 10, color: '#0369a1', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nota.enlace}
            </span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, paddingTop: 10, borderTop: `1px solid rgba(0,0,0,.08)` }}>
        <span style={{ fontSize: 10, color: '#9ba3ad', display: 'flex', alignItems: 'center', gap: 6 }}>
          {nota.creadoEn}
          {esGrupo && nota.autor?.nombre && (
            <span style={{ color: C.lime, fontWeight: 600 }}>· Creada por {nota.autor.nombre}</span>
          )}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="act-btn act-edit"
            title="Editar"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', padding: 0 }}
          >
            <EditIcon />
          </button>
          <button
            className="act-btn act-del"
            title="Eliminar"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ background: '#fee2e2', border: 'none', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', padding: 0 }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
