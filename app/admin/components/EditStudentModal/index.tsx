import { AdminStudent, Class } from "@/app/types";
import styles from "./EditStudentModal.module.css";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newStudent: Partial<AdminStudent>;
  setNewStudent: (student: Partial<AdminStudent>) => void;
  addressData: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  setAddressData: (data: any) => void;
  loadingCep: boolean;
  onCepSearch: (cep: string) => void;
  classes: Class[];
  onUpdateStudent: () => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  newStudent,
  setNewStudent,
  addressData,
  setAddressData,
  loadingCep,
  onCepSearch,
  classes,
  onUpdateStudent,
}: EditStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3>Editar Aluno</h3>
          <button className={styles.modalClose} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Nome Completo *</label>
            <input
              type="text"
              className={styles.formInput}
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Nome do aluno"
            />
          </div>
          <div>
            <label className={styles.formLabel}>E-mail *</label>
            <input
              type="email"
              className={styles.formInput}
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              placeholder="email@espacodancafernandabecker.com"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Telefone *</label>
            <input
              type="tel"
              className={styles.formInput}
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phone: e.target.value })
              }
              placeholder="(41) 98765-4321"
            />
          </div>
          <div>
            <label className={styles.formLabel}>Responsável</label>
            <input
              type="text"
              className={styles.formInput}
              value={newStudent.guardian || ""}
              onChange={(e) =>
                setNewStudent({ ...newStudent, guardian: e.target.value })
              }
              placeholder="Nome do responsável"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Data de Nascimento *</label>
            <input
              type="date"
              className={styles.formInput}
              value={newStudent.birthDate}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  birthDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>CPF *</label>
            <input
              type="text"
              className={styles.formInput}
              value={newStudent.cpf}
              onChange={(e) =>
                setNewStudent({ ...newStudent, cpf: e.target.value })
              }
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className={styles.formLabel}>RG *</label>
            <input
              type="text"
              className={styles.formInput}
              value={newStudent.rg}
              onChange={(e) =>
                setNewStudent({ ...newStudent, rg: e.target.value })
              }
              placeholder="00.000.000-0"
            />
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>CEP *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.cep}
              onChange={(e) => {
                const value = e.target.value;
                setAddressData({ ...addressData, cep: value });
                onCepSearch(value);
              }}
              placeholder="00000-000"
              maxLength={9}
            />
            {loadingCep && (
              <p className={styles.loadingText}>Buscando CEP...</p>
            )}
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>Rua/Avenida *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.street}
              onChange={(e) =>
                setAddressData({ ...addressData, street: e.target.value })
              }
              placeholder="Nome da Rua"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Número *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.number}
              onChange={(e) =>
                setAddressData({ ...addressData, number: e.target.value })
              }
              placeholder="123"
            />
          </div>
          <div>
            <label className={styles.formLabel}>Complemento</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.complement}
              onChange={(e) =>
                setAddressData({
                  ...addressData,
                  complement: e.target.value,
                })
              }
              placeholder="Apto, Bloco, etc"
            />
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>Bairro *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.neighborhood}
              onChange={(e) =>
                setAddressData({
                  ...addressData,
                  neighborhood: e.target.value,
                })
              }
              placeholder="Nome do Bairro"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Cidade *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.city}
              onChange={(e) =>
                setAddressData({ ...addressData, city: e.target.value })
              }
              placeholder="Nome da Cidade"
            />
          </div>
          <div>
            <label className={styles.formLabel}>Estado *</label>
            <input
              type="text"
              className={styles.formInput}
              value={addressData.state}
              onChange={(e) =>
                setAddressData({ ...addressData, state: e.target.value })
              }
              placeholder="UF"
              maxLength={2}
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.formLabel}>Turma *</label>
            <select
              className={styles.formSelect}
              value={newStudent.classId}
              onChange={(e) =>
                setNewStudent({ ...newStudent, classId: e.target.value })
              }
            >
              <option value="">Selecione uma turma</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} ({classItem.currentStudents}/
                  {classItem.maxStudents})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>
              Possui alguma deficiência?
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="editHasDisability"
                  checked={newStudent.hasDisability === false}
                  onChange={() =>
                    setNewStudent({
                      ...newStudent,
                      hasDisability: false,
                      disabilityDescription: "",
                    })
                  }
                />
                Não
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="editHasDisability"
                  checked={newStudent.hasDisability === true}
                  onChange={() =>
                    setNewStudent({ ...newStudent, hasDisability: true })
                  }
                />
                Sim
              </label>
            </div>
            {newStudent.hasDisability && (
              <input
                type="text"
                className={styles.formInput}
                value={newStudent.disabilityDescription}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    disabilityDescription: e.target.value,
                  })
                }
                placeholder="Descreva a deficiência"
                style={{ marginTop: "1rem" }}
              />
            )}
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>Toma algum medicamento?</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="editTakesMedication"
                  checked={newStudent.takesMedication === false}
                  onChange={() =>
                    setNewStudent({
                      ...newStudent,
                      takesMedication: false,
                      medicationDescription: "",
                    })
                  }
                />
                Não
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="editTakesMedication"
                  checked={newStudent.takesMedication === true}
                  onChange={() =>
                    setNewStudent({
                      ...newStudent,
                      takesMedication: true,
                    })
                  }
                />
                Sim
              </label>
            </div>
            {newStudent.takesMedication && (
              <input
                type="text"
                className={styles.formInput}
                value={newStudent.medicationDescription}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    medicationDescription: e.target.value,
                  })
                }
                placeholder="Descreva os medicamentos"
                style={{ marginTop: "1rem" }}
              />
            )}
          </div>
        </div>

        <div className={`${styles.formGrid} ${styles.full}`}>
          <div>
            <label className={styles.formLabel}>
              Métodos de Pagamento Habilitados *
            </label>
            <div className={styles.paymentMethods}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newStudent.paymentMethods?.includes("pix")}
                  onChange={(e) => {
                    const methods = newStudent.paymentMethods || [];
                    if (e.target.checked) {
                      setNewStudent({
                        ...newStudent,
                        paymentMethods: [...methods, "pix"],
                      });
                    } else {
                      setNewStudent({
                        ...newStudent,
                        paymentMethods: methods.filter((m) => m !== "pix"),
                      });
                    }
                  }}
                />
                <i className="fas fa-qrcode"></i>
                PIX
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newStudent.paymentMethods?.includes("boleto")}
                  onChange={(e) => {
                    const methods = newStudent.paymentMethods || [];
                    if (e.target.checked) {
                      setNewStudent({
                        ...newStudent,
                        paymentMethods: [...methods, "boleto"],
                      });
                    } else {
                      setNewStudent({
                        ...newStudent,
                        paymentMethods: methods.filter((m) => m !== "boleto"),
                      });
                    }
                  }}
                />
                <i className="fas fa-barcode"></i>
                Boleto
              </label>
            </div>
            <p className={styles.helperText}>
              Selecione ao menos um método de pagamento para o aluno
            </p>
          </div>
        </div>

        <div className={styles.formButtons}>
          <button
            className={`${styles.formButton} ${styles.secondary}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${styles.formButton} ${styles.primary}`}
            onClick={onUpdateStudent}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
