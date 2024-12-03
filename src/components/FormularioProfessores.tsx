import React, { useEffect, useState } from "react";
import { Professor } from "@/types/Professor";
import { Modality } from "@/types/Modality";
import { getModalities } from "../services/modalityService";
import Textbox from "./Textbox";
import Datepicker from "./Datepicker";
import Dropdown from "./Dropdown";

interface Props {
  professorEdicao?: Professor | null; // Dados do professor sendo editado
  onSubmit: (professor: Professor) => Promise<void>; // Callback para salvar (edição ou criação)
  onCancelEdit: () => void; // Callback para cancelar edição
}

const FormularioProfessores: React.FC<Props> = ({ professorEdicao, onSubmit, onCancelEdit }) => {
  const [formData, setFormData] = useState<Professor>({
    id: -1,
    name: "",
    password: "",
    cpf: "",
    rg: "",
    birthday: "",
    phone: "",
    photo_url: "",
    email: "",
    about: "",
    modality: null,
  });

  const [modalities, setModalities] = useState<Modality[]>([]);

  useEffect(() => {
    if (professorEdicao) {
      setFormData(professorEdicao);
    }
  }, [professorEdicao]);

  useEffect(() => {
    const fetchModalities = async () => {
      const data = await getModalities();
      setModalities(data);
    };
    fetchModalities();
  }, []);

  const formatInputValue = (name: string, value: string): string => {
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 3) {
        return formattedValue;
      } else if (formattedValue.length <= 6) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3)}`;
      } else if (formattedValue.length <= 9) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6)}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6, 9)}-${formattedValue.slice(9, 11)}`;
      }
    } else if (name === "rg") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 2) {
        return formattedValue;
      } else if (formattedValue.length <= 5) {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2)}`;
      } else if (formattedValue.length <= 8) {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 5)}.${formattedValue.slice(5)}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 2)}.${formattedValue.slice(2, 5)}.${formattedValue.slice(5, 8)}-${formattedValue.slice(8, 9)}`;
      }
    } else if (name === "phone") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length <= 2) {
        formattedValue = `(${formattedValue}`;
      } else if (formattedValue.length <= 6) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2)}`;
      } else if (formattedValue.length <= 10) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7)}`;
      } else {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7, 11)}`;
      }
    }
    return formattedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatInputValue(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "modality" ? Number(value) : formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      id: -1,
      name: "",
      password: "",
      cpf: "",
      rg: "",
      birthday: "",
      phone: "",
      photo_url: "",
      email: "",
      about: "",
      modality: null,
    });
  };

  return (
    <>
      <h2 className="font-bold text-3xl mb-10 mt-20">{professorEdicao ? "Editar Professor" : "Cadastrar Professor"}</h2>
      <form onSubmit={handleSubmit} className="flex justify-between gap-x-20">

        <section className="w-2/4 gap-10">
          <Textbox value={formData.name} onChange={handleChange} name="name" label="Nome" iconPath="/icon/id.svg" placeholder="Insira o nome completo" type="text" />

          <Datepicker label="Data de nascimento" name="birthday" value={formData.birthday} onChange={handleChange} iconPath="/icon/date.svg" />

          <Textbox value={formData.password} onChange={handleChange} name="password" label="Senha" iconPath="/icon/id.svg" placeholder="Insira a senha" type="password" />

          <Textbox value={formData.phone} onChange={handleChange} name="phone" label="Telefone" iconPath="/icon/phone.svg" placeholder="(__)_____-____" type="text" />

          <Textbox value={formData.photo_url} onChange={handleChange} name="photo_url" label="URL da foto" iconPath="/icon/mailbox.svg" placeholder="Insira o link da foto" type="url" />

          <Dropdown label="Modalidade" name="modality" onChange={handleChange} value={formData.modality != null ? formData.modality.id : 0} iconPath="/icon/soccer.svg">
            <option value="">Selecione a modalidade</option>
            {modalities.map((modality) => (
              <option key={modality.id} value={modality.id}>
                {modality.name}
              </option>
            ))}
          </Dropdown>
        </section>

        <section className="w-2/4">
          <Textbox value={formData.cpf} onChange={handleChange} name="cpf" label="CPF" iconPath="/icon/id.svg" placeholder="Insira o CPF" type="text" />

          <Textbox value={formData.rg} onChange={handleChange} name="rg" label="RG" iconPath="/icon/id.svg" placeholder="Insira o RG" type="text" />

          <Textbox value={formData.email} onChange={handleChange} name="email" label="E-mail do professor" iconPath="/icon/mail.svg" placeholder="Insira o e-mail" type="text" />

          <Textbox value={formData.about} onChange={handleChange} name="about" label="Sobre o professor" iconPath="/icon/id.svg" placeholder="Descreva o professor" type="text" multiline={true} />

          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              {professorEdicao ? "Salvar Alterações" : "Cadastrar"}
            </button>
            {professorEdicao && (
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={onCancelEdit}
              >
                Cancelar
              </button>
            )}
          </div>
        </section >
      </form>
    </>
  );
};

export default FormularioProfessores;
