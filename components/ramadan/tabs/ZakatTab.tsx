'use client';

import { useState } from 'react';

type ZakatForm = {
  currency: string;
  cash: string;
  gold: string;
  silver: string;
  business: string;
  receivable: string;
  debts: string;
};

type Props = { active: boolean };

export function ZakatTab({ active }: Props) {
  const [zakat, setZakat] = useState<ZakatForm>({
    currency: 'PKR',
    cash: '',
    gold: '',
    silver: '',
    business: '',
    receivable: '',
    debts: '',
  });
  const [zakatShow, setZakatShow] = useState(false);
  const [zakatAmount, setZakatAmount] = useState('—');
  const [zakatNote, setZakatNote] = useState('');

  const calcZakat = () => {
    const cash = parseFloat(zakat.cash) || 0;
    const gold = parseFloat(zakat.gold) || 0;
    const silver = parseFloat(zakat.silver) || 0;
    const biz = parseFloat(zakat.business) || 0;
    const recv = parseFloat(zakat.receivable) || 0;
    const debts = parseFloat(zakat.debts) || 0;
    const curr = zakat.currency;
    const total = cash + gold + silver + biz + recv - debts;
    const z = Math.max(0, total * 0.025);
    setZakatShow(true);
    setZakatAmount(`${curr} ${z.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setZakatNote(
      total <= 0 ? 'No Zakat due (net assets ≤ 0)' : `2.5% of net assets (${curr} ${total.toLocaleString()})`,
    );
  };

  return (
    <div className={'tab-section' + (active ? ' active' : '')} id="tab-zakat" role="tabpanel">
      <div className="section-title">💰 Zakat Calculator</div>
      <div className="main-grid">
        <div className="card">
          <div className="zakat-form">
            <div className="input-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={zakat.currency}
                onChange={(e) => setZakat((z) => ({ ...z, currency: e.target.value }))}
              >
                <option value="PKR">🇵🇰 PKR – Pakistani Rupee</option>
                <option value="USD">🇺🇸 USD – US Dollar</option>
                <option value="GBP">🇬🇧 GBP – British Pound</option>
                <option value="EUR">🇪🇺 EUR – Euro</option>
                <option value="SAR">🇸🇦 SAR – Saudi Riyal</option>
                <option value="AED">🇦🇪 AED – UAE Dirham</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="cash">Cash & Bank Savings</label>
              <input
                id="cash"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.cash}
                onChange={(e) => setZakat((z) => ({ ...z, cash: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="gold">Gold Value (in currency)</label>
              <input
                id="gold"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.gold}
                onChange={(e) => setZakat((z) => ({ ...z, gold: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="silver">Silver Value (in currency)</label>
              <input
                id="silver"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.silver}
                onChange={(e) => setZakat((z) => ({ ...z, silver: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="business">Business / Investment Assets</label>
              <input
                id="business"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.business}
                onChange={(e) => setZakat((z) => ({ ...z, business: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="receivable">Money Owed To You</label>
              <input
                id="receivable"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.receivable}
                onChange={(e) => setZakat((z) => ({ ...z, receivable: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label htmlFor="debts">Deductible Debts</label>
              <input
                id="debts"
                type="number"
                placeholder="0"
                min={0}
                value={zakat.debts}
                onChange={(e) => setZakat((z) => ({ ...z, debts: e.target.value }))}
              />
            </div>
            <button type="button" className="calc-btn" onClick={calcZakat}>
              Calculate My Zakat
            </button>
          </div>
        </div>
        <div className="card">
          <div style={{ marginBottom: 18 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>
              📌 Nisab Threshold (2025)
            </div>
            <div className="info-box">
              <strong style={{ color: 'var(--gold2)' }}>Gold Nisab:</strong> Value of 87.48g of gold
              <br />
              <strong style={{ color: 'var(--gold2)' }}>Silver Nisab:</strong> Value of 612.36g of silver
              <br />
              <br />
              Zakat is obligatory if your net zakatable assets held for one lunar year exceed the Nisab threshold.
            </div>
          </div>
          <div className={'zakat-result' + (zakatShow ? ' show' : '')} id="zakatResult">
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.1em' }}>
              ZAKAT DUE (2.5%)
            </div>
            <div className="zakat-amount" id="zakatAmount">
              {zakatAmount}
            </div>
            <div className="zakat-note" id="zakatNote">
              {zakatNote}
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="section-title" style={{ marginBottom: 10 }}>
              🌍 Suggested Recipients
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 10, fontSize: '0.88rem', color: 'var(--silver)' }}>
                🏠 Local Islamic charity / mosque
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 10, fontSize: '0.88rem', color: 'var(--silver)' }}>
                🌱 Edhi Foundation / Akhuwat
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 10, fontSize: '0.88rem', color: 'var(--silver)' }}>
                📚 Islamic Relief / Human Appeal
              </div>
              <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 10, fontSize: '0.88rem', color: 'var(--silver)' }}>
                👨‍👩‍👧 Needy families in your community
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
