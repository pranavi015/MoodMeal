import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;