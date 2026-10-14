
import { useState } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  TrendingUp,
  CircleAlert,
  CheckCircle2,
  Clock3,
  Plus,
  Download,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import './App.css';

const revenueData = [
  { day: 'Mon', revenue: 185000 },
  { day: 'Tue', revenue: 240000 },
  { day: 'Wed', revenue: 210000 },
  { day: 'Thu', revenue: 320000 },
  { day: 'Fri', revenue: 275000 },
  { day: 'Sat', revenue: 410000 },
  { day: 'Sun', revenue: 350000 },
];

const initialTransactions = [
  { id: 'TXN-1001', customer: 'Customer A', type: 'Transfer', amount: 45000, status: 'Successful', time: '09:42 AM' },
  { id: 'TXN-1002', customer: 'Customer B', type: 'Withdrawal', amount: 20000, status: 'Successful', time: '10:15 AM' },
  { id: 'TXN-1003', customer: 'Customer C', type: 'Deposit', amount: 85000, status: 'Pending', time: '10:38 AM' },
  { id: 'TXN-1004', customer: 'Customer D', type: 'Transfer', amount: 12000, status: 'Failed', time: '11:02 AM' },
  { id: 'TXN-1005', customer: 'Customer E', type: 'Withdrawal', amount: 30000, status: 'Successful', time: '11:24 AM' },
];

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Analytics', icon: ChartNoAxesCombined },
  { label: 'Alerts', icon: Bell },
];

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Transfer');

  const successful = transactions.filter((t) => t.status === 'Successful');
  const totalRevenue = successful.reduce((sum, t) => sum + t.amount, 0);
  const successRate = transactions.length
    ? (successful.length / transactions.length) * 100
    : 0;

  const filteredTransactions = transactions.filter((t) =>
    `${t.id} ${t.customer} ${t.type} ${t.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addTransaction(event) {
    event.preventDefault();

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;

    const transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      customer: 'Demo Customer',
      type,
      amount: value,
      status: 'Successful',
      time: new Date().toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTransactions((current) => [transaction, ...current]);
    setAmount('');
    setShowForm(false);
    setActivePage('Transactions');
  }

  function exportTransactions() {
    const header = 'Transaction ID,Customer,Type,Amount,Status,Time';
    const rows = transactions.map((t) =>
      [t.id, t.customer, t.type, t.amount, t.status, t.time].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartpos-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">Z</div>
          <div>
            <h2>SmartPOS<span> AI</span></h2>
            <p>BUSINESS INTELLIGENCE</p>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? 'active' : ''}`}
              onClick={() => {
                setActivePage(label);
                setSidebarOpen(false);
              }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Alerts' && (
                <span className="nav-count">2</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => setActivePage('Settings')}
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </button>

          <div className="sidebar-help">
            <div className="help-icon"><Sparkles size={18} /></div>
            <strong>Smart insights</strong>
            <p>Understand your business with data-driven insights.</p>
            <button onClick={() => setActivePage('Analytics')}>
              Explore analytics <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="profile">
            <div className="avatar">SA</div>
            <div className="profile-details">
              <strong>Sarah's POS</strong>
              <span>Demo workspace</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">Workspace <span>/</span> {activePage}</div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                aria-label="Search transactions"
                placeholder="Search transactions..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActivePage('Transactions');
                }}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              className="notification-button"
              aria-label="View alerts"
              onClick={() => setActivePage('Alerts')}
            >
              <Bell size={19} />
              <span />
            </button>
            <div className="topbar-avatar">SA</div>
          </div>
        </header>

        <div className="page-content">
          {activePage === 'Dashboard' && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span /> LIVE DEMO WORKSPACE</div>
                  <h1>Good afternoon, Sarah <span>✦</span></h1>
                  <p>Here's what's happening with your business today.</p>
                </div>
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <Plus size={18} /> New transaction
                </button>
              </section>

              <section className="stats-grid">
                <StatCard
                  label="Successful transaction value"
                  value={formatNaira(totalRevenue)}
                  icon={Wallet}
                  trend="Live demo data"
                  positive
                />
                <StatCard
                  label="Total transactions"
                  value={String(transactions.length)}
                  icon={CreditCard}
                  trend={`${successful.length} successful`}
                  positive
                />
                <StatCard
                  label="Success rate"
                  value={`${successRate.toFixed(1)}%`}
                  icon={TrendingUp}
                  trend="Based on demo records"
                  positive
                />
                <StatCard
                  label="Cash available"
                  value={formatNaira(180000)}
                  icon={Wallet}
                  trend="Illustrative balance"
                  positive
                />
              </section>

              <section className="dashboard-grid">
                <div className="panel revenue-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Revenue overview</h3>
                      <p>Illustrative weekly transaction values</p>
                    </div>
                    <button className="select-button">
                      This week <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="chart-summary">
                    <h2>₦1,990,000</h2>
                    <span className="trend-pill">
                      <ArrowUpRight size={15} /> Sample data
                    </span>
                  </div>

                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E31837" stopOpacity={0.16} />
                            <stop offset="95%" stopColor="#E31837" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#EEEEEE" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8B8B8B', fontSize: 12 }} dy={10} />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#8B8B8B', fontSize: 11 }}
                          tickFormatter={(value) => `₦${value / 1000}k`}
                        />
                        <Tooltip
                          formatter={(value) => [formatNaira(value), 'Value']}
                          contentStyle={{ borderRadius: 10, border: '1px solid #eee', fontSize: 12 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#E31837"
                          strokeWidth={2.5}
                          fill="url(#revenueFill)"
                          activeDot={{ r: 5, fill: '#E31837', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="panel insights-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="insights-title"><Sparkles size={17} /> <h3>Smart insights</h3></div>
                      <p>Business intelligence</p>
                    </div>
                    <span className="demo-badge">DEMO</span>
                  </div>

                  <div className="insight-card red-insight">
                    <div className="insight-icon"><TrendingUp size={18} /></div>
                    <div>
                      <strong>Revenue patterns</strong>
                      <p>Saturday has the highest sample transaction value this week.</p>
                    </div>
                  </div>

                  <div className="insight-card amber-insight">
                    <div className="insight-icon"><CircleAlert size={18} /></div>
                    <div>
                      <strong>Review unusual activity</strong>
                      <p>Large transactions should be reviewed against your normal patterns.</p>
                    </div>
                  </div>

                  <div className="insight-card green-insight">
                    <div className="insight-icon"><Wallet size={18} /></div>
                    <div>
                      <strong>Cash planning</strong>
                      <p>Monitor cash levels before your busiest business periods.</p>
                    </div>
                  </div>

                  <button className="text-link" onClick={() => setActivePage('Analytics')}>
                    View all analytics <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>

              <TransactionPanel
                transactions={transactions}
                onViewAll={() => setActivePage('Transactions')}
              />
            </>
          )}

          {activePage === 'Transactions' && (
            <section className="page-section">
              <section className="welcome-row">
                <div>
                  <h1>Transactions</h1>
                  <p>Review and manage your demo transaction records.</p>
                </div>
                <div className="action-group">
                  <button className="secondary-button" onClick={exportTransactions}>
                    <Download size={17} /> Export CSV
                  </button>
                  <button className="primary-button" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New transaction
                  </button>
                </div>
              </section>

              <div className="panel full-table-panel">
                <div className="panel-heading">
                  <div><h3>All transactions</h3><p>{filteredTransactions.length} records found</p></div>
                </div>
                <TransactionTable transactions={filteredTransactions} />
              </div>
            </section>
          )}

          {activePage === 'Analytics' && (
            <section className="page-section">
              <section className="welcome-row">
                <div>
                  <h1>Business analytics</h1>
                  <p>Understand transaction trends and business performance.</p>
                </div>
              </section>
              <section className="stats-grid">
                <StatCard label="Weekly sample value" value="₦1.99M" icon={Wallet} trend="Illustrative data" positive />
                <StatCard label="Busiest day" value="Saturday" icon={TrendingUp} trend="Based on sample chart" positive />
                <StatCard label="Records reviewed" value={String(transactions.length)} icon={CreditCard} trend="Current demo records" positive />
                <StatCard label="Successful records" value={String(successful.length)} icon={CheckCircle2} trend="Current demo records" positive />
              </section>
              <div className="panel revenue-panel analytics-chart">
                <div className="panel-heading"><div><h3>Weekly transaction value</h3><p>Sample data for demonstration</p></div></div>
                <div className="chart-container large-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                      <defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E31837" stopOpacity={0.18} /><stop offset="95%" stopColor="#E31837" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="#EEEEEE" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#777', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#777', fontSize: 12 }} tickFormatter={(value) => `₦${value / 1000}k`} />
                      <Tooltip formatter={(value) => [formatNaira(value), 'Value']} />
                      <Area type="monotone" dataKey="revenue" stroke="#E31837" strokeWidth={3} fill="url(#analyticsFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="panel note-panel"><Sparkles size={19} /><div><strong>About these insights</strong><p>Current charts and recommendations use illustrative demo data. We will connect verified transaction records before making live business predictions.</p></div></div>
            </section>
          )}

          {activePage === 'Alerts' && (
            <section className="page-section">
              <section className="welcome-row"><div><h1>Smart alerts</h1><p>Items to review and actions to consider.</p></div></section>
              <div className="alerts-list">
                <AlertItem icon={CircleAlert} tone="warning" title="Review unusually large transactions" description="Compare high-value transactions with the agent's usual activity before flagging them." tag="Review recommended" />
                <AlertItem icon={Wallet} tone="info" title="Monitor cash availability" description="Check available cash before expected busy periods to reduce the risk of running short." tag="Cash planning" />
                <AlertItem icon={CheckCircle2} tone="success" title="Demo dashboard is ready" description="You can add transactions and explore how the sample dashboard responds." tag="Information" />
              </div>
              <div className="panel note-panel"><CircleAlert size={19} /><div><strong>Prototype notice</strong><p>These are guidance messages, not live fraud detections. Real alerts require validated transaction data and tested detection rules.</p></div></div>
            </section>
          )}

          {activePage === 'Settings' && (
            <section className="page-section">
              <section className="welcome-row"><div><h1>Settings</h1><p>SmartPOS AI prototype preferences.</p></div></section>
              <div className="panel settings-panel">
                <div><strong>Workspace</strong><p>Sarah's POS · Demo workspace</p></div>
                <div><strong>Currency</strong><p>Nigerian Naira (NGN · ₦)</p></div>
                <div><strong>Branding</strong><p>Zenith-inspired colour theme; independent hackathon prototype.</p></div>
                <div><strong>Data mode</strong><p>Local browser session with illustrative sample records.</p></div>
              </div>
            </section>
          )}
        </div>

        <footer className="footer">
          <span>SmartPOS AI <span className="footer-dot">•</span> Hackathon prototype</span>
          <span>Independent concept — not an official Zenith Bank product</span>
        </footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <form className="transaction-modal" onSubmit={addTransaction}>
            <div className="modal-heading">
              <div><h2>New transaction</h2><p>Add an illustrative record to the demo.</p></div>
              <button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form"><X size={20} /></button>
            </div>
            <label htmlFor="transaction-type">Transaction type</label>
            <select id="transaction-type" value={type} onChange={(event) => setType(event.target.value)}>
              <option>Transfer</option><option>Withdrawal</option><option>Deposit</option>
            </select>
            <label htmlFor="transaction-amount">Amount (₦)</label>
            <input id="transaction-amount" type="number" min="1" step="1" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 25000" />
            <p className="modal-notice">This adds a simulated transaction only. No money will be moved.</p>
            <button className="primary-button modal-submit" type="submit">Add demo transaction <Plus size={17} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, positive }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon"><Icon size={19} /></div>
      </div>
      <h2>{value}</h2>
      <div className="stat-bottom">
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
      </div>
    </article>
  );
}

