import React from 'react';
import { ChevronLeftIcon, RandSignIcon, PlusIcon, TransferIcon, DownloadIcon, CheckCircleIcon } from './CustomIcons';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const AccountDetailsPage = ({ 
  accountType, 
  balance, 
  transactions, 
  userName, 
  accountNumber, 
  onBack, 
  onTransfer,
}) => {
  
  // Helper to format currency
  const formatZAR = (amount) => {
    return amount.toLocaleString('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR' 
    });
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'withdrawal': return '#ef4444';
      case 'deposit': return '#10b981';
      case 'transfer': return '#3e82f7';
      default: return 'var(--color-text-main)';
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'withdrawal': return <RandSignIcon size={20} />;
      case 'deposit': return <PlusIcon size={20} />;
      case 'transfer': return <TransferIcon size={20} />;
      default: return <PlusIcon size={20} />;
    }
  };

  const getTransactionBg = (type) => {
     switch(type) {
      case 'withdrawal': return 'rgba(239, 68, 68, 0.1)';
      case 'deposit': return 'rgba(16, 185, 129, 0.1)';
      case 'transfer': return 'rgba(62, 130, 247, 0.1)';
      default: return 'var(--color-input-bg)';
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const now = new Date();
    const printDate = now.toLocaleDateString('en-ZA');
    
    // Header
    doc.setFillColor(43, 41, 56);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("OpenBank", 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${accountType} Statement`, 14, 28);

    doc.setTextColor(0, 0, 0);
    
    // Account Details
    const startY = 50;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Account: ${accountType}`, 14, startY);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Account Number: ${accountNumber}`, 14, startY + 6);
    doc.text(`Current Balance: ${formatZAR(balance)}`, 14, startY + 12);
    doc.text(`Date: ${printDate}`, 14, startY + 18);

    // Table
    const tableColumn = ["Date", "Description", "Type", "Amount"];
    const tableRows = transactions.map(tx => [
      tx.date,
      tx.title,
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      tx.amount
    ]);

    // @ts-ignore
    const generateTable = autoTable.default || autoTable;
    if (typeof generateTable === 'function') {
      generateTable(doc, {
        startY: startY + 25,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [43, 41, 56], textColor: 255 },
      });
      doc.save(`${accountType}_Statement.pdf`);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content" style={{ justifyContent: 'flex-start' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-main)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '1rem', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ChevronLeftIcon size={20} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* Account Header Card */}
          <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{accountType}</h1>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{userName} • {accountNumber}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Available Balance</span>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>{formatZAR(balance)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <button 
                onClick={onTransfer}
                className="btn-primary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <TransferIcon size={18} /> Transfer Funds
              </button>
              <button 
                onClick={handleDownload}
                className="btn-primary" 
                style={{ flex: 1, backgroundColor: 'var(--color-input-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'none' }}
              >
                <DownloadIcon size={18} /> Download Statement
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Transaction History</h3>
            </div>
            
            <div>
              {transactions.length > 0 ? transactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.5rem',
                    borderBottom: index !== transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: getTransactionBg(tx.type),
                      color: getTransactionColor(tx.type),
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>{tx.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{tx.date}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 600, 
                    color: getTransactionColor(tx.type),
                    textAlign: 'right'
                  }}>
                    {tx.amount}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <p>No recent transactions for this account.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
