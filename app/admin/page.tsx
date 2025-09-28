expoexport default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Usuarios Registrados</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Suscripciones Activas</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Ingresos Mensuales</h3>
          <p className="text-3xl font-bold mt-2">$0</p>
        </div>
      </div>
    </div>
  );
}