function TransactionPanel({ transactions, onViewAll }) {
  return (
    <section className="panel transaction-panel">
      <div className="panel-heading">
        <div><h3>Recent transactions</h3><p>Latest activity in your demo workspace</p></div>
        <button className="text-link" onClick={onViewAll}>View all <ArrowUpRight size={15} /></button>
      </div>
      <TransactionTable transactions={transactions.slice(0, 5)} />
    </section>
  );
}

function TransactionTable({ transactions }) {
  return (
    <div className="table-scroll">
      <table className="transaction-table">
        <thead><tr><th>Transaction ID</th><th>Customer</th><th>Type</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td><span className="transaction-id">{transaction.id}</span></td>
              <td><div className="customer-cell"><span className="customer-avatar">{transaction.customer.split(' ').at(-1)?.charAt(0) || 'C'}</span>{transaction.customer}</div></td>
              <td>{transaction.type}</td>
              <td className="amount-cell">{formatNaira(transaction.amount)}</td>
              <td><span className={`status-badge ${transaction.status.toLowerCase()}`}><span />{transaction.status}</span></td>
              <td className="time-cell"><Clock3 size={13} /> {transaction.time}</td>
            </tr>
          ))}
          {transactions.length === 0 && <tr><td colSpan="6" className="empty-state">No transactions found. Try another search or add a demo transaction.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AlertItem({ icon: Icon, tone, title, description, tag }) {
  return (
    <article className="panel alert-item">
      <div className={`alert-icon ${tone}`}><Icon size={20} /></div>
      <div className="alert-content"><h3>{title}</h3><p>{description}</p><span className={`alert-tag ${tone}`}>{tag}</span></div>
    </article>
  );
}

export default App;