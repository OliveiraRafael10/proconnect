import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function ConfiguracoesPage() {
  const { usuario } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'pt-BR',
    notifications: {
      email: true,
      push: true,
      sms: false,
      proposals: true,
      ratings: true,
      payments: true,
      marketing: false
    },
    privacy: {
      showProfile: true,
      showContact: true,
      showLocation: true,
      showServices: true
    },
    preferences: {
      autoAccept: false,
      maxDistance: 50,
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      daysOfWeek: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Simular carregamento das configurações
      await new Promise(resolve => setTimeout(resolve, 500));
      // Aqui você carregaria as configurações do usuário da API
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você salvaria as configurações na API
      console.log('Configurações salvas:', settings);
      
      // Aplicar tema
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category, subCategory, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          [key]: value
        }
      }
    }));
  };

  const Toggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const Select = ({ value, onChange, options, label, description }) => (
    <div className="py-3">
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const Range = ({ value, onChange, min, max, step, label, description, unit }) => (
    <div className="py-3">
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-900">
          {label} {unit && `(${value}${unit})`}
        </p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configure sua experiência na plataforma</p>
      </div>

      <div className="space-y-8">
        {/* Aparência */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aparência</h2>
          
          <Select
            value={settings.theme}
            onChange={(value) => handleSettingChange('theme', 'theme', value)}
            label="Tema"
            description="Escolha entre tema claro ou escuro"
            options={[
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
              { value: 'auto', label: 'Automático' }
            ]}
          />
          
          <Select
            value={settings.language}
            onChange={(value) => handleSettingChange('language', 'language', value)}
            label="Idioma"
            description="Idioma da interface"
            options={[
              { value: 'pt-BR', label: 'Português (Brasil)' },
              { value: 'en-US', label: 'English (US)' },
              { value: 'es-ES', label: 'Español' }
            ]}
          />
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h2>
          
          <div className="space-y-1">
            <Toggle
              enabled={settings.notifications.email}
              onChange={(value) => handleSettingChange('notifications', 'email', value)}
              label="Notificações por Email"
              description="Receba atualizações importantes por email"
            />
            
            <Toggle
              enabled={settings.notifications.push}
              onChange={(value) => handleSettingChange('notifications', 'push', value)}
              label="Notificações Push"
              description="Receba notificações no navegador"
            />
            
            <Toggle
              enabled={settings.notifications.sms}
              onChange={(value) => handleSettingChange('notifications', 'sms', value)}
              label="Notificações por SMS"
              description="Receba notificações por mensagem de texto"
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-3">Tipos de Notificação</h3>
            
            <div className="space-y-1">
              <Toggle
                enabled={settings.notifications.proposals}
                onChange={(value) => handleSettingChange('notifications', 'proposals', value)}
                label="Novas Propostas"
                description="Notificar sobre novas propostas de serviço"
              />
              
              <Toggle
                enabled={settings.notifications.ratings}
                onChange={(value) => handleSettingChange('notifications', 'ratings', value)}
                label="Avaliações"
                description="Notificar sobre novas avaliações"
              />
              
              <Toggle
                enabled={settings.notifications.payments}
                onChange={(value) => handleSettingChange('notifications', 'payments', value)}
                label="Pagamentos"
                description="Notificar sobre status de pagamentos"
              />
              
              <Toggle
                enabled={settings.notifications.marketing}
                onChange={(value) => handleSettingChange('notifications', 'marketing', value)}
                label="Marketing"
                description="Receber ofertas e promoções"
              />
            </div>
          </div>
        </div>

        {/* Privacidade */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacidade</h2>
          
          <div className="space-y-1">
            <Toggle
              enabled={settings.privacy.showProfile}
              onChange={(value) => handleSettingChange('privacy', 'showProfile', value)}
              label="Mostrar Perfil Público"
              description="Permitir que outros usuários vejam seu perfil"
            />
            
            <Toggle
              enabled={settings.privacy.showContact}
              onChange={(value) => handleSettingChange('privacy', 'showContact', value)}
              label="Mostrar Informações de Contato"
              description="Exibir telefone e email no perfil"
            />
            
            <Toggle
              enabled={settings.privacy.showLocation}
              onChange={(value) => handleSettingChange('privacy', 'showLocation', value)}
              label="Mostrar Localização"
              description="Exibir sua cidade e região"
            />
            
            <Toggle
              enabled={settings.privacy.showServices}
              onChange={(value) => handleSettingChange('privacy', 'showServices', value)}
              label="Mostrar Serviços"
              description="Exibir seus serviços no perfil público"
            />
          </div>
        </div>

        {/* Preferências de Trabalho */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Trabalho</h2>
          
          <Toggle
            enabled={settings.preferences.autoAccept}
            onChange={(value) => handleSettingChange('preferences', 'autoAccept', value)}
            label="Aceitar Propostas Automaticamente"
            description="Aceitar automaticamente propostas que atendem seus critérios"
          />
          
          <Range
            value={settings.preferences.maxDistance}
            onChange={(value) => handleSettingChange('preferences', 'maxDistance', value)}
            min={5}
            max={100}
            step={5}
            label="Distância Máxima"
            description="Raio máximo para aceitar serviços"
            unit="km"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={settings.preferences.workingHours.start}
              onChange={(value) => handleNestedSettingChange('preferences', 'workingHours', 'start', value)}
              label="Horário de Início"
              options={Array.from({ length: 24 }, (_, i) => ({
                value: `${i.toString().padStart(2, '0')}:00`,
                label: `${i.toString().padStart(2, '0')}:00`
              }))}
            />
            
            <Select
              value={settings.preferences.workingHours.end}
              onChange={(value) => handleNestedSettingChange('preferences', 'workingHours', 'end', value)}
              label="Horário de Fim"
              options={Array.from({ length: 24 }, (_, i) => ({
                value: `${i.toString().padStart(2, '0')}:00`,
                label: `${i.toString().padStart(2, '0')}:00`
              }))}
            />
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 mb-3">Dias da Semana</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(settings.preferences.daysOfWeek).map(([day, enabled]) => (
                <Toggle
                  key={day}
                  enabled={enabled}
                  onChange={(value) => handleNestedSettingChange('preferences', 'daysOfWeek', day, value)}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracoesPage;