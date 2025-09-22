// Projeto: Lance Fácil - Desenvolvido por: Jefter Ruthes (https://ruthes.dev)

import { Outlet } from "react-router-dom";
import MobileMenu from "../components/MobileMenu";
import NotificationCenter from "../components/notifications/NotificationCenter";

function MobileDashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu Mobile */}
      <MobileMenu />

      {/* Header Mobile */}
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">LanceFácil</h1>
          <NotificationCenter />
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:hidden px-4 py-4 overflow-y-auto min-h-screen">
        <Outlet />
      </main>

      {/* Layout Desktop (mantido original) */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar Desktop */}
        <aside className="w-74 h-screen bg-[#2174a7] text-white flex flex-col p-6 shadow-[6px_0_12px_rgba(0,0,0,0.4)]">
          {/* Conteúdo da sidebar será movido para o componente original */}
        </aside>

        {/* Main Content Desktop */}
        <main className="flex-1 px-8 overflow-y-auto max-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MobileDashboardLayout;
