// app/Dashboard/layout.js   (create this file if it doesn't exist)
import './page.scss'; // make sure the orb styles are loaded

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      {/* These orbs will ONLY mount once when you enter /Dashboard route */}
      <div className="hero-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>
      {children}
    </div>
  );
}