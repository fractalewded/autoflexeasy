'use client';

export default function RobotDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Control del Robot</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Estado del Robot</h2>
          <p>Estado: <span className="text-green-600">Activo</span></p>
          <p>Batería: 85%</p>
          <p>Conectado: Sí</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Controles</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Iniciar
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
            Pausar
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Detener
          </button>
        </div>
      </div>
    </div>
  );
}