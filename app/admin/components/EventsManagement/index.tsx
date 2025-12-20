"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import apiService from "@/lib/api";
import ConfirmModal from "@/app/components/ConfirmModal";
import styles from "./EventsManagement.module.css";

interface Event {
  id: number;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  status: "past" | "open" | "upcoming";
  photos?: string;
  active: boolean;
}

interface EventsManagementProps {
  token: string;
  canWrite?: boolean;
  showAddModal?: boolean;
  onCloseAddModal?: () => void;
}

const EventsManagement: React.FC<EventsManagementProps> = ({
  token,
  canWrite = true,
  showAddModal = false,
  onCloseAddModal,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    imageUrl: "",
    status: "upcoming" as "past" | "open" | "upcoming",
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = (await apiService.getEvents()) as { data?: Event[] };
      setEvents(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      alert("Erro ao carregar eventos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Abrir modal quando showAddModal for true (controlado externamente)
  useEffect(() => {
    if (showAddModal) {
      setEditingEvent(null);
      setFormData({
        title: "",
        date: "",
        location: "",
        imageUrl: "",
        status: "upcoming",
      });
      setShowModal(true);
    }
  }, [showAddModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        image_url: formData.imageUrl,
        status: formData.status,
      };

      if (editingEvent) {
        await apiService.updateEvent(editingEvent.id, eventData, token);
      } else {
        await apiService.createEvent(eventData, token);
      }

      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento");
    }
  };

  const handleDelete = (id: number) => {
    setEventToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await apiService.deleteEvent(eventToDelete, token);
      await fetchEvents();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      alert("Erro ao deletar evento");
    } finally {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location || "",
        imageUrl: event.imageUrl || "",
        status: event.status,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        date: "",
        location: "",
        imageUrl: "",
        status: "upcoming",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    // Notificar o componente pai que o modal foi fechado
    if (onCloseAddModal) {
      onCloseAddModal();
    }
  };

  const statusLabels = {
    past: "Evento Realizado",
    open: "Inscrições Abertas",
    upcoming: "Em Breve",
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.loading}>Carregando eventos...</div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-calendar-alt"></i>
              <p>Nenhum evento cadastrado</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventImage}>
                  {event.imageUrl && (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className={styles.eventContent}>
                  <h3>{event.title}</h3>
                  <p className={styles.eventDate}>
                    <i className="fas fa-calendar"></i>
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </p>
                  {event.location && (
                    <p className={styles.eventLocation}>
                      <i className="fas fa-map-marker-alt"></i>
                      {event.location}
                    </p>
                  )}
                  <span
                    className={`${styles.statusBadge} ${styles[event.status]}`}
                  >
                    {statusLabels[event.status]}
                  </span>
                </div>
                {canWrite && (
                  <div className={styles.eventActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openModal(event)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(event.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingEvent ? "Editar Evento" : "Novo Evento"}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "past" | "open" | "upcoming",
                      })
                    }
                  >
                    <option value="upcoming">Em Breve</option>
                    <option value="open">Inscrições Abertas</option>
                    <option value="past">Evento Realizado</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Local</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL da Imagem *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingEvent ? "Salvar Alterações" : "Criar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setEventToDelete(null);
        }}
        danger={true}
      />
    </div>
  );
};

export default EventsManagement;
