"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import apiService from "@/lib/api";
import { Event, EventPhoto } from "../../types";
import styles from "./Events.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "past" | "open" | "upcoming">(
    "all"
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = (await apiService.getEvents()) as { data?: any[] };
        const eventsData = (response.data || [])
          .map((event: any) => ({
            id: event.id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            dateValue: new Date(event.date), // Para ordenação
            status: event.status,
            image: event.imageUrl || "/images/default-event.jpg",
          }))
          .sort(
            (a: any, b: any) => b.dateValue.getTime() - a.dateValue.getTime()
          ); // Ordenar por data (mais recentes primeiro)
        setEvents(eventsData);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter((event) => event.status === filter);

  const handleEventClick = async (event: Event) => {
    if (event.status === "past") {
      setSelectedEvent(event);
      setIsLoadingPhotos(true);
      try {
        const response = (await apiService.getEventPhotos(event.id)) as {
          data?: EventPhoto[];
        };
        setEventPhotos(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar fotos do evento:", error);
        setEventPhotos([]);
      } finally {
        setIsLoadingPhotos(false);
      }
    } else {
      // Evento futuro - redirecionar para ingressos
      alert(
        `Redirecionando para compra de ingressos: ${event.title}\n\nEm breve você será direcionado para a página de ingressos.`
      );
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setEventPhotos([]);
    setSelectedPhoto(null);
  };

  const openPhotoViewer = (photo: EventPhoto) => {
    setSelectedPhoto(photo);
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return;
    const currentIndex = eventPhotos.findIndex(
      (p) => p.id === selectedPhoto.id
    );
    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : eventPhotos.length - 1;
    } else {
      newIndex = currentIndex < eventPhotos.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedPhoto(eventPhotos[newIndex]);
  };

  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <section id="events" className={styles.events}>
        <div className="container">
          <h2>Eventos</h2>

          <div className={styles.eventFilters}>
            <button
              className={`${styles.filterBtn} ${
                filter === "all" ? styles.active : ""
              }`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`${styles.filterBtn} ${
                filter === "past" ? styles.active : ""
              }`}
              onClick={() => setFilter("past")}
            >
              Eventos Passados
            </button>
            <button
              className={`${styles.filterBtn} ${
                filter === "open" ? styles.active : ""
              }`}
              onClick={() => setFilter("open")}
            >
              Inscrições Abertas
            </button>
            <button
              className={`${styles.filterBtn} ${
                filter === "upcoming" ? styles.active : ""
              }`}
              onClick={() => setFilter("upcoming")}
            >
              Próximos Eventos
            </button>
          </div>

          <div className={styles.eventsCarousel}>
            {isLoading ? (
              <p className={styles.textCenter}>Carregando eventos...</p>
            ) : filteredEvents.length === 0 ? (
              <p className={styles.textCenter}>
                Nenhum evento encontrado para este filtro.
              </p>
            ) : (
              <>
                <button
                  className={styles.navButtonPrev}
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Slide anterior"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className={styles.navButtonNext}
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Próximo slide"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  className={styles.swiperContainer}
                >
                  {filteredEvents.map((event) => (
                    <SwiperSlide key={event.id}>
                      <div className={styles.eventCard}>
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={400}
                          height={200}
                          className={styles.eventImage}
                          style={{ objectFit: "cover" }}
                        />
                        <div className={styles.eventContent}>
                          <div className={styles.eventDate}>{event.date}</div>
                          <h3 className={styles.eventTitle}>{event.title}</h3>
                          <button
                            className={styles.eventBtn}
                            onClick={() => handleEventClick(event)}
                          >
                            {event.status === "past" ? "Fotos" : "Ingressos"}
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal da Galeria de Fotos */}
      {selectedEvent && (
        <div className={`${styles.modal} ${styles.show}`} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={closeModal}>
              &times;
            </button>
            <div className={styles.modalBody}>
              <h2>{selectedEvent.title}</h2>
              <p className={styles.eventDateModal}>{selectedEvent.date}</p>

              {isLoadingPhotos ? (
                <div className={styles.loadingPhotos}>
                  <p>Carregando fotos...</p>
                </div>
              ) : eventPhotos.length > 0 ? (
                <div className={styles.photoGallery}>
                  {eventPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className={styles.photoItem}
                      onClick={() => openPhotoViewer(photo)}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption || `Foto do evento`}
                        width={300}
                        height={200}
                        className={styles.photoThumbnail}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noPhotos}>
                  <p>Nenhuma foto disponível para este evento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visualizador de foto em tela cheia */}
      {selectedPhoto && (
        <div className={styles.photoViewer} onClick={closePhotoViewer}>
          <button
            className={styles.photoViewerClose}
            onClick={closePhotoViewer}
          >
            &times;
          </button>
          <button
            className={`${styles.photoNavBtn} ${styles.photoNavPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("prev");
            }}
          >
            &#8249;
          </button>
          <div
            className={styles.photoViewerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Foto do evento"}
              width={1200}
              height={800}
              className={styles.photoViewerImage}
            />
            {selectedPhoto.caption && (
              <p className={styles.photoCaption}>{selectedPhoto.caption}</p>
            )}
            <p className={styles.photoCounter}>
              {eventPhotos.findIndex((p) => p.id === selectedPhoto.id) + 1} /{" "}
              {eventPhotos.length}
            </p>
          </div>
          <button
            className={`${styles.photoNavBtn} ${styles.photoNavNext}`}
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto("next");
            }}
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
