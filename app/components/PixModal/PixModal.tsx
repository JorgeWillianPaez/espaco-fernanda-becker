"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./PixModal.module.css";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: number;
  amount: number;
  referenceMonth: string;
  onPaymentConfirmed: () => void;
}

interface PixData {
  id: number;
  status: string;
  qrCode: string;
  qrCodeBase64: string;
  expirationDate: string;
  ticketUrl: string;
}

const PixModal = ({
  isOpen,
  onClose,
  paymentId,
  amount,
  referenceMonth,
  onPaymentConfirmed,
}: PixModalProps) => {
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          return parsed.state?.token || null;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const generatePix = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:3001/api/mercadopago/pix/${paymentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao gerar PIX");
      }

      setPixData(result.data);
    } catch (err: any) {
      setError(err.message || "Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!pixData || checkingStatus) return;

    try {
      setCheckingStatus(true);
      const token = getToken();
      const response = await fetch(
        `http://localhost:3001/api/mercadopago/status/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (
        result.data?.status === "approved" ||
        result.data?.internalStatus === "paid"
      ) {
        onPaymentConfirmed();
        onClose();
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err);
    } finally {
      setCheckingStatus(false);
    }
  }, [pixData, paymentId, onPaymentConfirmed, onClose, checkingStatus]);

  // Gerar PIX ao abrir o modal
  useEffect(() => {
    if (isOpen && !pixData && !loading) {
      generatePix();
    }
  }, [isOpen]);

  // Verificar status periodicamente
  useEffect(() => {
    if (!isOpen || !pixData) return;

    const interval = setInterval(checkPaymentStatus, 5000); // Verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, [isOpen, pixData, checkPaymentStatus]);

  // Resetar ao fechar
  useEffect(() => {
    if (!isOpen) {
      setPixData(null);
      setError("");
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyCode = async () => {
    if (pixData?.qrCode) {
      try {
        await navigator.clipboard.writeText(pixData.qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className={styles.header}>
          <div className={styles.pixIcon}>
            <svg viewBox="0 0 512 512" fill="currentColor">
              <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.9 231.1 518.9 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C257.1 224.4 247.9 224.5 242.4 218.9L165.7 142.2C151.5 128 132.6 120.2 112.6 120.2H103.3L200.2 23.24C230.5-7.08 279.6-7.08 309.9 23.24L407.7 120.2H392.6C372.6 120.2 353.7 128 339.5 142.2L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C ## 245.6 271.9 241.1 279.1 234.8L202.4 157.2C## 148.3 126.4 142.7 112.6 142.7H95.03L23.24 214.6C-7.08 244.8-7.08 293.1 23.24 323.3L95.03 395.2H112.6C126.4 395.2 139.1 389.6 149.7 380.8L226.4 303.2C233.6 296.9 243 292.4 252.5 292.4C## 292.4 271.9 296.9 279.1 304.1L355.8 380.8C366.5 391.5 380.2 397.1 394 397.1H428.1L500.8 324.4C531.1 294.1 531.1 245 500.8 214.6L428.1 141.8H394C380.2 141.8 366.5 147.4 355.8 158.1L279.1 234.8C271.9 241.1 ## 245.6 252.5 245.6C243 245.6 233.6 241.1 226.4 234.8L149.7 158.1C139.1 147.4 126.4 141.8 112.6 141.8H95.03z" />
            </svg>
          </div>
          <h2>Pagamento via PIX</h2>
          <p className={styles.subtitle}>Mensalidade {referenceMonth}</p>
        </div>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Gerando código PIX...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button onClick={generatePix} className={styles.retryButton}>
                Tentar novamente
              </button>
            </div>
          )}

          {pixData && !loading && !error && (
            <>
              <div className={styles.amount}>
                <span>Valor a pagar:</span>
                <strong>{formatCurrency(amount)}</strong>
              </div>

              <div className={styles.qrCodeContainer}>
                {pixData.qrCodeBase64 && (
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className={styles.qrCode}
                  />
                )}
              </div>

              <div className={styles.instructions}>
                <p>
                  <i className="fas fa-mobile-alt"></i>
                  Abra o app do seu banco e escaneie o QR Code
                </p>
                <p className={styles.or}>ou</p>
                <p>
                  <i className="fas fa-copy"></i>
                  Copie o código e cole no app do banco
                </p>
              </div>

              <div className={styles.copySection}>
                <div className={styles.pixCode}>
                  <code>{pixData.qrCode?.substring(0, 50)}...</code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`${styles.copyButton} ${
                    copied ? styles.copied : ""
                  }`}
                >
                  {copied ? (
                    <>
                      <i className="fas fa-check"></i> Copiado!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i> Copiar código
                    </>
                  )}
                </button>
              </div>

              <div className={styles.statusInfo}>
                <div className={styles.statusDot}></div>
                <span>Aguardando pagamento...</span>
              </div>

              <p className={styles.note}>
                O pagamento será confirmado automaticamente após a compensação.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PixModal;
