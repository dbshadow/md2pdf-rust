import React from 'react';
import { ArrowUpCircle, RefreshCw, AlertTriangle, X, CheckCircle } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  currentVersion: string;
  newVersion: string;
  updateBody: string;
  status: 'idle' | 'downloading' | 'error' | 'finished';
  progress: number;
  errorMsg?: string;
  onClose: () => void;
  onUpdate: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  currentVersion,
  newVersion,
  updateBody,
  status,
  progress,
  errorMsg,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="update-modal-overlay">
      <div className="update-modal">
        
        {/* Header */}
        <div className="update-modal-header">
          <div className="update-modal-title-area">
            <ArrowUpCircle className="logo-icon" style={{ animation: 'bounce 1s infinite' }} size={20} />
            <span className="update-modal-title">發現新版本！</span>
          </div>
          {status !== 'downloading' && status !== 'finished' && (
            <button onClick={onClose} className="update-modal-close-btn">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="update-modal-body">
          
          {/* Version Info Badge */}
          <div className="update-version-badge-container">
            <div className="update-version-col">
              <span className="update-version-label">目前版本</span>
              <span className="update-version-val">v{currentVersion}</span>
            </div>
            <div className="update-version-divider" />
            <div className="update-version-col" style={{ textAlign: 'right' }}>
              <span className="update-version-label">最新版本</span>
              <span className="update-version-val new">v{newVersion}</span>
            </div>
          </div>

          {/* Release Notes */}
          {status !== 'downloading' && status !== 'finished' && (
            <div className="update-notes-section">
              <span className="update-notes-title">更新內容說明</span>
              <div className="update-notes-content">
                {updateBody ? (
                  updateBody
                ) : (
                  <span style={{ fontStyle: 'italic', opacity: 0.5 }}>此版本無提供額外更新說明。</span>
                )}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {(status === 'downloading' || status === 'finished') && (
            <div className="update-progress-container">
              <div className="update-progress-info">
                <span className="update-progress-status">
                  {status === 'downloading' ? (
                    <>
                      <RefreshCw className="animate-spin-custom" size={14} style={{ color: 'var(--accent)' }} />
                      <span>正在下載更新檔案...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                      <span style={{ color: '#10b981' }}>下載完成，準備重新啟動...</span>
                    </>
                  )}
                </span>
                <span className="update-progress-percent">{Math.round(progress)}%</span>
              </div>
              <div className="update-progress-track">
                <div className="update-progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="update-error-container">
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div className="update-error-text">
                <span className="update-error-title">更新失敗</span>
                <span className="update-error-desc">{errorMsg || '請檢查網路連線後重試。'}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="update-modal-footer">
          {status === 'idle' || status === 'error' ? (
            <>
              <button onClick={onClose} className="update-btn-cancel">
                暫不更新
              </button>
              <button onClick={onUpdate} className="update-btn-confirm">
                {status === 'error' ? '重新嘗試' : '立即更新'}
              </button>
            </>
          ) : (
            <div className="update-footer-tip">
              下載與安裝中，請勿關閉軟體...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
