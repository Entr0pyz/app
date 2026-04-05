import { HashRouter, Routes, Route } from 'react-router-dom';
import TopAppBar from './components/layout/TopAppBar';
import BottomNavBar from './components/layout/BottomNavBar';
import Home from './pages/Home';
import Workout from './pages/Workout';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <TopAppBar />
        <div className="page-content">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/workout"  element={<Workout />} />
            <Route path="/history"  element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <BottomNavBar />
      </div>
    </HashRouter>
  );
}
