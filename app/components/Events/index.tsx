"use client";

import { useState } from "react";
import Image from "next/image";
import { Event } from "../../types";

const eventsData: Event[] = [
  {
    id: 1,
    title: "7ª Edição - Todo Mundo Dança",
    date: "20 de Maio, 2024",
    description:
      "A sétima edição do nosso evento anual que celebra a diversidade e inclusão através da dança. Um espetáculo emocionante com todos os nossos alunos.",
    status: "past",
    image: "/images/7_edicao_todo_mundo_danca.jpeg",
    photos: ["/images/7_edicao_todo_mundo_danca.jpeg"],
  },
  {
    id: 2,
    title: "8ª Edição - Todo Mundo Dança",
    date: "15 de Maio, 2025",
    description:
      "A oitava edição do nosso tradicional evento de inclusão, onde todos os alunos, especiais e regulares, dançam juntos em harmonia perfeita.",
    status: "past",
    image: "/images/8_edicao_todo_mundo_danca.jpeg",
    photos: ["/images/8_edicao_todo_mundo_danca.jpeg"],
  },
  {
    id: 3,
    title: "Espetáculo Sonhos",
    date: "10 de Dezembro, 2023",
    description:
      "Um espetáculo mágico onde os sonhos dos nossos alunos ganharam vida no palco através de coreografias inspiradoras e emocionantes.",
    status: "past",
    image: "/images/sonhos.jpeg",
    photos: ["/images/sonhos.jpeg"],
  },
  {
    id: 4,
    title: "Próxima Fase",
    date: "8 de Setembro, 2023",
    description:
      "Apresentação especial marcando uma nova fase da escola, com coreografias que representam crescimento, evolução e novas conquistas.",
    status: "past",
    image: "/images/proxima_fase.jpeg",
    photos: ["/images/proxima_fase.jpeg"],
  },
];

export default function Events() {
  const [filter, setFilter] = useState<"all" | "past" | "open" | "upcoming">(
    "all"
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents =
    filter === "all"
      ? eventsData
      : eventsData.filter((event) => event.status === filter);

  const statusText = {
    past: "Evento Realizado",
    open: "Inscrições Abertas",
    upcoming: "Em Breve",
  };

  const handleEventClick = (event: Event) => {
    if (event.status === "past") {
      setSelectedEvent(event);
    } else if (event.status === "open") {
      alert(
        `Redirecionando para inscrição no evento: ${event.title}\n\nEm breve você será direcionado para o formulário de inscrição.`
      );
    } else {
      setSelectedEvent(event);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <section id="events" className="events">
        <div className="container">
          <h2>Eventos</h2>

          <div className="event-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${filter === "past" ? "active" : ""}`}
              onClick={() => setFilter("past")}
            >
              Eventos Passados
            </button>
            <button
              className={`filter-btn ${filter === "open" ? "active" : ""}`}
              onClick={() => setFilter("open")}
            >
              Inscrições Abertas
            </button>
            <button
              className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Próximos Eventos
            </button>
          </div>

          <div className="events-grid">
            {filteredEvents.length === 0 ? (
              <p className="text-center">
                Nenhum evento encontrado para este filtro.
              </p>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="event-image"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="event-content">
                    <div className="event-date">{event.date}</div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <span className={`event-status status-${event.status}`}>
                      {statusText[event.status]}
                    </span>
                    {event.price && (
                      <p>
                        <strong>Valor:</strong> {event.price}
                      </p>
                    )}
                    <button
                      className={`event-btn ${
                        event.status === "upcoming" ? "secondary" : ""
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.status === "past"
                        ? "Ver Fotos"
                        : event.status === "open"
                        ? "Inscrever-se"
                        : "Mais Informações"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <div className="modal show" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-body">
              <h2>{selectedEvent.title}</h2>
              <p>
                <strong>Data:</strong> {selectedEvent.date}
              </p>
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                width={600}
                height={300}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  margin: "1rem 0",
                }}
              />
              <p>{selectedEvent.description}</p>
              {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                <>
                  <h3>Fotos do Evento</h3>
                  <div className="modal-photos">
                    {selectedEvent.photos.map((photo, index) => (
                      <Image
                        key={index}
                        src={photo}
                        alt="Foto do evento"
                        width={150}
                        height={120}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
              {selectedEvent.price && (
                <p>
                  <strong>Valor:</strong> {selectedEvent.price}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
