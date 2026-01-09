import React, { useState } from 'react';
import { ChevronLeftIcon, RandSignIcon, PlusIcon, DownloadIcon, TransferIcon, XIcon, CheckCircleIcon } from './CustomIcons';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const TransactionHistoryPage = ({ onBack, transactions, userName, accountNumber }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Helper Functions ---
    const formatCurrency = (val) => 
      val.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });

    // --- Calculations ---
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^0-9.]/g, '')), 0);
    
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^0-9.]/g, '')), 0);

    const now = new Date();
    const printDate = now.toLocaleDateString('en-ZA');
    const toDate = now.toLocaleDateString('en-ZA');
    // Assume 30 day period for this statement view
    const fromDateObj = new Date();
    fromDateObj.setDate(fromDateObj.getDate() - 30);
    const fromDate = fromDateObj.toLocaleDateString('en-ZA');

    // --- Header Section ---
    doc.setFillColor(43, 41, 56); // Dark bg for header
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("OpenBank", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Statement of Account", 14, 28);

    doc.setFontSize(10);
    doc.text("OpenBank Ltd", pageWidth - 14, 15, { align: 'right' });
    doc.text("Reg No. 2024/000123/06", pageWidth - 14, 20, { align: 'right' });
    doc.text("Sandton, Johannesburg", pageWidth - 14, 25, { align: 'right' });

    // --- Customer & Statement Details ---
    const startY = 50;
    doc.setTextColor(0, 0, 0);
    
    // Left Column: Customer Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNT HOLDER", 14, startY);
    doc.setFont("helvetica", "normal");
    doc.text(userName, 14, startY + 6);
    doc.text("42 Sandton Drive", 14, startY + 11); // Mock Address
    doc.text("Sandton, Johannesburg", 14, startY + 16);
    doc.text("2196", 14, startY + 21);

    // Right Column: Statement Details
    doc.setFont("helvetica", "bold");
    doc.text("STATEMENT DETAILS", pageWidth - 80, startY);
    
    doc.setFont("helvetica", "normal");
    doc.text("Account Number:", pageWidth - 80, startY + 6);
    doc.text(accountNumber, pageWidth - 14, startY + 6, { align: 'right' });
    
    doc.text("Statement Period:", pageWidth - 80, startY + 12);
    doc.text(`${fromDate} - ${toDate}`, pageWidth - 14, startY + 12, { align: 'right' });
    
    doc.text("Print Date:", pageWidth - 80, startY + 18);
    doc.text(printDate, pageWidth - 14, startY + 18, { align: 'right' });

    // --- Summary Section ---
    const summaryY = startY + 35;
    
    // Draw Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.rect(14, summaryY, pageWidth - 28, 25, 'FD');

    // Money Out Summary
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("TOTAL MONEY OUT", 20, summaryY + 8);
    doc.setFontSize(14);
    doc.setTextColor(239, 68, 68); // Red
    doc.setFont("helvetica", "bold");
    doc.text(`- ${formatCurrency(totalWithdrawals)}`, 20, summaryY + 18);

    // Money In Summary (Optional but good for balance)
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("TOTAL MONEY IN", pageWidth / 2, summaryY + 8);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // Green
    doc.setFont("helvetica", "bold");
    doc.text(`+ ${formatCurrency(totalDeposits)}`, pageWidth / 2, summaryY + 18);


    // --- Transaction Table ---
    const tableColumn = ["Date", "Description", "Type", "Amount"];
    const tableRows = transactions.map(tx => [
      tx.date,
      tx.title,
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      tx.amount
    ]);

    // Handle autoTable import variation for CDN ESM
    // @ts-ignore
    const generateTable = autoTable.default || autoTable;

    if (typeof generateTable === 'function') {
      generateTable(doc, {
        startY: summaryY + 35,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [43, 41, 56], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 40 }, // Date
          1: { cellWidth: 'auto' }, // Description
          2: { cellWidth: 30 }, // Type
          3: { cellWidth: 35, halign: 'right' } // Amount
        }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      // Save
      doc.save("OpenBank_Statement.pdf");
    } else {
      console.error("Failed to load autoTable plugin", autoTable);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'withdrawal': return '#ef4444';
      case 'deposit': return '#10b981';
      case 'transfer': return '#3e82f7'; // Blue for transfers
      default: return '#ffffff';
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
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <div className="dashboard-layout" style={{ position: 'relative' }}>
      
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setSelectedTransaction(null)}>
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Transaction Details</h3>
              <button 
                onClick={() => setSelectedTransaction(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <XIcon size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Icon & Amount */}
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: getTransactionBg(selectedTransaction.type),
                color: getTransactionColor(selectedTransaction.type),
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {getTransactionIcon(selectedTransaction.type)}
              </div>

              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 700, 
                color: getTransactionColor(selectedTransaction.type),
                marginBottom: '0.5rem'
              }}>
                {selectedTransaction.amount}
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.375rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '2rem'
              }}>
                <CheckCircleIcon size={12} /> Successful
              </div>

              {/* Details List */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Transaction Type</span>
                  <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{selectedTransaction.type}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Date</span>
                  <span style={{ fontWeight: 500 }}>{selectedTransaction.date.split(',')[0]}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Time</span>
                  <span style={{ fontWeight: 500 }}>{selectedTransaction.date.split(',')[1]}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Reference</span>
                  <span style={{ fontWeight: 500, maxWidth: '200px', textAlign: 'right' }}>{selectedTransaction.title}</span>
                </div>

                {selectedTransaction.type === 'transfer' ? (
                  <>
                     <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>From Account</span>
                      <span style={{ fontWeight: 500 }}>{selectedTransaction.fromAccount || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>To Account</span>
                      <span style={{ fontWeight: 500 }}>{selectedTransaction.toAccount || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Account</span>
                    <span style={{ fontWeight: 500 }}>{selectedTransaction.account || 'Checking'}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Transaction ID</span>
                  <span style={{ fontWeight: 500, fontFamily: 'monospace', opacity: 0.8 }}>#{selectedTransaction.id}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content" style={{ justifyContent: 'flex-start' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontSize: '1rem', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ChevronLeftIcon size={20} />
            Transaction History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
               <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Recent Transactions</h2>
               
               <button 
                 onClick={handleDownload}
                 style={{
                   background: 'rgba(255, 255, 255, 0.05)',
                   border: '1px solid var(--color-border)',
                   borderRadius: '0.5rem',
                   padding: '0.5rem 1rem',
                   color: 'white',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '0.5rem',
                   cursor: 'pointer',
                   fontSize: '0.875rem',
                   transition: 'all 0.2s'
                 }}
                 onMouseOver={(e) => {
                   e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                 }}
                 onMouseOut={(e) => {
                   e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                 }}
               >
                 <DownloadIcon size={16} />
                 Download Statement
               </button>
            </div>

            <div>
              {transactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTransaction(tx)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.5rem',
                    borderBottom: index !== transactions.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                     e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                  onMouseOut={(e) => {
                     e.currentTarget.style.backgroundColor = 'transparent';
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
                      <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{tx.title}</div>
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
              ))}
              {transactions.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                  No transactions yet.
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
