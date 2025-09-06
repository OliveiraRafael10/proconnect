import { useState, useCallback, useMemo } from "react";
import perfil_sem_foto from "../../assets/perfil_sem_foto.png";
import { useAuth } from "../../context/AuthContext";
import { useValidation } from "../../hooks/useValidation";
import { useLoading } from "../../hooks/useLoading";
import { useNotification } from "../../context/NotificationContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function PerfilPage() {
  const { usuario, setUsuario } = useAuth();
  const { success, error: showError } = useNotification();
  const { withLoading, isLoading } = useLoading();
  
  // Estado inicial do formulário
  const initialForm = useMemo(() => ({
    nome: usuario?.nome || "",
    apelido: usuario?.apelido || "",
    email: usuario?.email || "",
    telefone: {
      ddd: usuario?.telefone?.ddd || "",
      numero: usuario?.telefone?.numero || ""
    },
    endereco: {
      cep: usuario?.endereco?.cep || "",
      logradouro: usuario?.endereco?.logradouro || "",
      bairro: usuario?.endereco?.bairro || "",
      cidade: usuario?.endereco?.cidade || "",
      estado: usuario?.endereco?.estado || "",
      complemento: usuario?.endereco?.complemento || ""
    },
    foto_url: usuario?.foto_url || ""
  }), [usuario]);

  const [form, setForm] = useState(initialForm);
  const [cep, setCep] = useState(form.endereco?.cep || "");

  // Função para formatar telefone
  const formatPhone = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }, []);

  // Função para formatar CEP
  const formatCEP = useCallback((value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === "ddd") {
      const dddValue = value.replace(/\D/g, '').slice(0, 2);
      setForm((prev) => ({
        ...prev,
        telefone: {
          ...prev.telefone,
          ddd: dddValue,
        },
      }));
    } else if (name === "numero") {
      const formattedPhone = formatPhone(value);
      setForm((prev) => ({
        ...prev,
        telefone: {
          ...prev.telefone,
          numero: formattedPhone,
        },
      }));
    } else if (["logradouro", "bairro", "cidade", "estado", "complemento"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, [formatPhone]);

  const handleSalvar = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      // Validações básicas
      if (!form.nome.trim()) {
        showError("Nome é obrigatório");
        return;
      }
      
      if (!form.email.trim()) {
        showError("Email é obrigatório");
        return;
      }
      
      // Simular salvamento (aqui você faria a chamada para a API)
      await withLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const dadosAtualizados = { 
          ...form, 
          endereco: { ...form.endereco, cep } 
        };
        
        setUsuario(dadosAtualizados);
        success("Dados atualizados com sucesso!");
      }, 'save');
      
    } catch (error) {
      showError("Erro ao salvar dados. Tente novamente.");
      console.error("Erro ao salvar:", error);
    }
  }, [form, cep, setUsuario, success, showError, withLoading]);

  const buscarEnderecoPorCep = useCallback(async (valorCep) => {
    if (!valorCep || valorCep.length !== 8) return;
    
    try {
      await withLoading(async () => {
        const response = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.erro) {
          showError("CEP não encontrado");
          setForm((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: "",
              bairro: "",
              cidade: "",
              estado: "",
            },
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            },
          }));
          success("Endereço encontrado!");
        }
      }, 'cep');
      
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showError("Erro de conexão. Verifique sua internet.");
      } else if (error.message.includes('HTTP')) {
        showError("Serviço temporariamente indisponível.");
      } else {
        showError("Erro ao buscar CEP. Tente novamente.");
      }
    }
  }, [withLoading, showError, success]);

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Foto do perfil */}
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Foto do Perfil</h3>
        <div className="relative inline-block">
          <img
            src={form.foto_url || perfil_sem_foto}
            alt="Foto do usuário"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
          />
          {isLoading('photo') && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <LoadingSpinner size="md" color="white" />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          id="fotoInput"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Validar tamanho do arquivo (máximo 5MB)
              if (file.size > 5 * 1024 * 1024) {
                showError("Arquivo muito grande. Máximo 5MB.");
                return;
              }
              
              // Validar tipo do arquivo
              if (!file.type.startsWith('image/')) {
                showError("Apenas arquivos de imagem são permitidos.");
                return;
              }
              
              const reader = new FileReader();
              reader.onloadend = () => {
                setForm((prev) => ({
                  ...prev,
                  foto_url: reader.result,
                }));
                success("Foto atualizada com sucesso!");
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          as="label"
          htmlFor="fotoInput"
          className="cursor-pointer"
        >
          Escolher Foto
        </Button>
      </div>

      {/* Dados principais */}
      <div className="col-span-2 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 text-gray-800">Informações do Usuário</h3>

        <form
          onSubmit={handleSalvar}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nome, apelido, email */}
          <Input
            label="Nome completo"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder="Digite seu nome completo"
          />

          <Input
            label="Apelido"
            name="apelido"
            value={form.apelido}
            onChange={handleChange}
            placeholder="Como gostaria de ser chamado"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
          />

          {/* Telefone */}
          <div className="flex gap-4">
            <div className="w-20">
              <Input
                label="DDD"
                name="ddd"
                value={form.telefone?.ddd || ""}
                onChange={handleChange}
                placeholder="11"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Telefone"
                name="numero"
                value={form.telefone?.numero || ""}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* CEP */}
          <div>
            <Input
              label="CEP"
              name="cep"
              value={cep}
              onChange={(e) => {
                let valor = e.target.value.replace(/\D/g, "");
                if (valor.length > 8) valor = valor.slice(0, 8);

                const formatado = formatCEP(valor);
                setCep(formatado);

                if (valor.length === 8) {
                  buscarEnderecoPorCep(valor);
                }
              }}
              placeholder="00000-000"
              loading={isLoading('cep')}
            />
          </div>

          {/* Endereço */}
          <Input
            label="Logradouro"
            name="logradouro"
            value={form.endereco?.logradouro || ""}
            onChange={handleChange}
            placeholder="Rua, Avenida, etc."
          />

          <Input
            label="Bairro"
            name="bairro"
            value={form.endereco?.bairro || ""}
            onChange={handleChange}
            placeholder="Nome do bairro"
          />

          <Input
            label="Cidade"
            name="cidade"
            value={form.endereco?.cidade || ""}
            onChange={handleChange}
            placeholder="Nome da cidade"
          />

          <Input
            label="Estado"
            name="estado"
            value={form.endereco?.estado || ""}
            onChange={handleChange}
            placeholder="UF"
            maxLength={2}
          />

          <div className="col-span-2">
            <Input
              label="Complemento"
              name="complemento"
              value={form.endereco?.complemento || ""}
              onChange={handleChange}
              placeholder="Apartamento, bloco, ponto de referência..."
            />
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm(initialForm)}
              disabled={isLoading('save')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading('save')}
              disabled={isLoading('save')}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
