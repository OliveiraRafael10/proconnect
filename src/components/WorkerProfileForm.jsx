// Componente do formulário de perfil de trabalhador
import { useState, useCallback, useMemo } from 'react';
import { FiCalendar, FiMapPin, FiAward, FiClock } from 'react-icons/fi';
import Input from './ui/Input';
import Button from './ui/Button';
import CategorySelect from './ui/CategorySelect';
import PortfolioUpload from './ui/PortfolioUpload';
import { useNotification } from '../context/NotificationContext';
import { useLoading } from '../hooks/useLoading';
import { obterOpcoesCategoria } from '../data/mockCategorias';

const WorkerProfileForm = ({ 
  initialData = {}, 
  onSave, 
  onCancel,
  isEditing = false 
}) => {
  const { success, error: showError } = useNotification();
  const { withLoading, isLoading } = useLoading();

  // Estado do formulário
  const [form, setForm] = useState({
    categorias: initialData.categorias || [],
    descricao: initialData.descricao || '',
    experiencia: initialData.experiencia || '',
    raioAtendimento: initialData.raioAtendimento || '',
    portfolio: initialData.portfolio || [],
    certificacoes: initialData.certificacoes || [],
    disponibilidade: initialData.disponibilidade || {
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false
    }
  });

  // Opções de categorias - usando dados centralizados
  const categoriasOptions = useMemo(() => obterOpcoesCategoria(), []);

  // Dias da semana
  const diasSemana = useMemo(() => [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ], []);

  const handleChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDisponibilidadeChange = useCallback((dia, checked) => {
    setForm(prev => ({
      ...prev,
      disponibilidade: {
        ...prev.disponibilidade,
        [dia]: checked
      }
    }));
  }, []);

  const handleCertificacaoAdd = useCallback(() => {
    setForm(prev => ({
      ...prev,
      certificacoes: [...prev.certificacoes, { nome: '', instituicao: '', ano: '' }]
    }));
  }, []);

  const handleCertificacaoChange = useCallback((index, field, value) => {
    setForm(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  }, []);

  const handleCertificacaoRemove = useCallback((index) => {
    setForm(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.filter((_, i) => i !== index)
    }));
  }, []);

  // Validação do formulário
  const validateForm = useCallback(() => {
    const errors = [];

    if (form.categorias.length === 0) {
      errors.push('Selecione pelo menos uma categoria de serviço');
    }

    if (!form.descricao.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (!form.experiencia.trim()) {
      errors.push('Experiência é obrigatória');
    }

    if (!form.raioAtendimento.trim()) {
      errors.push('Raio de atendimento é obrigatório');
    }

    const diasSelecionados = Object.values(form.disponibilidade).filter(Boolean).length;
    if (diasSelecionados === 0) {
      errors.push('Selecione pelo menos um dia de disponibilidade');
    }

    return errors;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showError(errors.join('. '));
      return;
    }

    try {
      await withLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API
        onSave(form);
        success(isEditing ? 'Perfil atualizado com sucesso!' : 'Perfil de trabalhador criado com sucesso!');
      }, 'save');
    } catch (error) {
      showError('Erro ao salvar perfil. Tente novamente.');
      console.error('Erro ao salvar:', error);
    }
  }, [form, validateForm, onSave, success, showError, withLoading, isEditing]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Categorias de Serviços */}
      <div>
        <CategorySelect
          label="Categorias de Serviços"
          value={form.categorias}
          onChange={(value) => handleChange('categorias', value)}
          options={categoriasOptions}
          placeholder="Selecione suas áreas de atuação..."
          maxSelections={5}
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição dos Serviços *
        </label>
        <textarea
          value={form.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Descreva os serviços que você oferece, suas especialidades e como pode ajudar os clientes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19506e] focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>

      {/* Experiência */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experiência Profissional *
        </label>
        <textarea
          value={form.experiencia}
          onChange={(e) => handleChange('experiencia', e.target.value)}
          placeholder="Conte sobre sua experiência, anos de atuação, projetos realizados, etc..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19506e] focus:border-transparent resize-none"
          rows={3}
          required
        />
      </div>

      {/* Raio de Atendimento 
      <Input
        label="Raio de Atendimento (km)"
        name="raioAtendimento"
        type="number"
        value={form.raioAtendimento}
        onChange={(e) => handleChange('raioAtendimento', e.target.value)}
        placeholder="10"
        required
      />
      */}

      {/* Disponibilidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dias de Disponibilidade *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {diasSemana.map((dia) => (
            <label key={dia.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.disponibilidade[dia.key]}
                onChange={(e) => updateDisponibilidade(dia.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{dia.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Certificações
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Certificações e Qualificações
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCertificacaoAdd}
          >
            <FiAward className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>
        
        {form.certificacoes.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Nenhuma certificação adicionada. Clique em "Adicionar" para incluir suas qualificações.
          </p>
        ) : (
          <div className="space-y-3">
            {form.certificacoes.map((cert, index) => (
              <div key={`cert-${index}-${cert.nome}`} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    label="Nome da Certificação"
                    value={cert.nome}
                    onChange={(e) => handleCertificacaoChange(index, 'nome', e.target.value)}
                    placeholder="Ex: Curso de Eletricista"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Instituição"
                    value={cert.instituicao}
                    onChange={(e) => handleCertificacaoChange(index, 'instituicao', e.target.value)}
                    placeholder="Ex: SENAI"
                  />
                </div>
                <div className="w-24">
                  <Input
                    label="Ano"
                    value={cert.ano}
                    onChange={(e) => handleCertificacaoChange(index, 'ano', e.target.value)}
                    placeholder="2023"
                    maxLength={4}
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleCertificacaoRemove(index)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>*/}

      {/* Portfólio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Portfólio de Trabalhos
        </label>
        <PortfolioUpload
          value={form.portfolio}
          onChange={(value) => handleChange('portfolio', value)}
          maxFiles={16}
          maxSizeMB={5}
          className="border border-gray-200 rounded-lg p-4"
        />
        <p className="text-xs text-gray-500 mt-2">
          Adicione fotos dos seus trabalhos para mostrar sua qualidade e experiência aos clientes.
        </p>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading('save')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isLoading('save')}
          disabled={isLoading('save')}
        >
          {isEditing ? 'Atualizar Perfil' : 'Criar Perfil de Trabalhador'}
        </Button>
      </div>
    </form>
  );
};

export default WorkerProfileForm;