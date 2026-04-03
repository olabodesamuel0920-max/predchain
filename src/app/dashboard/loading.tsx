export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-primary relative overflow-hidden">
      <header className="relative z-10 pt-80 border-b border-white/5 bg-primary/60 backdrop-blur-2xl">
        <div className="container py-24">
          <div className="flex items-center justify-between gap-24 flex-wrap">
            <div className="flex items-center gap-16">
              <div className="w-48 h-48 rounded-xl skeleton shadow-lg" />
              <div>
                <div className="skeleton h-8 w-60 mb-8" />
                <div className="skeleton h-16 w-120" />
              </div>
            </div>
            <div className="w-200 h-60 skeleton rounded-xl" />
          </div>
          <div className="flex gap-8 mt-24">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="w-80 h-32 skeleton rounded-lg" />
             ))}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 py-32">
        <div className="container">
           <div className="grid grid-sidebar-alt">
              <div className="flex flex-col gap-24">
                 <div className="grid grid-2 gap-16">
                    <div className="card h-160 skeleton" />
                    <div className="card h-160 skeleton" />
                 </div>
                 <div className="card h-300 skeleton" />
              </div>
              <div className="flex flex-col gap-24">
                 <div className="card h-200 skeleton" />
                 <div className="card h-120 skeleton" />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
