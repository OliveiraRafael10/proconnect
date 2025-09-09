import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d', '1y'
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simular dados de analytics
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        overview: {
          totalServices: Math.floor(Math.random() * 100) + 50,
          completedServices: Math.floor(Math.random() * 80) + 30,
          pendingServices: Math.floor(Math.random() * 20) + 5,
          totalEarnings: Math.floor(Math.random() * 10000) + 5000,
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          responseTime: Math.floor(Math.random() * 24) + 1
        },
        performance: {
          servicesByMonth: [
            { month: 'Jan', count: 12, earnings: 2400 },
            { month: 'Fev', count: 18, earnings: 3600 },
            { month: 'Mar', count: 15, earnings: 3000 },
            { month: 'Abr', count: 22, earnings: 4400 },
            { month: 'Mai', count: 28, earnings: 5600 },
            { month: 'Jun', count: 25, earnings: 5000 }
          ],
          topServices: [
            { name: 'Limpeza Residencial', count: 45, earnings: 9000 },
            { name: 'Manutenção Elétrica', count: 32, earnings: 12800 },
            { name: 'Pintura', count: 28, earnings: 8400 },
            { name: 'Encanamento', count: 24, earnings: 7200 },
            { name: 'Jardinagem', count: 18, earnings: 3600 }
          ],
          ratings: [
            { rating: 5, count: 85 },
            { rating: 4, count: 12 },
            { rating: 3, count: 2 },
            { rating: 2, count: 1 },
            { rating: 1, count: 0 }
          ]
        },
        insights: {
          bestDay: 'Segunda-feira',
          bestTime: '14:00 - 16:00',
          peakSeason: 'Março - Maio',
          clientRetention: 78,
          referralRate: 35
        }
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartBar = ({ label, value, max, color = 'blue' }) => (
    <div className="flex items-center space-x-3">
      <div className="w-20 text-sm text-gray-600">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
      <div className="w-16 text-sm font-medium text-gray-900">{value}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Erro ao carregar dados de analytics</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Acompanhe seu desempenho e insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Serviços"
          value={analytics.overview.totalServices}
          subtitle="Este período"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          }
          color="blue"
        />
        
        <StatCard
          title="Serviços Concluídos"
          value={analytics.overview.completedServices}
          subtitle={`${Math.round((analytics.overview.completedServices / analytics.overview.totalServices) * 100)}% do total`}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          color="green"
        />
        
        <StatCard
          title="Faturamento Total"
          value={`R$ ${analytics.overview.totalEarnings.toLocaleString('pt-BR')}`}
          subtitle="Este período"
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="yellow"
        />
        
        <StatCard
          title="Avaliação Média"
          value={analytics.overview.averageRating}
          subtitle="de 5 estrelas"
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Mais Procurados</h3>
          <div className="space-y-4">
            {analytics.performance.topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.count} serviços</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">R$ {service.earnings.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Avaliações</h3>
          <div className="space-y-3">
            {analytics.performance.ratings.map((rating) => (
              <ChartBar
                key={rating.rating}
                label={`${rating.rating} estrelas`}
                value={rating.count}
                max={Math.max(...analytics.performance.ratings.map(r => r.count))}
                color="yellow"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights e Recomendações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Melhor Dia</h4>
            <p className="text-2xl font-bold text-green-600">{analytics.insights.bestDay}</p>
            <p className="text-sm text-gray-500">Maior demanda</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Melhor Horário</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.insights.bestTime}</p>
            <p className="text-sm text-gray-500">Pico de atividade</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Retenção</h4>
            <p className="text-2xl font-bold text-purple-600">{analytics.insights.clientRetention}%</p>
            <p className="text-sm text-gray-500">Clientes retornam</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
