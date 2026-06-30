import React, { useEffect, useState } from 'react';
import { X, Sun, Moon, Languages, RefreshCw, Github, Linkedin } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { LANGUAGES } from './i18n';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: string;
  setLang: (lang: string) => void;
  autoCheckUpdate: boolean;
  setAutoCheckUpdate: (val: boolean) => void;
  t: (key: string) => string;
}

export function SettingsDrawer({
  isOpen,
  onClose,
  theme,
  setTheme,
  lang,
  setLang,
  autoCheckUpdate,
  setAutoCheckUpdate,
  t,
}: SettingsDrawerProps) {
  const [appVersion, setAppVersion] = useState<string>('1.1.1');

  const handleOpenUrl = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    invoke('open_url', { url }).catch((err) => {
      console.error('Failed to open url:', err);
      window.open(url, '_blank');
    });
  };

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const { getVersion } = await import('@tauri-apps/api/app');
        const version = await getVersion();
        setAppVersion(version);
      } catch (_) {
        // 降級為靜態包版本
        setAppVersion('1.1.1');
      }
    };
    fetchVersion();
  }, []);

  const handleToggleAutoUpdate = (checked: boolean) => {
    setAutoCheckUpdate(checked);
    localStorage.setItem('md2pdf_auto_check_update', String(checked));
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`settings-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />

      {/* Settings Drawer Panel */}
      <div className={`settings-drawer ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>{t('settings') || '設定 / Settings'}</h3>
          <button className="close-btn" onClick={onClose} title={t('close') || '關閉'}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* 1. 主題切換 */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                {t('theme') || '外觀主題'}
              </span>
              <span className="setting-desc">
                {theme === 'dark' ? t('dark_mode') || '深色模式' : t('light_mode') || '淺色模式'}
              </span>
            </div>
            <label className="drawer-toggle-switch">
              <input 
                type="checkbox" 
                checked={theme === 'dark'} 
                onChange={handleToggleTheme}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* 2. 多國語言 */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">
                <Languages size={18} />
                {t('language') || '介面語言'}
              </span>
              <span className="setting-desc">
                {LANGUAGES.find(l => l.id === lang)?.name || 'Language'}
              </span>
            </div>
            <select 
              className="setting-select"
              value={lang} 
              onChange={(e) => {
                setLang(e.target.value);
                localStorage.setItem('app_lang', e.target.value);
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. 自動更新開關 */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">
                <RefreshCw size={18} />
                {t('auto_check_update') || '自動檢查更新'}
              </span>
              <span className="setting-desc">
                {t('auto_check_update_desc') || '啟動軟體時在背景自動偵測更新'}
              </span>
            </div>
            <label className="drawer-toggle-switch">
              <input 
                type="checkbox" 
                checked={autoCheckUpdate} 
                onChange={(e) => handleToggleAutoUpdate(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="drawer-footer">
          <div className="version-info">
            <span>md2pdf {t('current_version') || '目前版本'}</span>
            <span className="version-tag">v{appVersion}</span>
          </div>
          <div className="social-links">
            <a 
              href="https://github.com/dbshadow/md2pdf-rust" 
              onClick={(e) => handleOpenUrl('https://github.com/dbshadow/md2pdf-rust', e)}
              target="_blank" 
              rel="noopener noreferrer"
              title="GitHub Repository"
              className="social-icon-btn"
            >
              <Github size={16} />
            </a>
            <a 
              href="https://www.linkedin.com/in/dbshadow/" 
              onClick={(e) => handleOpenUrl('https://www.linkedin.com/in/dbshadow/', e)}
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="social-icon-btn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
